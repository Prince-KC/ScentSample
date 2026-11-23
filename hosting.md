# 🚀 ScentSampleNepal — AWS Hosting & Deployment Guide

> Complete step-by-step guide to deploy ScentSampleNepal (MERN stack) on AWS EC2 using
> CloudFormation, Nginx, PM2, and GitHub Actions CI/CD.

---

## Project Info

| Field | Value |
|---|---|
| **GitHub Repo** | https://github.com/Prince-KC/ScentSample |
| **GitHub Username** | `Prince-KC` |
| **Repository Name** | `ScentSample` |
| **Active EC2 IP** | `54.227.62.183` (or check GitHub Actions output) |
| **MongoDB Atlas Cluster** | `cluster0.4i4h5r0.mongodb.net` |
| **MongoDB DB Name** | `scentSampleNepal` |
| **MongoDB Atlas User** | `princekca25_db_user` |
| **Backend Port** | `8000` |
| **AWS Region** | `us-east-1` |
| **EC2 Stack Name** | `scentsamplenepal-stack` |
| **EC2 Instance Type** | `t2.micro` (Free Tier) |

---

## ✅ Setup Checklist (Everything Configured)

- [x] MongoDB Atlas free cluster created (`cluster0.4i4h5r0.mongodb.net`)
- [x] MongoDB Atlas database user created (`princekca25_db_user`)
- [x] Network Access set to `0.0.0.0/0` (open to all IPs)
- [x] AWS Learner Lab credentials collected
- [x] GitHub Secrets added (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `MONGO_URI`, `JWT_SECRET`)
- [x] GitHub Variable added (`AWS_REGION = us-east-1`)
- [x] `infra/ec2-instance.yaml` created with correct repo URL
- [x] `infra/nginx.conf` created
- [x] `backend/ecosystem.config.cjs` created
- [x] `.github/workflows/deploy.yml` created with auto-healing deploy script
- [x] `.gitignore` configured to keep `node_modules` out of Git
- [x] Code pushed to `main` branch — automatic CI/CD deployment running

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [What Was Done — Full Explanation](#2-what-was-done--full-explanation)
3. [The 4 Infrastructure Files Created](#3-the-4-infrastructure-files-created)
4. [GitHub Secrets & Variables](#4-github-secrets--variables)
5. [How Deployment Works (Step by Step)](#5-how-deployment-works-step-by-step)
6. [How the API Routing Works in Production](#6-how-the-api-routing-works-in-production)
7. [After Deployment — Useful Commands](#7-after-deployment--useful-commands)
8. [Real-World Deployment Fixes & Solutions](#8-real-world-deployment-fixes--solutions)
9. [AWS Lab Expiry Recovery](#9-aws-lab-expiry-recovery)

---

## 1. Architecture Overview

```
                        [ USER / BROWSER ]
                               |
                     http://<EC2-IP> (Port 80)
                               |
              +----------------v----------------+
              |        AWS EC2 Instance          |
              |  Ubuntu 24.04 LTS  (t2.micro)   |
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
                      MongoDB Atlas (Cloud DB)
                  cluster0.4i4h5r0.mongodb.net
                       Database: scentSampleNepal
```

**Key components:**
| Component | Role |
|---|---|
| **Nginx** | Serves React frontend + proxies `/api/*` to Express backend |
| **PM2** | Keeps Express backend running 24/7, auto-restarts on crash/reboot |
| **CloudFormation** | Creates the EC2 server automatically via code — no manual AWS clicks |
| **SSM Parameter Store** | Stores the SSH private key securely inside AWS |
| **GitHub Actions** | Auto-deploys on every `git push origin main` |
| **MongoDB Atlas** | Cloud database — lives outside EC2, persists across reboots |

---

## 2. What Was Done — Full Explanation

### 2.1 Project Structure

```
ScentSample/                        (GitHub repo name)
├── .github/
│   └── workflows/
│       └── deploy.yml              GitHub Actions CI/CD pipeline
├── backend/
│   ├── index.js                    Entry point — Express on port 8000
│   ├── package.json                "type": "module" (ES modules)
│   ├── ecosystem.config.cjs        PM2 config (CommonJS)
│   ├── .env.example                Env variable template
│   └── src/
│       ├── connectToDb.js          Reads process.env.MONGO_URI
│       └── routes/                 /product, /user, /review, /order
├── frontend/
│   ├── src/                        React + Vite app
│   └── (builds to frontend/dist/)
├── infra/
│   ├── ec2-instance.yaml           AWS CloudFormation template
│   └── nginx.conf                  Nginx web server config
├── .gitignore                      Prevents node_modules & secrets in Git
└── hosting.md                      This file
```

### 2.2 The `/api` Routing Strategy

Express routes are `/product`, `/user`, `/review`, `/order` — without an `/api` prefix.
In production, Nginx strips `/api` before forwarding to Express:

```
Browser sends:   GET /api/product
Nginx rewrites:  GET /product      -> Express on port 8000
Express sees:    GET /product      -> responds OK
```

Express code is NOT changed. GitHub Actions sets `VITE_API_URL=/api` at build time.

### 2.3 MongoDB — Local vs Production

| Environment | Connection |
|---|---|
| **Local dev** | `mongodb://127.0.0.1:27017/scentSampleNepal` |
| **Production** | `mongodb+srv://princekca25_db_user:...@cluster0.4i4h5r0.mongodb.net/scentSampleNepal` |

`connectToDb.js` reads `process.env.MONGO_URI` — no code change needed.

### 2.4 PM2 — Why `.cjs` Extension

`backend/package.json` has `"type": "module"` (ES modules). PM2 config uses `module.exports`
(CommonJS). Using `.cjs` extension forces Node.js to treat it as CommonJS regardless.

---

## 3. The 4 Infrastructure Files Created

### File 1: `infra/ec2-instance.yaml`
- Creates EC2 `t2.micro` Ubuntu 24.04 server
- SSH key auto-saved to AWS SSM Parameter Store
- Opens Port 80 (HTTP) and Port 22 (SSH)
- UserData bootstrap installs Node.js 22, Nginx, Git, PM2

### File 2: `infra/nginx.conf`
- Serves `frontend/dist/` as the React SPA
- Proxies `/api/*` → Express port 8000 (strips `/api` prefix with `rewrite`)
- `/health` endpoint for GitHub Actions verification
- Logs to `/var/log/nginx/scentsamplenepal.*.log`

### File 3: `backend/ecosystem.config.cjs`
- Runs `index.js` from `/var/www/app/backend/`
- `NODE_ENV=production`, `PORT=8000`
- Auto-restart on crash, memory limit 300MB
- Logs to `/var/log/pm2/`

### File 4: `.github/workflows/deploy.yml`
9-step pipeline that runs on every `git push origin main`:

| Step | Action |
|---|---|
| 1 | Checkout code |
| 2 | Set up Node.js 22 |
| 3 | Build React frontend (`VITE_API_URL=/api npm run build`) |
| 4 | Configure AWS credentials from GitHub Secrets |
| 5 | Create CloudFormation stack (EC2 server) if not exists |
| 6 | Fetch EC2 IP + SSH key from AWS SSM |
| 7 | Wait for SSH to be ready (up to 4 min) |
| 8 | SSH in: wait for cloud-init, pull/clone code, write `.env`, install deps, rebuild frontend, reload Nginx, restart PM2 |
| 9 | Curl `/health` to confirm site is live |

---

## 4. GitHub Secrets & Variables

### Repository: https://github.com/Prince-KC/ScentSample → Settings → Secrets and variables → Actions

#### Secrets ✅ (Configured)

| Secret Name | Status | Notes |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | ✅ Configured | From AWS Learner Lab → AWS Details |
| `AWS_SECRET_ACCESS_KEY` | ✅ Configured | From AWS Learner Lab → AWS Details |
| `AWS_SESSION_TOKEN` | ✅ Configured | From AWS Learner Lab (expires each session!) |
| `MONGO_URI` | ✅ Configured | `mongodb+srv://princekca25_db_user:...@cluster0.4i4h5r0.mongodb.net/scentSampleNepal?retryWrites=true&w=majority` |
| `JWT_SECRET` | ✅ Configured | Random string for signing login tokens |

#### Variables ✅ (Configured)

| Variable Name | Value | Status |
|---|---|---|
| `AWS_REGION` | `us-east-1` | ✅ Configured |

---

## 5. How Deployment Works (Step by Step)

```
git push origin main
        |
        v
GitHub Actions triggers automatically
        |
        +-- Build React frontend (VITE_API_URL=/api)
        |
        +-- Authenticate with AWS (using GitHub Secrets)
        |
        +-- Check CloudFormation stack "scentsamplenepal-stack"
        |     If missing -> create EC2 server (~3-5 min to boot)
        |     If exists  -> skip, use existing server
        |
        +-- Get EC2 public IP from CloudFormation outputs
        +-- Get SSH private key from AWS SSM Parameter Store
        |
        +-- Wait for EC2 SSH to be ready
        |
        +-- SSH into server and run:
        |     Wait for instance cloud-init to finish
        |     git clone / git pull
        |     Write .env (MONGO_URI, JWT_SECRET, PORT=8000)
        |     npm install --omit=dev  (backend)
        |     npm install --include=dev && npm run build  (frontend)
        |     sudo systemctl restart nginx
        |     pm2 startOrReload ecosystem.config.cjs
        |
        +-- curl http://<EC2-IP>/health -> confirm site is up
```

---

## 6. How the API Routing Works in Production

```
LOCAL DEV:
  React (port 5173) -> axios.get("http://localhost:8000/product")
  Express (port 8000) handles /product directly

PRODUCTION:
  Browser -> Nginx (port 80) -> http://<EC2-IP>

  Request: GET /api/product
  Nginx rewrite: strips /api -> GET /product
  Nginx proxy_pass: http://127.0.0.1:8000/product
  Express responds -> Nginx returns to browser
```

---

## 7. After Deployment — Useful Commands

SSH into server:
```bash
ssh -i your-key.pem ubuntu@<EC2-IP>
```

### PM2 — Backend

```bash
pm2 status                              # View all running processes
pm2 logs scentsamplenepal-backend       # Live log stream
pm2 restart scentsamplenepal-backend    # Restart
pm2 reload ecosystem.config.cjs        # Zero-downtime reload
```

### Nginx — Web Server

```bash
sudo systemctl status nginx             # Is Nginx running?
sudo nginx -t                           # Test config syntax
sudo systemctl reload nginx             # Apply changes (no downtime)
sudo cat /var/log/nginx/scentsamplenepal.error.log   # View errors
```

---

## 8. Real-World Deployment Fixes & Solutions

Here are the specific issues diagnosed and resolved during our deployment:

### 1. `EBADPLATFORM: Unsupported platform for @oxlint/binding-win32`
- **Cause:** `package-lock.json` generated on Windows recorded Windows-only native binary dependencies. When running on GitHub's Ubuntu Linux runner with `npm ci`, npm failed.
- **Solution:** Switched from `npm ci` to `npm install` and removed the Windows lockfiles so Linux installs pure Linux binaries.

### 2. `sh: 1: vite: not found`
- **Cause:** Vite was in `devDependencies`, which CI tools can omit in production contexts.
- **Solution:** Moved `vite` and `@vitejs/plugin-react` to `dependencies` in `frontend/package.json` and added `--include=dev` to `npm install`.

### 3. `sh: 1: vite: Permission denied`
- **Cause:** The local `node_modules` folder was accidentally committed to Git from Windows. In Git, Windows binaries lose Linux executable flags (`+x`).
- **Solution:** Ran `git rm -r --cached` on `node_modules`, added `.gitignore`, and added `chmod -R +x node_modules/.bin` in the workflow.

### 4. `cd: /var/www/app: No such file or directory`
- **Cause:** On a brand new EC2 instance, GitHub Actions connected via SSH before the EC2 bootstrap UserData script had finished cloning the code.
- **Solution:** Added a wait loop for `/var/lib/cloud/instance/boot-finished` and an auto-clone fallback directly in Step 8.

---

## 9. AWS Lab Expiry Recovery

When your Learner Lab session resets (every few hours):

1. **Start a new lab session** in AWS Academy and click "AWS Details"
2. **Update 3 GitHub Secrets** with the new values:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_SESSION_TOKEN`
3. **Trigger a new deployment:**
   ```bash
   git commit --allow-empty -m "Redeploy: new lab session"
   git push origin main
   ```
4. GitHub Actions will handle everything automatically.

> **MongoDB Atlas data is safe in the cloud** — products, users, and orders persist across all lab resets.

---

## MongoDB Connection Reference

```
Cluster:   cluster0.4i4h5r0.mongodb.net
Database:  scentSampleNepal
User:      princekca25_db_user
Full URI:  mongodb+srv://princekca25_db_user:<password>@cluster0.4i4h5r0.mongodb.net/scentSampleNepal?retryWrites=true&w=majority
```

---

*Last updated: November 2026 | Stack: Node.js 22 · React 19 · Vite 8 · Express 5 · MongoDB Atlas · AWS EC2 t2.micro · Ubuntu 24.04 · Nginx · PM2 · GitHub Actions*
