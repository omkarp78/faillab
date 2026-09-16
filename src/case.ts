export type Evidence={id:string;title:string;detail:string;critical?:boolean};
export type Test={id:string;title:string;cost:number;time:string;result:string;unlocks?:string[]};
export type Hypothesis={id:string;title:string;description:string};

export const crackedBeam={
 code:'C-001',title:'The Cracked Beam',branch:'Civil Engineering',difficulty:'Intermediate',budget:100,
 location:'Residential building · First floor',reported:'4 months after occupancy',
 briefing:'A reinforced-concrete beam in a recently completed residential building has developed prominent cracks near mid-span. The contractor says the beam passed initial inspection. Occupants report no unusual event. You have been asked to determine the most likely root cause before repair work begins.',
 facts:['Beam span: 5.8 m','Section: 230 × 450 mm','Concrete specified: M25','Main reinforcement: 3 × 16 mm bottom bars','Cracks are predominantly vertical near mid-span','No visible crushing near supports'],
 evidence:[
  {id:'e1',title:'Visual crack survey',detail:'Multiple near-vertical cracks are concentrated in the middle third of the span. Maximum measured width is approximately 0.48 mm.',critical:true},
  {id:'e2',title:'Site photographs',detail:'Cracks originate at the tension face and propagate upward. No diagonal shear-crack pattern is apparent.',critical:true},
  {id:'e3',title:'Construction drawing',detail:'Drawing specifies 3 × 16 mm bottom reinforcement and M25 concrete for a 5.8 m clear span.'},
  {id:'e4',title:'Occupancy record',detail:'The room use changed after handover. A heavy masonry storage partition was added directly above the beam line.',critical:true},
  {id:'e5',title:'Rebar scan',detail:'Installed bottom reinforcement matches the drawing. Cover is broadly within expected construction tolerance.'},
  {id:'e6',title:'Material result',detail:'Estimated in-situ concrete strength is broadly consistent with the specified M25 grade.'}
 ] as Evidence[],
 tests:[
  {id:'t1',title:'Rebound hammer survey',cost:18,time:'25 min',result:'Estimated surface strength is consistent with approximately M24–M27 concrete. No broad weak-concrete zone is indicated.',unlocks:['e6']},
  {id:'t2',title:'Rebar locator scan',cost:22,time:'35 min',result:'Three 16 mm bottom bars are detected at the expected locations. No major reinforcement omission is found.',unlocks:['e5']},
  {id:'t3',title:'Load & occupancy audit',cost:15,time:'20 min',result:'A post-handover masonry storage partition introduced a substantial permanent line load not included in the original occupancy information.',unlocks:['e4']},
  {id:'t4',title:'Ultrasonic pulse velocity',cost:28,time:'45 min',result:'Concrete uniformity is generally acceptable; results do not indicate a major internal concrete-quality anomaly.'}
 ] as Test[],
 hypotheses:[
  {id:'h1',title:'Flexural overstress from added load',description:'Additional service load increased bending demand, producing excessive flexural cracking.'},
  {id:'h2',title:'Low concrete strength',description:'Concrete failed to achieve the specified strength, causing premature cracking.'},
  {id:'h3',title:'Missing reinforcement',description:'Bottom tensile reinforcement was omitted or significantly under-installed.'},
  {id:'h4',title:'Shear failure near supports',description:'Excessive shear demand caused a developing shear failure.'}
 ] as Hypothesis[],
 correct:'h1'
};

export function scoreDiagnosis(hypothesis:string,reviewed:string[],tests:string[]){
 const correct=hypothesis===crackedBeam.correct;
 const critical=['e1','e2','e4'];
 const evidenceScore=Math.round(30*critical.filter(x=>reviewed.includes(x)).length/critical.length);
 const diagnosisScore=correct?50:0;
 const useful=['t3'];
 const usefulTests=tests.filter(x=>useful.includes(x)).length;
 const unnecessary=tests.filter(x=>!useful.includes(x)).length;
 const investigationScore=Math.max(0,20+usefulTests*5-unnecessary*4);
 const total=Math.min(100,diagnosisScore+evidenceScore+investigationScore);
 return {correct,total,iq:correct?Math.max(20,Math.round(total*.6)):Math.max(5,Math.round(total*.2)),evidenceScore,diagnosisScore,investigationScore};
}