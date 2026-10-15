# 99 ICM Execution & Verification Protocol

## 1. Zero Regression & Surgical Execution Invariants
* **Surgical Scope**: Touch only the exact component or route requested. Never rewrite working TMDB client methods or restyle working Tailwind tokens.
* **Strict Type Safety**: Never add `any` casts when writing new Next.js route handlers or player callbacks. Always export and use explicit interfaces.
* **Preserve Edge Compatibility**: Do not introduce Node.js built-in modules (`fs`, `child_process`, `net`) that break Cloudflare Worker edge bundling.

---

## 2. Multi-Stage Verification Pipeline

Before marking any task as complete in `MovieStream`, execute:

### Step 1: Next.js ESLint Check
Verify that modified files pass Next.js rules:
```powershell
npm run lint
```

### Step 2: TypeScript Type Check
```powershell
npx tsc --noEmit
```

### Step 3: Cloudflare OpenNext Worker Build (if touching edge routes)
```powershell
npm run build:worker
```

### Step 4: AST Knowledge Graph Refresh
```powershell
python -m graphify extract . --code-only
python -m graphify export obsidian
```
