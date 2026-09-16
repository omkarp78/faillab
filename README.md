# FailLab

**Break it. Diagnose it. Understand it.**

FailLab is a multilingual engineering failure-investigation learning game. Students inspect clues, run limited-budget tests, study technical figures, choose a root cause, and learn from the final diagnosis.

## Current launch scope

- 19 cases across Civil, Mechanical, Electrical/E&TC, and Computer/IT
- Developer tracks for Web Development, Backend, and Languages
- English, Hindi, and Marathi UI/case content
- Dark and light themes
- Engineering IQ, streaks, scores, local progress, and Google cloud sync
- Static technical figures, light animations, and interactive fault inspection
- Automated Phase 6 and Phase 7 launch validation
- Production error recovery and production bundle splitting

## Run locally

```bash
npm install
npm run dev
```

## Validate a release

```bash
npm run test:launch
npm run build
```

`npm run build` runs Phase 6 visual coverage checks, Phase 7 launch-readiness checks, TypeScript validation, and the Vite production build.

## Production

https://faillab.vercel.app

> FailLab is an educational learning product. Case explanations should not replace professional engineering inspection, design, safety, or operational decisions.
