const p=await figma.getNodeByIdAsync('0:1');await figma.setCurrentPageAsync(p);
const board=await figma.getNodeByIdAsync('84:480');
const fontMap=new Map();for(const t of board.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fontMap.set(JSON.stringify(s.fontName),s.fontName);
for(const style of ['Regular','Medium','SemiBold','Bold'])fontMap.set(style,{family:'IBM Plex Sans',style});
await Promise.all([...fontMap.values()].map(f=>figma.loadFontAsync(f)));
const vars=await figma.variables.getLocalVariablesAsync();
const V={accent:'VariableID:84:133',light:'VariableID:84:134',border:'VariableID:84:135',ink:'VariableID:84:136',muted:'VariableID:84:137',white:'VariableID:84:138',warm:'VariableID:84:140',accentText:'VariableID:95:160'};
function paint(k){const v=vars.find(v=>v.id===V[k]);return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',v);}
const changed=[];const created=[];
const far=Math.max(...p.children.map(n=>n.x+n.width))+100;
const archive=board.clone();p.appendChild(archive);archive.name='ARCHIVE / Board 05 / before technical layout / 2026-10-09';archive.x=far;archive.y=-3191;
created.push(archive.id,...archive.findAll(()=>true).map(n=>n.id));
function rect(parent,name,x,y,w,h,k){const n=figma.createRectangle();parent.appendChild(n);n.name=name;n.resize(w,h);n.x=x;n.y=y;n.fills=[paint(k)];created.push(n.id);return n;}
function frame(parent,name,x,y,w,h){const n=figma.createFrame();parent.appendChild(n);n.name=name;n.resize(w,h);n.x=x;n.y=y;n.fills=[];n.clipsContent=false;created.push(n.id);return n;}
function text(parent,name,value,x,y,w,size=12,style='Regular',color='ink'){const n=figma.createText();parent.appendChild(n);n.name=name;n.fontName={family:'IBM Plex Sans',style};n.fontSize=size;n.lineHeight={unit:'PERCENT',value:125};n.fills=[paint(color)];n.characters=value;n.textAutoResize='HEIGHT';n.resize(w,n.height);n.x=x;n.y=y;created.push(n.id);return n;}
function img(parent,name,hash,x,y,w,h){const n=rect(parent,name,x,y,w,h,'white');n.fills=[{type:'IMAGE',imageHash:hash,scaleMode:'FIT'}];return n;}
function poly(parent,name,points,color='muted',weight=.7){const n=figma.createVector();parent.appendChild(n);n.name=name;n.vectorPaths=[{windingRule:'NONZERO',data:points.map((q,i)=>(i?'L ':'M ')+q[0]+' '+q[1]).join(' ')}];n.fills=[];n.strokes=[paint(color)];n.strokeWeight=weight;created.push(n.id);return n;}
function dot(parent,x,y){const n=figma.createEllipse();parent.appendChild(n);n.resize(4,4);n.x=x-2;n.y=y-2;n.fills=[paint('accent')];created.push(n.id);}
const consentIds=['145:1418','145:1419','145:1420','145:1421','145:1422','145:1427','145:1430','145:1431','145:1432','145:1433','145:1434','145:1435','145:1436'];
for(const n of [...board.children])if(n.x<878&&!consentIds.includes(n.id)){n.visible=false;changed.push(n.id);}
for(const id of ['145:1418','145:1420','145:1421']){const n=await figma.getNodeByIdAsync(id);n.x=878;n.resize(301,n.height);changed.push(id);}
const ch=await figma.getNodeByIdAsync('145:1419');ch.x=882;ch.resize(293,ch.height);ch.characters='Consent + reassurance';changed.push(ch.id);
for(const id of ['145:1422','145:1427']){const n=await figma.getNodeByIdAsync(id);n.visible=false;changed.push(id);}
const cf=await figma.getNodeByIdAsync('145:1436');cf.x=898;cf.y=532;cf.textAutoResize='HEIGHT';cf.resize(264,cf.height);cf.characters='Pause clearly · Resume by choice\nShare only as agreed';cf.fontSize=10;changed.push(cf.id);
board.name='05 / Technical feasibility + Product function / Reference aligned 2026-10-09';changed.push(board.id);
const root=frame(board,'Board 05 / Reference layout / Left half',0,0,854,595);root.clipsContent=true;
rect(root,'White base',0,0,854,595,'white');
const wash=rect(root,'Warm product background',320,0,534,570,'white');
wash.fills=[{type:'GRADIENT_LINEAR',gradientTransform:[[1,0,0],[0,1,0]],gradientStops:[{position:0,color:{r:1,g:1,b:1,a:1}},{position:.65,color:{r:1,g:.958,b:.91,a:1}},{position:1,color:{r:1,g:.86,b:.70,a:1}}]}];
text(root,'Technical heading','TECHNICAL FEASIBILITY',28,25,287,20,'SemiBold','accentText');
text(root,'Product heading','PRODUCT FUNCTION',332,25,492,20,'SemiBold','accentText');
text(root,'Architecture subtitle','Proposed component architecture',28,65,287,13,'SemiBold');
img(root,'NEARBY / Blender exploded assembly','21ddc64ac16c2131ccc3101f5128030dede7db49',29,92,279,293);
text(root,'Assembly caption','Familiar tray / four-point lift / mobile cabinet',28,391,282,10.7,'Medium');
text(root,'Prototype configuration','Prototype: STM32 + camera, four A2 electric\nactuators and a powered wheel base.',28,411,282,10,'Regular','muted');
const library=frame(p,'NEARBY / Board 05 / Local layout components',far,archive.y+710,320,200);
const tile=figma.createComponent();library.appendChild(tile);tile.name='NEARBY / Hardware image + caption';tile.layoutMode='VERTICAL';tile.primaryAxisSizingMode='AUTO';tile.counterAxisSizingMode='FIXED';tile.resize(88,78);tile.itemSpacing=3;tile.fills=[];created.push(tile.id);
const visual=img(tile,'Visual', 'd80e64b17ebd59ed31c7abb55d8f04b30f4ff59b',0,0,88,38);
const label=text(tile,'Label','Wheel base',0,0,88,10,'SemiBold');label.textAlignHorizontal='CENTER';
const sub=text(tile,'Source','Project model',0,0,88,8,'Regular','muted');sub.textAlignHorizontal='CENTER';
const lp=tile.addComponentProperty('Label','TEXT','Wheel base');label.componentPropertyReferences={characters:lp};
const sp=tile.addComponentProperty('Source','TEXT','Project model');sub.componentPropertyReferences={characters:sp};
tile.description='Compact component reference tile for Board 05. Image, caption and source remain individually editable.';
const grid=figma.createAutoLayout('VERTICAL');root.appendChild(grid);grid.name='Six hardware references';grid.fills=[];grid.itemSpacing=10;grid.x=28;grid.y=451;created.push(grid.id);
const entries=[
['STM32 control','H747I-DISCO ref.','193c227f74eaff9fbb14d38a009d0e87ff49b9b3'],
['Linear drive','Bansbach ref.','afa48b79b1160b346a5194db4b50f0fcd3ff3f78'],
['Wheel base','Project model','d80e64b17ebd59ed31c7abb55d8f04b30f4ff59b'],
['Four lift posts','Project model','0202ea09e4a0194baa2059e8614a2d6de77f8a48'],
['Direct controls','Project model','5955a79332fbc1d990758b78818acd3f20bf2d5b'],
['Familiar tray','Project model','f5b3e86ec292e57779f2490544f6adacdc3d3111']];
for(let r=0;r<2;r++){const row=figma.createAutoLayout('HORIZONTAL');grid.appendChild(row);row.fills=[];row.itemSpacing=10;created.push(row.id);for(let j=0;j<3;j++){const e=entries[r*3+j];const i=tile.createInstance();row.appendChild(i);i.setProperties({[lp]:e[0],[sp]:e[1]});i.findOne(n=>n.name==='Visual').fills=[{type:'IMAGE',imageHash:e[2],scaleMode:'FIT'}];created.push(i.id,...i.findAll(()=>true).map(n=>n.id));}}
const iconDefs=[['127:178','Request'],['127:157','Lift'],['127:164','Move'],['127:184','Feedback']];
for(let j=0;j<iconDefs.length;j++){const c=await figma.getNodeByIdAsync(iconDefs[j][0]);const i=c.createInstance();root.appendChild(i);i.rescale(23/c.width);i.x=337+j*49;i.y=69;created.push(i.id,...i.findAll(()=>true).map(n=>n.id));text(root,'Function '+iconDefs[j][1],iconDefs[j][1],331+j*49,98,42,8.8,'Medium');}
const controller=frame(root,'Local control module',552,65,286,80);
rect(controller,'Panel',0,0,286,80,'white');rect(controller,'Header',0,0,286,20,'accent');
text(controller,'Label','Local control + recognition',9,3,268,10.5,'SemiBold','white');
text(controller,'Copy','STM32 + camera process face input locally.\nPhone commands connect to device control.\nExact board and link protocol to be confirmed.',10,27,266,10.3);
img(root,'NEARBY / Blender main product','2d7da6f3f26df3b39322a58e64def35ef23663a2',476,155,368,333);
function callout(label,copy,y){const box=figma.createAutoLayout('VERTICAL');root.appendChild(box);box.name='Feature / '+label;box.fills=[];box.itemSpacing=7;box.resize(128,80);box.x=332;box.y=y;box.primaryAxisSizingMode='AUTO';box.counterAxisSizingMode='FIXED';created.push(box.id);const bar=figma.createAutoLayout('VERTICAL');box.appendChild(bar);bar.fills=[paint('accent')];bar.paddingLeft=7;bar.paddingTop=4;bar.paddingBottom=4;bar.resize(128,21);bar.primaryAxisSizingMode='AUTO';bar.counterAxisSizingMode='FIXED';created.push(bar.id);text(bar,'Feature label',label,0,0,114,10.6,'SemiBold','white');text(box,'Feature explanation',copy,0,0,128,11.3);return box;}
callout('Direct request','COME / STAY / HELP\nLarge words and\ntactile controls.',166);
callout('Four-point lift','Raise the same tray.\nKeep familiar objects\nin the same places.',278);
callout('Visible feedback','Show moving, parked\nor paused before\nthe next action.',391);
poly(root,'Leader / controls',[[460,176],[482,176],[482,267],[597,267]]);dot(root,597,267);
poly(root,'Leader / lift',[[460,288],[506,288],[506,330],[721,330]]);dot(root,721,330);
poly(root,'Leader / status',[[460,401],[491,401],[491,160],[673,160]]);dot(root,673,160);
const details=figma.createAutoLayout('HORIZONTAL');root.appendChild(details);details.name='Model detail strip';details.fills=[];details.itemSpacing=20;details.x=332;details.y=498;created.push(details.id);
for(const e of [['Tray arrangement','Four familiar places','f5b3e86ec292e57779f2490544f6adacdc3d3111'],['Direct buttons','Request · pause · help','5955a79332fbc1d990758b78818acd3f20bf2d5b'],['Mobile base','Powered wheel concept','d80e64b17ebd59ed31c7abb55d8f04b30f4ff59b']]){const i=tile.createInstance();details.appendChild(i);i.resize(154,i.height);i.setProperties({[lp]:e[0],[sp]:e[1]});const v=i.findOne(n=>n.name==='Visual');v.resize(154,38);v.fills=[{type:'IMAGE',imageHash:e[2],scaleMode:'FIT'}];for(const t of i.findAllWithCriteria({types:['TEXT']}))t.resize(154,t.height);created.push(i.id,...i.findAll(()=>true).map(n=>n.id));}
text(root,'Sources and concept status','Project Blender renders · ST / SnapMagic + Bansbach component references · illustrative parts; fit and control require validation.',28,582,810,7.5,'Regular','muted');
text(board,'Right section title','Design Features',878,25,778,26,'SemiBold');
const footer=await figma.getNodeByIdAsync('145:1456');footer.visible=true;footer.x=878;footer.y=575;footer.resize(700,footer.height);footer.fontSize=8.4;footer.textAutoResize='HEIGHT';footer.characters='Editable caregiver and remote interfaces remain in the accompanying prototype.';changed.push(footer.id);
const types={};for(const n of root.findAll(()=>true))types[n.type]=(types[n.type]||0)+1;
const images=root.findAll(n=>Array.isArray(n.fills)&&n.fills.some(f=>f.type==='IMAGE')).map(n=>({id:n.id,name:n.name,w:n.width,h:n.height}));
const fonts=[...new Set(root.findAllWithCriteria({types:['TEXT']}).map(t=>t.fontName.family))];
figma.currentPage.selection=[board];figma.viewport.scrollAndZoomIntoView([board]);
return {boardId:board.id,rootId:root.id,archiveId:archive.id,libraryId:library.id,tileId:tile.id,createdNodeIds:created,mutatedNodeIds:changed,nodeTypes:types,images,fonts,gridBounds:{x:grid.x,y:grid.y,width:grid.width,height:grid.height},detailBounds:{x:details.x,y:details.y,width:details.width,height:details.height}};
