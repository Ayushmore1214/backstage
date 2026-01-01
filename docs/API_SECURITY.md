# API Security Best Practices

This guide covers security best practices for developing and maintaining secure APIs in Backstage.

## Table of Contents

- [Authentication](#authentication)
- [Authorization](#authorization)
- [Input Validation](#input-validation)
- [Output Encoding](#output-encoding)
- [Rate Limiting](#rate-limiting)
- [Security Headers](#security-headers)
- [HTTPS/TLS](#httpstls)
- [Error Handling](#error-handling)
- [Logging and Monitoring](#logging-and-monitoring)

## Authentication

### Use Strong Authentication Mechanisms

Always require authentication for sensitive endpoints:

```typescript
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';

router.get('/api/sensitive-data', async (req, res) => {
  // Verify authentication
  const token = getBearerTokenFromAuthorizationHeader(req.headers.authorization);
  if (!token) {
    throw new AuthenticationError('Missing authentication');
  }
  
  // Verify token and get user identity
  const credentials = await authenticate(token);
  
  // Continue with authorized request
  const data = await getSensitiveData(credentials);
  res.json(data);
});
```

### OAuth 2.0 / OpenID Connect

Use OAuth 2.0 for third-party integrations:

```yaml
# app-config.yaml
auth:
  providers:
    github:
      development:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
```

### API Keys

If using API keys:

- Store them securely (environment variables, secret managers)
- Rotate keys regularly
- Use different keys for different environments
- Never expose keys in client-side code

```typescript
// ❌ Bad: Hardcoded API key
const API_KEY = 'sk_live_1234567890abcdef';

// ✅ Good: From environment variable
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error('API_KEY environment variable is required');
}
```

### Session Management

Configure secure session settings:

```typescript
import session from 'express-session';

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // Require HTTPS
    httpOnly: true,    // Prevent XSS attacks
    maxAge: 3600000,   // 1 hour
    sameSite: 'strict' // CSRF protection
  }
}));
```

## Authorization

### Implement Role-Based Access Control (RBAC)

Use Backstage's permission system:

```typescript
import { createPermission } from '@backstage/plugin-permission-common';

export const readCatalogPermission = createPermission({
  name: 'catalog.entity.read',
  attributes: { action: 'read' },
});

// In your route handler
router.get('/api/entities', async (req, res) => {
  const decision = await permissions.authorize(
    [{ permission: readCatalogPermission }],
    { credentials: req.user }
  );
  
  if (decision[0].result !== AuthorizeResult.ALLOW) {
    throw new NotAllowedError('Insufficient permissions');
  }
  
  // Continue with authorized request
});
```

### Principle of Least Privilege

Grant minimum necessary permissions:

```typescript
// ❌ Bad: Overly permissive
if (user.isAuthenticated()) {
  // Allow all operations
}

// ✅ Good: Specific permission checks
if (await hasPermission(user, 'entity.delete')) {
  await deleteEntity(entityRef);
}
```

### Resource-Level Authorization

Check permissions for specific resources:

```typescript
router.delete('/api/entities/:ref', async (req, res) => {
  const { ref } = req.params;
  const entity = await catalog.getEntity(ref);
  
  // Check if user owns the entity or has admin role
  if (entity.metadata.owner !== req.user.name && !req.user.isAdmin) {
    throw new NotAllowedError('Not authorized to delete this entity');
  }
  
  await catalog.deleteEntity(ref);
  res.status(204).end();
});
```

## Input Validation

### Validate All Input

Never trust client input:

```typescript
import { z } from 'zod';

// Define schema
const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(150),
  name: z.string().min(1).max(100)
});

router.post('/api/users', async (req, res) => {
  // Validate input
  const result = userSchema.safeParse(req.body);
  
  if (!result.success) {
    throw new InputError('Invalid input', result.error.errors);
  }
  
  // Use validated data
  const user = await createUser(result.data);
  res.json(user);
});
```

### Path Traversal Prevention

Use safe path resolution:

```typescript
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';

// ❌ Bad: Vulnerable to path traversal
router.get('/files/:filename', async (req, res) => {
  const filepath = path.join(baseDir, req.params.filename);
  // User could request '../../../etc/passwd'
});

// ✅ Good: Safe path resolution
router.get('/files/:filename', async (req, res) => {
  const filepath = resolveSafeChildPath(baseDir, req.params.filename);
  const content = await fs.readFile(filepath);
  res.send(content);
});
```

### SQL Injection Prevention

Use parameterized queries:

```typescript
// ❌ Bad: SQL injection vulnerability
const query = `SELECT * FROM users WHERE email = '${email}'`;
await db.query(query);

// ✅ Good: Parameterized query
const query = db.select().from('users').where({ email });
await query;
```

### Command Injection Prevention

Never execute user input directly:

```typescript
import { execFile } from 'child_process';

// ❌ Bad: Command injection vulnerability
exec(`git clone ${userProvidedUrl}`);

// ✅ Good: Use safe APIs with validated input
const urlSchema = z.string().url();
const validatedUrl = urlSchema.parse(userProvidedUrl);

execFile('git', ['clone', validatedUrl], (error, stdout) => {
  // Handle result
});
```

## Output Encoding

### Prevent XSS Attacks

Always encode output:

```typescript
import { escapeHtml } from '@backstage/core-utils';

// ❌ Bad: XSS vulnerability
res.send(`<div>Hello ${username}</div>`);

// ✅ Good: Escaped output
res.send(`<div>Hello ${escapeHtml(username)}</div>`);

// ✅ Better: Use JSON responses
res.json({ message: `Hello ${username}` });
```

### Content-Type Headers

Set appropriate content types:

```typescript
// ❌ Bad: No content type
res.send(data);

// ✅ Good: Explicit content type
res.contentType('application/json').json(data);
```

### Use .json() for API Responses

Always use `.json()` for JSON responses:

```typescript
// ❌ Bad: Can be interpreted as HTML
res.send({ data: value });

// ✅ Good: Explicit JSON response
res.json({ data: value });
```

## Rate Limiting

### Implement Rate Limiting

Protect against abuse:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all requests
app.use('/api/', limiter);

// Or to specific routes
router.post('/api/login', limiter, loginHandler);
```

### Different Limits for Different Endpoints

```typescript
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 requests per 15 minutes
});

const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.post('/api/auth/login', strictLimiter, loginHandler);
router.get('/api/catalog/entities', standardLimiter, catalogHandler);
```

## Security Headers

### Set Security Headers

Use Helmet for security headers:

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

### CORS Configuration

Configure CORS appropriately:

```typescript
import cors from 'cors';

// ❌ Bad: Allow all origins
app.use(cors({ origin: '*' }));

// ✅ Good: Specific origins
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://example.com'],
  credentials: true,
  maxAge: 86400,
}));
```

## HTTPS/TLS

### Enforce HTTPS

Redirect HTTP to HTTPS:

```typescript
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### TLS Configuration

Use strong TLS settings:

```typescript
import https from 'https';

const server = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  minVersion: 'TLSv1.2',
  ciphers: 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256',
}, app);
```

## Error Handling

### Don't Leak Sensitive Information

```typescript
// ❌ Bad: Exposes internal details
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack });
});

// ✅ Good: Generic error message
app.use((err, req, res, next) => {
  logger.error('Request failed', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
```

### Use Backstage Error Types

```typescript
import { 
  InputError, 
  NotFoundError, 
  NotAllowedError,
  ConflictError 
} from '@backstage/errors';

router.get('/api/entity/:ref', async (req, res) => {
  const entity = await catalog.getEntity(req.params.ref);
  
  if (!entity) {
    throw new NotFoundError('Entity not found');
  }
  
  res.json(entity);
});
```

## Logging and Monitoring

### Log Security Events

```typescript
import { Logger } from 'winston';

// Log authentication attempts
logger.info('Authentication attempt', {
  username: username,
  ip: req.ip,
  success: true,
});

// Log authorization failures
logger.warn('Authorization failed', {
  user: req.user.name,
  resource: resource,
  permission: permission,
});

// Log suspicious activity
logger.error('Suspicious activity detected', {
  ip: req.ip,
  endpoint: req.path,
  pattern: 'SQL injection attempt',
});
```

### Don't Log Sensitive Data

```typescript
// ❌ Bad: Logs password
logger.info('User login', { username, password });

// ✅ Good: Don't log sensitive data
logger.info('User login', { username });

// ❌ Bad: Logs full request body
logger.info('API request', { body: req.body });

// ✅ Good: Log sanitized data
logger.info('API request', { 
  action: req.body.action,
  entityRef: req.body.entityRef 
});
```

### Monitor for Attacks

Set up alerts for:
- Multiple failed authentication attempts
- Unusual access patterns
- High error rates
- Suspicious user agents
- SQL injection patterns in logs

## Security Checklist

Before deploying:

- [ ] All endpoints require authentication
- [ ] Authorization checks are in place
- [ ] Input validation is implemented
- [ ] Output encoding is used
- [ ] Rate limiting is configured
- [ ] Security headers are set
- [ ] HTTPS is enforced
- [ ] Error messages don't leak info
- [ ] Security events are logged
- [ ] Dependencies are up to date
- [ ] Security scanning is enabled

## Resources

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Backstage Security Policy](../SECURITY.md)

---

For security questions or to report vulnerabilities, see our [Security Policy](../SECURITY.md).
