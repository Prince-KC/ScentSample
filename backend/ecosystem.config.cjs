// PM2 Process Manager Configuration for ScentSampleNepal Backend
// IMPORTANT: This file MUST use .cjs extension because backend/package.json
// has "type": "module" (ES modules). PM2 config must remain CommonJS.

module.exports = {
  apps: [
    {
      name: "scentsamplenepal-backend",
      script: "index.js",                      // Entry point
      cwd: "/var/www/app/backend",             // Working directory on EC2
      interpreter: "node",
      exec_mode: "fork",                       // Single process (not cluster)
      instances: 1,
      autorestart: true,                       // Restart on crash
      watch: false,                            // No file watching in production
      max_memory_restart: "300M",              // Restart if memory exceeds 300MB
      env: {
        NODE_ENV: "production",
        PORT: 8000,
        // MONGO_URI and JWT_SECRET are injected by GitHub Actions via .env file
      },
      // Logging
      out_file: "/var/log/pm2/scentsamplenepal-out.log",
      error_file: "/var/log/pm2/scentsamplenepal-err.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
