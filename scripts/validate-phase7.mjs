import fs from 'node:fs';

const read=(path)=>fs.readFileSync(path,'utf8');
const fail=(message)=>{console.error(`Phase 7 validation failed: ${message}`);process.exit(1)};
const expect=(condition,message)=>{if(!condition)fail(message)};

const pkg=JSON.parse(read('package.json'));
const index=read('index.html');
const main=read('src/main.tsx');
const preferences=read('src/preferences.tsx');
const errorBoundary=read('src/ErrorBoundary.tsx');
const vite=read('vite.config.ts');
const app=read('src/App.tsx');
const localization=read('src/LocalizationBridge.tsx');

expect(pkg.scripts?.['test:phase6'],'Phase 6 validation script is missing');
expect(pkg.scripts?.['test:phase7'],'Phase 7 validation script is missing');
expect(pkg.scripts?.['test:launch']?.includes('test:phase7'),'launch suite must include Phase 7 validation');
expect(pkg.scripts?.build?.includes('test:launch'),'production build must run the launch validation suite');
expect(main.includes('<ErrorBoundary>'),'app is not wrapped in the production error boundary');
expect(errorBoundary.includes('componentDidCatch'),'error boundary does not capture render failures');
expect(errorBoundary.includes('Reload FailLab'),'recovery action is missing');
expect(vite.includes('manualChunks'),'production bundle splitting is not configured');
expect(vite.includes('supabase-vendor')&&vite.includes('react-vendor'),'vendor chunk separation is incomplete');
expect(index.includes('name="description"'),'SEO description is missing');
expect(index.includes('property="og:title"'),'Open Graph launch metadata is missing');
expect(index.includes('name="theme-color"'),'browser theme color is missing');
expect(preferences.includes('aria-pressed'),'language/theme controls must expose selected state');
expect(app.includes('BUDGET LEFT'),'investigation budget indicator is missing');
expect(localization.includes('remaining')&&localization.includes('शिल्लक'),'live remaining-budget localization is missing');
expect(app.includes('InteractiveCaseFigure'),'Phase 6 interactive visual integration is missing');

console.log('Phase 7 launch validation passed.');
console.log('Checked: recovery boundary, launch metadata, accessibility state, bundle splitting, budget UX, Phase 6 integration.');
