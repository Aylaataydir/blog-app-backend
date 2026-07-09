# 🚀 Deployment Guide

This guide covers various deployment options for the Blog App Backend.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Production](#local-production)
- [Docker Deployment](#docker-deployment)
- [PM2 Deployment](#pm2-deployment)
- [Cloud Platforms](#cloud-platforms)
- [Post-Deployment](#post-deployment)

## Prerequisites

- Node.js >= 18.x
- MongoDB instance (local or cloud)
- Git
- Production server (VPS, cloud instance, etc.)

## Environment Variables

Create a `.env` file in production with the following variables:

```env
NODE_ENV=production
PORT=3000
BASE_URL=https://your-domain.com

# Database - Use MongoDB Atlas for production
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-app

# JWT - Use strong, random secrets!
JWT_SECRET=your-very-secure-random-secret-min-32-characters
JWT_REFRESH_SECRET=your-very-secure-refresh-secret-min-32-characters
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# Logging
LOG_LEVEL=warn
```

### Generate Secure Secrets

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Local Production

Build and run locally:

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start production server
npm start

# Or combine both
npm run prod
```

## Docker Deployment

### Option 1: Docker Standalone

```bash
# Build image
npm run docker:build

# Run container
docker run -d \
  --name blog-app-backend \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  blog-app-backend
```

### Option 2: Docker Compose (Recommended)

Includes MongoDB and backend together:

```bash
# Edit docker-compose.yml with your environment variables

# Start all services
npm run docker:compose:up

# View logs
npm run docker:compose:logs

# Stop all services
npm run docker:compose:down
```

### Docker Commands

```bash
# View container logs
docker logs -f blog-app-backend

# Access container shell
docker exec -it blog-app-backend sh

# Stop container
docker stop blog-app-backend

# Remove container
docker rm blog-app-backend

# Remove image
docker rmi blog-app-backend
```

## PM2 Deployment

PM2 provides process management with auto-restart and clustering.

### Setup

```bash
# Install PM2 globally
npm install -g pm2

# Build the application
npm run build

# Start with PM2
npm run pm2:start

# Other commands
npm run pm2:stop      # Stop the app
npm run pm2:restart   # Restart the app
npm run pm2:delete    # Delete from PM2
npm run pm2:logs      # View logs
```

### PM2 Additional Commands

```bash
# Monitor app
pm2 monit

# List all apps
pm2 list

# Save PM2 config
pm2 save

# Auto-start on system boot
pm2 startup
```

## Cloud Platforms

### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret
heroku config:set JWT_REFRESH_SECRET=your-refresh-secret

# Deploy
git push heroku main

# Open app
heroku open

# View logs
heroku logs --tail
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add all variables from .env.example
```

### AWS EC2

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd blog-app-backend

# Install dependencies and build
npm install
npm run build

# Set up environment variables
nano .env  # Add your production variables

# Start with PM2
npm run pm2:start

# Setup PM2 to start on system boot
pm2 startup
pm2 save

# Setup NGINX (optional but recommended)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
```

NGINX configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### DigitalOcean

Similar to AWS EC2. Use their App Platform for easier deployment:

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Configure build command: `npm run build`
4. Configure run command: `npm start`
5. Deploy

## Post-Deployment

### 1. Create Admin User

```bash
# SSH into server
ssh user@your-server

# Navigate to app directory
cd /path/to/blog-app-backend

# Run admin script
npm run create-admin
```

### 2. Setup SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is setup automatically
# Test renewal
sudo certbot renew --dry-run
```

### 3. Setup Monitoring

**PM2 Plus (formerly Keymetrics):**
```bash
pm2 link your-secret-key your-public-key
```

**Health Check Monitoring:**
- Use UptimeRobot, Pingdom, or similar
- Monitor: `https://your-domain.com/health`

### 4. Database Backup

If using MongoDB Atlas:
- Enable automated backups in Atlas dashboard
- Configure backup retention policy
- Test restore process

If using self-hosted MongoDB:
```bash
# Backup
mongodump --uri="mongodb://localhost:27017/blog-app" --out=/backup/location

# Restore
mongorestore --uri="mongodb://localhost:27017/blog-app" /backup/location/blog-app
```

### 5. Log Management

Production logs are in the `logs/` directory:

```bash
# View recent logs
tail -f logs/application-$(date +%Y-%m-%d).log

# View error logs
tail -f logs/error-$(date +%Y-%m-%d).log

# Setup log rotation (Linux)
sudo nano /etc/logrotate.d/blog-app
```

### 6. Security Checklist

- [ ] Strong JWT secrets (32+ characters)
- [ ] HTTPS/SSL certificate installed
- [ ] MongoDB authentication enabled
- [ ] Firewall configured (only 80, 443, 22)
- [ ] Rate limiting enabled (built-in)
- [ ] CORS origins restricted
- [ ] Environment variables secured
- [ ] Database connection encrypted
- [ ] Regular security updates
- [ ] Backup strategy in place

### 7. Performance Optimization

- [ ] Enable compression (built-in)
- [ ] Use CDN for static assets
- [ ] Database indexes created
- [ ] Connection pooling configured
- [ ] PM2 cluster mode enabled
- [ ] NGINX caching configured
- [ ] Monitor memory usage
- [ ] Setup APM (Application Performance Monitoring)

## Troubleshooting

### App won't start

```bash
# Check logs
pm2 logs blog-app-backend  # PM2
docker logs blog-app-backend  # Docker

# Check if port is in use
sudo lsof -i :3000

# Check environment variables
printenv | grep DB_URI
```

### Database connection issues

```bash
# Test MongoDB connection
mongosh "your-mongodb-uri"

# Check network/firewall
ping your-mongodb-host
telnet your-mongodb-host 27017
```

### High memory usage

```bash
# Check memory
free -m
pm2 list

# Restart app
pm2 restart blog-app-backend
```

## Rollback

```bash
# Docker
docker-compose down
docker-compose up -d --force-recreate

# PM2
git checkout previous-commit
npm run build
pm2 restart blog-app-backend

# Database (if needed)
mongorestore --drop /backup/location
```

## Support

For issues and questions:
- Check application logs
- Review MongoDB logs
- Check server resources (CPU, memory, disk)
- Verify environment variables
- Test database connectivity

---

**Note:** Always test deployment in a staging environment first!
