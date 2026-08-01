<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:cli-workflow -->
# CLI Usage (works from any directory)

The CLI is in `backend/`. Install globally:

```bash
cd backend
npm run build
npm install -g .
```

Now `codesync` is available anywhere:

```bash
# Login (no token needed — browser opens, click "Connect this device")
codesync login --api-url http://localhost:8000
# Fallback: codesync login <your-jwt-token> (token from /profile/<id>/cli-token)

# Init in any directory
cd /path/to/my-project
codesync init <repoId>

# Push code
codesync push

# Branching
codesync branch feature
codesync checkout feature
codesync push

# Pull code
codesync pull
```

Config is stored in:
- `~/.codesync/config.json` — global auth + apiUrl
- `.codesync/config.json` — per-project config (repoId, branch)
- `.codesync/commits/` — local commits
- `.codesync/staging/` — staged files
- `.codesync/branches/` — local branch tracking
<!-- END:cli-workflow -->
