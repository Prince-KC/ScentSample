# 🚀 ScentSampleNepal — AWS Hosting & Deployment Guide

> Complete step-by-step guide to deploy ScentSampleNepal (MERN stack) on AWS EC2 using  
> CloudFormation, Nginx, PM2, and GitHub Actions CI/CD.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [What Was Done — Full Explanation](#2-what-was-done--full-explanation)
3. [The 4 Infrastructure Files Created](#3-the-4-infrastructure-files-created)
4. [One-Time Setup Steps](#4-one-time-setup-steps)
5. [GitHub Secrets & Variables Required](#5-github-secrets--variables-required)
6. [How Deployment Works (Step by Step)](#6-how-deployment-works-step-by-step)
7. [How the API Routing Works in Production](#7-how-the-api-routing-works-in-production)
8. [After Deployment — Useful Commands](#8-after-deployment--useful-commands)
9. [Troubleshooting Common Issues](#9-troubleshooting-common-issues)
10. [AWS Lab Expiry Recovery](#10-aws-lab-expiry-recovery)

---

## 1. Architecture Overview

```
                        [ USER / BROWSER ]
                               |
                     http://<EC2-IP> (Port 80)
                               |
              +----------------v----------------+
              |        AWS EC2 Instance          |
              |       Ubuntu 24.04 LTS           |
              |                                  |
              |   +---------------------------+  |
              |   |   NGINX (Port 80)         |  |
              |   |   Reverse Proxy           |  |
              |   +----------+----------------+  |
              |              |                   |
              |    +---------+----------+        |
              |    |                    |        |
              |    v                    v        |
              |  /frontend/dist    /api/* ->     |
              |  (React HTML,      Express        |
              |   CSS, JS)         Port 8000      |
              |                    (via PM2)      |
              +--------------------+-------------+
                                   |
                            MongoDB Atlas
                         (Cloud DB -- 24/7)
```

**Key principles:**
| Component | Role |
|---|---|
| **Nginx** | Serves React frontend files + proxies `/api/*` to Express backend |
| **PM2** | Keeps Express backend running 24/7, auto-restarts on crash/reboot |
| **CloudFormation** | Creates the EC2 server automatically via code — no manual AWS console clicks |
| **SSM Parameter Store** | Stores the SSH private key securely inside AWS (no manual key copying) |
| **GitHub Actions** | On every `git push main`, automatically builds and deploys the new code |
| **MongoDB Atlas** | Cloud database — lives outside EC2, persists across server reboots |

---

## 2. What Was Done — Full Explanation

Here is everything that was set up for this project, explained plainly:

### 2.1 Project Structure Analysed

The project has this layout:

```
ScentSampleNepal/
├── backend/            <- Express.js API (port 8000, ES modules)
│   ├── index.js        <- Entry point: starts server on PORT env var
│   ├── package.json    <- "type": "module" (ES modules)
│   ├── ecosystem.config.cjs  <- PM2 config (NEW -- created for deployment)
│   ├── .env.example    <- Environment variable template (NEW)
│   └── src/
│       ├── connectToDb.js    <- Reads MONGO_URI from env
│       └── routes/     <- /product, /user, /review, /order
├── frontend/           <- React + Vite (builds to frontend/dist/)
│   └── src/
├── infra/              <- Infrastructure files (NEW -- created for deployment)
│   ├── ec2-instance.yaml   <- AWS CloudFormation template
│   └── nginx.conf          <- Nginx web server config
├── .github/
│   └── workflows/
│       └── deploy.yml  <- GitHub Actions CI/CD pipeline (NEW)
└── hosting.md          <- This file
```

### 2.2 The `/api` Routing Strategy

The biggest challenge: the Express backend routes are `/product`, `/user`, `/review`, `/order` — no `/api` prefix.  
But in production, the frontend and backend both run behind the **same Nginx on port 80**, so we need a way to tell Nginx "this request goes to Express, not to the React app."

**Solution used:** Nginx `/api/` proxy with prefix stripping via `rewrite`:

```
Browser sends:  GET /api/product
Nginx rewrites: GET /product         -> forwards to Express on port 8000
Express sees:   GET /product         -> responds normally
```

This means **the Express code is not changed at all**. Only the frontend API calls and Nginx config needed to handle this.

The frontend build in GitHub Actions sets `VITE_API_URL=/api` as an environment variable, so React sends all API requests to `/api/...` in production while keeping `http://localhost:8000` for local development.

### 2.3 MongoDB — Local vs Production

| Environment | Connection |
|---|---|
| **Local dev** | `mongodb://127.0.0.1:27017/scentSampleNepal` (your PC's MongoDB) |
| **Production** | `MONGO_URI=mongodb+srv://...@atlas...` (MongoDB Atlas cloud) |

The `connectToDb.js` already reads `process.env.MONGO_URI`, so no code change is needed. The GitHub Actions workflow writes the Atlas URI into a `.env` file on the server automatically.

### 2.4 PM2 — Why `.cjs` Extension

The backend `package.json` has `"type": "module"`, which makes Node.js treat all `.js` files as ES modules. PM2's config file uses `module.exports = {...}` which is **CommonJS** syntax — this would crash with a `.js` extension. So the config is named `ecosystem.config.cjs` to force CommonJS loading regardless of `"type": "module"`.

---

## 3. The 4 Infrastructure Files Created

### File 1: `infra/ec2-instance.yaml` — CloudFormation Template

**What it does:**
- Creates an EC2 `t2.micro` Ubuntu 24.04 server (free tier)
- Creates an SSH key pair and saves the private key to **AWS SSM Parameter Store** automatically
- Opens **Port 80** (HTTP for website) and **Port 22** (SSH for GitHub Actions)
- On first boot, automatically: installs Node.js 22, Nginx, Git, PM2, clones your repo, and configures Nginx

> **IMPORTANT:** Before using, replace `YOUR_GITHUB_USERNAME` in the `git clone` line inside `UserData` with your actual GitHub username.

---

### File 2: `infra/nginx.conf` — Web Server Configuration

**What it does:**
- Listens on Port 80 (public internet)
- Serves `frontend/dist/` as the React app (with SPA fallback for React Router)
- Proxies all requests to `/api/*` → Express backend on port 8000 (strips the `/api` prefix using `rewrite`)
- Adds a `/health` endpoint used by GitHub Actions to verify the server is live
- Logs access and errors to `/var/log/nginx/scentsamplenepal.*.log`

---

### File 3: `backend/ecosystem.config.cjs` — PM2 Process Manager Config

**What it does:**
- Tells PM2 to run `index.js` from `/var/www/app/backend/`
- Sets `NODE_ENV=production` and `PORT=8000`
- Enables auto-restart on crash and after system reboots
- Sets memory limit to 300MB (restarts if exceeded)
- Writes logs to `/var/log/pm2/`

> **Note:** Uses `.cjs` extension (not `.js`) because the backend is ES modules (`"type": "module"`). CommonJS config files must use `.cjs`.

---

### File 4: `.github/workflows/deploy.yml` — GitHub Actions CI/CD Pipeline

**What it does (9 steps, runs on every `git push` to `main`):**

| Step | Action |
|---|---|
| 1 | Checkout your code |
| 2 | Set up Node.js 22 with npm caching |
| 3 | Build the React frontend (`npm run build`) with `VITE_API_URL=/api` |
| 4 | Configure AWS credentials from GitHub Secrets |
| 5 | Create the CloudFormation stack if it doesn't exist yet |
| 6 | Fetch the EC2 public IP and SSH key from AWS SSM |
| 7 | Wait for the EC2 server to accept SSH (up to 4 minutes) |
| 8 | SSH into server: pull code, write `.env`, install deps, rebuild frontend, reload Nginx, restart PM2 |
| 9 | Hit `/health` endpoint to confirm the site is live |

---

### Bonus File: `backend/.env.example`

A template showing all required environment variables. Copy it to `.env` for local dev. Never commit `.env` to Git.

---

## 4. One-Time Setup Steps

Follow these steps **once** before your first deployment.

### Step 1 — Set Up MongoDB Atlas (Free Cloud Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → **Create a free account**
2. Create a **Free M0 cluster** (choose any region)
3. Under **Database Access** → Add a user (e.g., `scentsamplenepal`) with a strong password
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere — EC2 IP changes on reboot)
5. Click **Connect** → **Connect your application** → Copy the connection string:
   ```
   mongodb+srv://scentsamplenepal:<password>@cluster0.xxxxx.mongodb.net/scentSampleNepal?retryWrites=true&w=majority
   ```
6. **Replace `<password>`** with your actual password — save this string, you'll need it for GitHub Secrets.

---

### Step 2 — Collect AWS Credentials

**If using AWS Learner Lab:**
1. Open the Learner Lab → click **AWS Details**
2. Copy:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_SESSION_TOKEN`
3. Note: These expire when the lab session ends — update secrets each new session

**If using a real AWS account:**
1. Go to IAM → Create a user with `AdministratorAccess` (or at minimum: EC2, CloudFormation, SSM)
2. Create Access Keys under that user
3. Copy `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` (no session token needed)

---

### Step 3 — Edit the CloudFormation File

Open `infra/ec2-instance.yaml` and find this line inside `UserData`:

```yaml
git clone https://github.com/YOUR_GITHUB_USERNAME/ScentSampleNepal.git /var/www/app
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username, e.g.:

```yaml
git clone https://github.com/john123/ScentSampleNepal.git /var/www/app
```

---

### Step 4 — Add GitHub Secrets & Variables

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

#### Secrets (encrypted, never shown again):

| Secret Name | Value | Where to get it |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | `AKIA...` | AWS Learner Lab / IAM |
| `AWS_SECRET_ACCESS_KEY` | `wJalr...` | AWS Learner Lab / IAM |
| `AWS_SESSION_TOKEN` | `IQoJb...` | AWS Learner Lab only (omit for real account) |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas Step 1 |
| `JWT_SECRET` | Any long random string | Make one up — e.g., `scent$nepal#2026!jwt` |

#### Variables (plain text, visible):

| Variable Name | Value |
|---|---|
| `AWS_REGION` | `us-east-1` (or your chosen region) |

---

### Step 5 — Push to GitHub and Deploy

```bash
git add .
git commit -m "Add AWS hosting infrastructure"
git push origin main
```

Go to your repo → **Actions** tab → watch the deployment pipeline run.  
When all 9 steps show green checkmarks, your site is live!

---

## 5. GitHub Secrets & Variables Required

| Name | Type | Required | Description |
|---|---|---|---|
| `AWS_ACCESS_KEY_ID` | Secret | Always | AWS identity key |
| `AWS_SECRET_ACCESS_KEY` | Secret | Always | AWS identity secret |
| `AWS_SESSION_TOKEN` | Secret | Lab only | Temporary session (Learner Lab only) |
| `MONGO_URI` | Secret | Always | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret | Always | Secret key for signing login tokens |
| `AWS_REGION` | Variable | Always | AWS region (e.g., `us-east-1`) |

---

## 6. How Deployment Works (Step by Step)

```
You: git push origin main
        |
        v
GitHub Actions starts automatically
        |
        +- Builds React frontend (npm run build, VITE_API_URL=/api)
        |
        +- Authenticates with AWS using your secrets
        |
        +- Checks if CloudFormation stack exists
        |   +- If not: creates EC2 server, waits for it to boot (~3 min)
        |   +- If yes: skips creation, uses existing server
        |
        +- Fetches EC2 IP address from CloudFormation outputs
        |
        +- Fetches SSH private key from AWS SSM Parameter Store
        |
        +- Waits for SSH port to be open (up to 4 minutes)
        |
        +- SSH into server and runs:
        |   git pull origin main              <- new code
        |   echo "MONGO_URI=..." > .env       <- secrets injected
        |   npm ci --omit=dev                 <- backend deps
        |   npm run build                     <- frontend rebuilt
        |   sudo systemctl reload nginx       <- web server reloaded
        |   pm2 startOrReload ecosystem.cjs  <- backend restarted
        |
        +- Curls /health endpoint -> confirms site is up
```

---

## 7. How the API Routing Works in Production

This is the most important thing to understand:

```
LOCAL DEV:
  React (port 5173) -> axios.get("http://localhost:8000/product")
  Express (port 8000) -> handles /product directly

PRODUCTION:
  Browser -> nginx (port 80)
  
  React app served from: /var/www/app/frontend/dist/
  API calls go to:        GET /api/product
  
  Nginx sees /api/product:
    rewrites to /product
    proxy_pass to http://127.0.0.1:8000
  
  Express (port 8000, internal) -> handles /product -> responds OK
```

> **Tip:** To make your frontend work in both environments, use an env variable:
> ```js
> // In any component that calls the API:
> const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
> axios.get(`${BASE_URL}/product`);
> ```
> GitHub Actions sets `VITE_API_URL=/api` at build time, local dev falls back to `http://localhost:8000`.

---

## 8. After Deployment — Useful Commands

SSH into your server first:
```bash
ssh -i your-key.pem ubuntu@<EC2-IP>
```

### PM2 — Backend Process Manager

```bash
pm2 status                             # Show running processes
pm2 logs scentsamplenepal-backend      # Stream live logs
pm2 restart scentsamplenepal-backend   # Restart backend
pm2 stop scentsamplenepal-backend      # Stop backend
pm2 reload ecosystem.config.cjs        # Zero-downtime reload
```

### Nginx — Web Server

```bash
sudo systemctl status nginx            # Check if Nginx is running
sudo nginx -t                          # Test config for syntax errors
sudo systemctl reload nginx            # Apply config changes (no downtime)
sudo systemctl restart nginx           # Full restart
sudo cat /var/log/nginx/scentsamplenepal.error.log  # View errors
```

### Git — Update Code Manually

```bash
cd /var/www/app
git pull origin main                   # Pull latest code
```

### App — Get Live URL

```bash
aws cloudformation describe-stacks \
  --stack-name scentsamplenepal-stack \
  --query "Stacks[0].Outputs[?OutputKey=='PublicURL'].OutputValue" \
  --output text
```

---

## 9. Troubleshooting Common Issues

| Problem | Likely Cause | Fix |
|---|---|---|
| GitHub Actions fails at "Configure AWS credentials" | Learner Lab expired / wrong secrets | Update the 3 AWS secrets in GitHub Settings |
| Site loads but API calls return 502 Bad Gateway | PM2 / backend not running | SSH in → `pm2 status` → `pm2 restart scentsamplenepal-backend` |
| Site shows blank white page | Frontend build failed or wrong `root` in nginx.conf | Check `/var/log/nginx/scentsamplenepal.error.log` |
| MongoDB connection error in logs | Wrong `MONGO_URI` or Atlas IP not whitelisted | Check Atlas Network Access → ensure `0.0.0.0/0` is added |
| `/api/product` returns 404 | Nginx rewrite not applied | SSH in → `sudo nginx -t` → `sudo systemctl reload nginx` |
| SSH timeout in deployment | EC2 just created, still booting | Wait 3-5 min and re-push |
| `pm2: command not found` on server | PM2 not installed (UserData failed) | SSH in → `sudo npm install -g pm2` |

---

## 10. AWS Lab Expiry Recovery

AWS Learner Lab sessions expire (usually after a few hours). When this happens:

1. **Start a new lab session** in AWS Academy
2. **Update 3 GitHub Secrets** with the new credentials:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_SESSION_TOKEN`
3. The old EC2 instance may be **terminated** — that's fine. Push any commit to `main`:
   ```bash
   git commit --allow-empty -m "Redeploy after lab reset"
   git push origin main
   ```
4. GitHub Actions will detect the CloudFormation stack is gone, **create a new EC2 server**, and deploy everything automatically.

> **Note:** MongoDB Atlas data **persists across lab resets** because it lives in the cloud, not on the EC2 server. Your seeded products, users, and orders are safe.

---

*Last updated: November 2026 | Stack: Node.js 22 · React 19 · Vite 8 · Express 5 · MongoDB Atlas · AWS EC2 t2.micro · Ubuntu 24.04 · Nginx · PM2 · GitHub Actions*
