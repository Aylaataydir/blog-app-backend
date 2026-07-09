# 🔒 Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. DO NOT Create a Public Issue

Please **DO NOT** create a public GitHub issue for security vulnerabilities.

### 2. Report Privately

Send your report to: **aylaataydir@gmail.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Time

- You'll receive an acknowledgment within **48 hours**
- We'll provide a detailed response within **7 days**
- We'll keep you updated on the fix progress

## Security Best Practices

### For Users

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, random secrets (32+ characters)
   - Rotate secrets regularly (every 90 days)

2. **Database**
   - Enable MongoDB authentication
   - Use encrypted connections (TLS/SSL)
   - Restrict database access to application servers only
   - Use MongoDB Atlas for production

3. **Authentication**
   - Use strong passwords (min 8 chars, mixed case, numbers, special chars)
   - Implement 2FA for admin accounts (future enhancement)
   - Never share JWT tokens
   - Monitor for unusual login patterns

4. **Server Security**
   - Keep Node.js and dependencies updated
   - Use HTTPS/SSL in production
   - Configure firewall (allow only 80, 443, 22)
   - Use fail2ban for SSH brute force protection
   - Regular security audits

### For Developers

1. **Dependencies**
   ```bash
   # Check for vulnerabilities
   npm audit
   
   # Fix vulnerabilities
   npm audit fix
   ```

2. **Code Security**
   - Input validation (using Zod)
   - Output sanitization
   - Parameterized queries (Mongoose does this)
   - Avoid eval() or similar dangerous functions
   - Use strict TypeScript mode

3. **Rate Limiting**
   - Already implemented for API routes
   - Adjust limits based on your needs
   - Monitor for abuse patterns

4. **Error Handling**
   - Never expose stack traces in production
   - Log errors securely
   - Use generic error messages for users

## Security Features

### Built-in Security

✅ **Helmet**: Sets secure HTTP headers  
✅ **CORS**: Restricts cross-origin requests  
✅ **Rate Limiting**: Prevents brute force attacks  
✅ **Input Validation**: Zod schema validation  
✅ **Password Hashing**: bcrypt with salt  
✅ **JWT Authentication**: Secure token-based auth  
✅ **Request Size Limits**: 10MB max  
✅ **Logging**: Winston for security event logging  

### Security Headers

The application sets these security headers via Helmet:

- X-DNS-Prefetch-Control
- X-Frame-Options
- Strict-Transport-Security
- X-Download-Options
- X-Content-Type-Options
- X-XSS-Protection

## Known Security Considerations

### Rate Limiting

Current limits:
- General API: 100 requests / 15 minutes
- Login: 5 attempts / 15 minutes
- Registration: 3 accounts / hour

Adjust in `src/middlewares/rateLimiter.ts` based on your needs.

### CORS

Only these origins are allowed:
- https://daily-blog-web.vercel.app
- http://localhost:5173
- http://localhost:3000

Update in `src/app.ts` for your domains.

### JWT Expiration

Default token lifetimes:
- Access Token: 1 hour
- Refresh Token: 7 days

Adjust in `.env` if needed.

## Security Audit Checklist

Before deploying to production:

- [ ] Strong JWT secrets configured
- [ ] Database authentication enabled
- [ ] HTTPS/SSL certificate installed
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation working
- [ ] Error messages don't leak sensitive info
- [ ] Logs don't contain passwords/secrets
- [ ] Dependencies audited (`npm audit`)
- [ ] Environment variables secured
- [ ] Database backups configured
- [ ] Monitoring/alerting setup

## Incident Response

If a security breach occurs:

1. **Immediate Actions**
   - Rotate all secrets (JWT, database passwords)
   - Check logs for unauthorized access
   - Identify affected users
   - Block malicious IPs if identifiable

2. **Investigation**
   - Review logs (Winston logs in `logs/`)
   - Check database for unauthorized changes
   - Identify the vulnerability
   - Document the incident

3. **Remediation**
   - Fix the vulnerability
   - Deploy the fix
   - Update security documentation
   - Notify affected users if required

4. **Post-Incident**
   - Conduct security review
   - Update security practices
   - Train team on lessons learned

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

## Security Updates

Subscribe to security advisories:
- [Node.js Security Releases](https://nodejs.org/en/blog/vulnerability/)
- [NPM Security Advisories](https://github.com/advisories?query=ecosystem%3Anpm)
- [MongoDB Security Advisories](https://www.mongodb.com/alerts)

---

**Last Updated:** 2026-07-06  
**Version:** 1.0.0
