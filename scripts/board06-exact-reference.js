await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('0:1'));
await Promise.all(['Regular','Medium','SemiBold','Bold','Medium Italic'].map(style=>figma.loadFontAsync({family:'IBM Plex Sans',style})));
const board=await figma.getNodeByIdAsync('296:3382'),old=await figma.getNodeByIdAsync('309:3220'),assets=await figma.getNodeByIdAsync('309:3221');
const made=[],changed=[];const colors={white:'84:138',warm:'84:140',pale:'84:134',ink:'84:136',muted:'84:137',orange:'84:133',accent:'95:160',border:'84:135'},paints={};
for(const [key,id]of Object.entries(colors)){const v=await figma.variables.getVariableByIdAsync('VariableID:'+id);paints[key]=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:1,g:1,b:1}},'color',v)];}
const root=figma.createFrame();board.appendChild(root);root.name='Prototype / Exact reference geometry + sequential build';root.resize(1684,595);root.x=0;root.y=0;root.fills=paints.white;root.clipsContent=true;made.push(root.id);
function frame(parent,name,x,y,w,h){const n=figma.createFrame();parent.appendChild(n);n.name=name;n.resize(w,h);n.x=x;n.y=y;n.fills=[];made.push(n.id);return n;}
const L=frame(root,'LEFT / Reference 01 / Assembly process',0,0,1280,906),R=frame(root,'RIGHT / Reference 02 / Circuit integration',842,0,1280,906);L.clipsContent=true;R.clipsContent=true;R.fills=paints.warm;
function text(p,s,x,y,w,size=12,col='ink',style='Regular'){const n=figma.createText();p.appendChild(n);n.name=s.replaceAll('\n',' ').slice(0,65);n.fontName={family:'IBM Plex Sans',style};n.fontSize=size;n.lineHeight={unit:'PERCENT',value:140};n.characters=s;n.textAutoResize='HEIGHT';n.resize(w,n.height);n.x=x;n.y=y;n.fills=paints[col];made.push(n.id);return n;}
function box(p,name,x,y,w,h,col){const n=figma.createRectangle();p.appendChild(n);n.name=name;n.resize(w,h);n.x=x;n.y=y;n.fills=col?paints[col]:[];made.push(n.id);return n;}
function line(p,name,points,color='border',dash=false){const n=figma.createVector();p.appendChild(n);n.name=name;const minX=Math.min(...points.map(p=>p[0])),minY=Math.min(...points.map(p=>p[1]));n.vectorPaths=[{windingRule:'NONZERO',data:points.map((p,i)=>(i?'L ':'M ')+(p[0]-minX)+' '+(p[1]-minY)).join(' ')}];n.x=minX;n.y=minY;n.fills=[];n.strokes=paints[color];n.strokeWeight=1;if(dash)n.dashPattern=[3,4];made.push(n.id);return n;}
function svg(p,name,source,x,y,w,h){const n=figma.createNodeFromSvg(source);p.appendChild(n);n.name=name;n.resize(w,h);n.x=x;n.y=y;made.push(n.id,...n.findAll(()=>true).map(c=>c.id));return n;}
// A reusable image/caption template retains native photo and text overrides.
const template=(await figma.getNodeByIdAsync('310:3220')).clone();assets.appendChild(template);template.name='NEARBY / Reference proportion photo + caption';template.findOne(n=>n.type==='TEXT'&&n.characters==='Source photo').visible=false;const tt=template.findOne(n=>n.type==='TEXT'&&n.characters==='Photo caption');tt.fontSize=11;tt.lineHeight={unit:'PIXELS',value:14};template.itemSpacing=5;made.push(template.id,...template.findAll(()=>true).map(n=>n.id));
function photo(p,key,label,x,y,w,h,focus=.5){const n=template.createInstance();p.appendChild(n);n.name=label+' / '+key;n.resize(w,h+19);n.x=x;n.y=y;n.setProperties({'Caption#310:0':label,'Source#310:1':''});const im=n.findOne(c=>c.type==='RECTANGLE'&&c.name==='Media');let aspect=(/^IMG_570[235]$/.test(key)||key.includes('frame'))?.5625:.75;const sourceRatio=aspect/(w/h);const transform=sourceRatio<=1?[[1,0,0],[0,sourceRatio,(1-sourceRatio)*focus]]:[[1/sourceRatio,0,(1-1/sourceRatio)*.5],[0,1,0]];im.fills=[{type:'IMAGE',imageHash:HASHES[key],scaleMode:'CROP',imageTransform:transform}];made.push(n.id,...n.findAll(()=>true).map(c=>c.id));return n;}
function dot(p,x,y,label,tx,ty){const d=figma.createEllipse();p.appendChild(d);d.resize(7,7);d.x=x-3.5;d.y=y-3.5;d.fills=paints.orange;made.push(d.id);line(p,'Part callout',[[x,y],[tx-8,y],[tx-8,ty+8]],'orange');text(p,label,tx,ty,135,11,'accent','Medium');}
// REFERENCE 01: left explanation and flow, 4-state strip, 2x2 build pictures;
// upper-right hero at (495,75), lower-right 3x2 process storyboard.
text(L,'Prototype Assembly',38,30,242,22,'accent','SemiBold');text(L,'|',265,31,15,21,'muted');text(L,'Cabinet & lift',283,34,210,17,'ink','Regular');
text(L,'From prepared panels to a full-scale prototype. The build combines a wheeled cabinet, guided lift supports and a raised top platform before the electronics are integrated.',50,74,420,10.5,'muted');
text(L,'BUILD LOGIC',74,151,150,11,'accent','Medium');
for(const [i,s]of ['01  Prepare & assemble','02  Fit the lift structure','03  Connect & integrate'].entries()){const n=box(L,s,257,171+i*37,166,28,null);n.cornerRadius=14;n.strokes=paints.border;n.strokeWeight=1;text(L,s,269,176+i*37,146,10,'ink');line(L,'Flow branch '+i,[[136,203],[205,203],[221,185+i*37],[257,185+i*37]],'muted');}
line(L,'Downward build flow',[[136,170],[136,255]],'muted');text(L,'↓',130,240,20,18,'accent');
svg(L,'Guided lift assembly diagram','<svg width="340" height="126" viewBox="0 0 340 126" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#A44F0D" stroke-width="1.4" stroke-linejoin="round"><path d="M53 20h166l23 9H76zM76 29v5h166v-5M86 34v39m13-39v39m120-39v39m12-39v39M72 74h166v38H72zM72 74l-15-8h165l16 8M57 66v38l15 8M84 83h51m-30 18h102M99 112v6m115-6v6"/><circle cx="99" cy="119" r="4"/><circle cx="214" cy="119" r="4"/><path d="M265 30h-21M265 69h-34M265 103h-27"/></g></svg>',71,263,340,126);
text(L,'Platform',338,284,95,10,'muted');text(L,'Guided lift',338,323,95,10,'muted');text(L,'Cabinet',338,357,95,10,'muted');
line(L,'Reference divider',[[83,397],[432,397]],'border');
const statePaths=[
'<path d="m8 54 31-13 38 14-32 13zM8 63l37 14 32-14M8 72l37 14 32-14"/>',
'<path d="M15 30h58v54H15zM15 30l-9-8h57l10 8M6 22v51l9 11M25 84v6m37-6v6"/><circle cx="25" cy="92" r="3"/><circle cx="62" cy="92" r="3"/>',
'<path d="M15 51h58v33H15zM20 51V14m7 37V14m36 37V14m7 37V14M15 14h60M25 84v6m37-6v6"/><circle cx="25" cy="92" r="3"/><circle cx="62" cy="92" r="3"/>',
'<path d="M15 51h58v33H15zM20 51V21m7 30V21m36 30V21m7 30V21M8 17h73v5H8zM25 84v6m37-6v6M53 17V6h13v11"/><circle cx="25" cy="92" r="3"/><circle cx="62" cy="92" r="3"/>'
];
for(let i=0;i<4;i++){svg(L,'Build progression '+i,'<svg width="90" height="104" viewBox="0 0 90 104" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#A44F0D" stroke-width="1.5">'+statePaths[i]+'</g></svg>',53+i*102,414,88,104);}
text(L,'→',144,446,25,22,'accent');text(L,'Panel kit',56,520,100,11,'muted');text(L,'Cabinet → lift → integrated prototype',171,520,285,11,'muted');
photo(L,'IMG_5705','',58,558,193,120,.61);photo(L,'IMG_5703','',257,558,190,120,.68);text(L,'01–02  Assemble the cabinet and secure the drawer rails.',58,686,399,10.5,'muted');
photo(L,'IMG_5755','',58,711,193,117,.58);photo(L,'IMG_5765','',257,711,190,117,.56);text(L,'03–04  Mount the lift hardware and align the guides.',58,837,399,10.5,'muted');
for(const y of [548,703,859])line(L,'Reference process row rule',[[51,y],[465,y]],'border',true);
// Exact dominant image region. Focus crop retains the hand, platform and cabinet.
photo(L,'IMG_5789','',495,75,738,412,.96);
box(L,'Hero caption plate',735,85,480,27,'white').opacity=.88;text(L,'Human-scale assembly / platform, guides and wheeled cabinet',748,89,458,11,'ink','Medium');
text(L,'Mechanical assembly / steps 01–06',495,506,738,16,'accent','Medium Italic');
const steps=[['IMG_5706','01  Prepare the panels',.55],['IMG_5705','02  Fasten the cabinet',.68],['IMG_5703','03  Fit the drawer rails',.67],['IMG_5755','04  Mount lift hardware',.60],['IMG_5765','05  Align the guide rails',.58],['IMG_5770','06  Tighten the fasteners',.57]];
for(let i=0;i<6;i++)photo(L,steps[i][0],steps[i][1],495+(i%3)*253,537+Math.floor(i/3)*168,230,139,steps[i][2]);
// REFERENCE 02: two dominant photographs with paired 2x2 detail sequences below.
text(R,'Circuit Integration',47,30,240,22,'accent','SemiBold');text(R,'|',278,31,15,21,'muted');text(R,'Wiring & assembly',297,34,270,17,'ink');
text(R,'The mechanical build is followed by wiring preparation, board connections and in-device installation. Photographs and recorded sequences document each assembly stage.',58,73,575,10.5,'muted');
photo(R,'IMG_5734','',62,114,577,357,.93);
box(R,'Board annotation plate',399,408,223,47,'white').opacity=.91;text(R,'07  Prepare and connect\nthe control electronics',411,416,200,12,'accent','Medium');
text(R,'Wiring preparation / steps 07–10',48,483,592,16,'accent','Medium Italic');
photo(R,'IMG_5742','07  Review the wiring plan',62,520,274,150,.30);
photo(R,'IMG_5774-frame1','08  Prepare actuator connections',356,520,274,150,.35);
photo(R,'IMG_5739','09  Wire the control board',62,706,274,150,.85);
photo(R,'IMG_5777-frame1','10  Connect the cable set',356,706,274,150,.72);
text(R,'In-device assembly',670,36,580,17,'ink','Medium');
photo(R,'IMG_5784-frame1','',670,74,580,336,.68);
text(R,'Integration & recorded checks / steps 11–14',670,427,580,16,'accent','Medium Italic');
photo(R,'IMG_5779-frame1','11  Route cables inside the cabinet',670,454,288,176,.64);
photo(R,'IMG_5783-frame2','12  Fit the display and connections',970,454,280,176,.50);
photo(R,'IMG_5792-frame1','13  Bench connection check',670,675,288,187,.67);
photo(R,'IMG_5793-frame1','14  Inspect the connected board',970,675,280,187,.68);
text(R,'Video evidence: 5774 · 5777 · 5779 · 5783 · 5784 · 5792 · 5793',670,885,585,8.5,'muted');
L.rescale(842/1280);R.rescale(842/1280);R.x=842;R.y=0;old.visible=false;changed.push(old.id);board.name='06 / Prototype / Reference-matched process layout';changed.push(board.id);figma.currentPage.selection=[root];figma.viewport.scrollAndZoomIntoView([board]);
return {createdNodeIds:made,mutatedNodeIds:changed,root:root.id,left:L.id,right:R.id,template:template.id,geometry:{reference:[1280,906],eachHalf:[L.width,L.height],scale:842/1280},fonts:[...new Set(root.findAllWithCriteria({types:['TEXT']}).map(n=>n.fontName.family))],photoCount:root.findAllWithCriteria({types:['INSTANCE']}).length};
