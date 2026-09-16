# FailLab

**Break it. Diagnose it. Understand it.**

Phase 1 implements the first playable engineering failure investigation: **Civil C-001 — The Cracked Beam**.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Phase 1 gameplay

Home → case briefing → investigation workspace → inspect evidence → request tests within a limited investigation budget → choose a root-cause hypothesis → deterministic scoring → engineering failure report.

No backend is required for Phase 1. The case and scoring engine are deterministic local TypeScript modules so the core learning/gameplay loop can be validated first.

> Educational prototype only. It is not a professional structural engineering analysis or design tool.
