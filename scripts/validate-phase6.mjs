import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const files={
 app:read('src/App.tsx'),
 figure:read('src/CaseFigure.tsx'),
 interactive:read('src/InteractiveCaseFigure.tsx'),
 figureCss:read('src/CaseFigure.css'),
 interactiveCss:read('src/InteractiveCaseFigure.css')
};

const expectedCodes=['C-001','C-002','C-003','M-001','M-002','M-003','E-001','E-002','E-003','T-001','T-002','T-003','T-004','T-005','T-006','T-007','T-008','T-009','T-010'];
const failures=[];
const ok=(condition,message)=>{if(!condition)failures.push(message)};

for(const code of expectedCodes){
 ok(files.figure.includes(`case'${code}'`)||files.figure.includes(`case '${code}'`)||files.figure.includes(`case\"${code}\"`)||files.figure.includes(`case \"${code}\"`),`Static visual missing switch mapping for ${code}`);
 ok(files.interactive.includes(`'${code}':{`),`Interactive visual config missing for ${code}`);
}

ok(files.app.includes("import InteractiveCaseFigure from './InteractiveCaseFigure'"),'App does not import InteractiveCaseFigure');
const interactiveUses=(files.app.match(/<InteractiveCaseFigure\s+code=\{c\.code\}/g)||[]).length;
ok(interactiveUses>=2,`InteractiveCaseFigure should be used in brief and investigation flows (found ${interactiveUses})`);

ok(files.interactive.includes("type Lang='en'|'hi'|'mr'"),'Interactive visuals do not declare EN/HI/MR language support');
ok(files.interactive.includes("const [mode,setMode]=useState<'fault'|'normal'>('fault')"),'Normal/Fault comparison state missing');
ok(files.interactive.includes('icf-hotspot'), 'Hotspot interaction markup missing');
ok(files.interactive.includes('setInspect'), 'Inspect mode state missing');
ok(files.interactive.includes('setActive'), 'Hotspot selection state missing');

ok(files.interactiveCss.includes('@media(max-width:520px)'), 'Interactive visuals missing mobile CSS');
ok(files.interactiveCss.includes('@media(prefers-reduced-motion:reduce)'), 'Interactive visuals missing reduced-motion support');
ok(files.interactiveCss.includes('.normal-view'), 'Normal-view styling missing');
ok(files.interactiveCss.includes('.fault-view'), 'Fault-view styling missing');
ok(files.figureCss.includes('@media(prefers-reduced-motion:reduce)'), 'Phase 6B animations missing reduced-motion support');

const hotspotConfigs=(files.interactive.match(/hotspots:\[/g)||[]).length;
ok(hotspotConfigs===expectedCodes.length,`Expected ${expectedCodes.length} hotspot configs, found ${hotspotConfigs}`);

if(failures.length){
 console.error('\nPhase 6 validation FAILED');
 for(const f of failures)console.error(`- ${f}`);
 process.exit(1);
}

console.log(`Phase 6 validation passed: ${expectedCodes.length} cases have static + interactive coverage.`);
console.log('Checked: brief/investigation integration, hotspots, normal/fault view, EN/HI/MR support, mobile CSS, reduced motion.');
