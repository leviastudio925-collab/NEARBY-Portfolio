await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('0:1'));
await Promise.all(['Regular','Medium','SemiBold','Bold'].map(style=>figma.loadFontAsync({family:'IBM Plex Sans',style})));
const board=await figma.getNodeByIdAsync('84:480'),made=[],changed=[];
for(const n of board.children)if(n.visible&&n.x>=878&&n.y<595){n.visible=false;changed.push(n.id);}
const root=figma.createFrame();board.appendChild(root);root.name='Board 05 / Bright app development showcase';root.resize(806,595);root.x=878;root.y=0;root.fills=[{type:'SOLID',color:{r:1,g:1,b:1}}];root.clipsContent=true;made.push(root.id);
const vars={};for(const [k,id]of Object.entries({ink:'VariableID:84:136',muted:'VariableID:84:137',warm:'VariableID:84:140',pale:'VariableID:84:134',accent:'VariableID:95:160',border:'VariableID:84:135'}))vars[k]=await figma.variables.getVariableByIdAsync(id);
const colors={ink:{r:.141176,g:.141176,b:.141176},muted:{r:.47451,g:.45882,b:.44314},warm:{r:.960784,g:.945098,b:.92549},pale:{r:1,g:.945098,b:.898039},accent:{r:.643137,g:.309804,b:.05098},border:{r:.90588,g:.84706,b:.80392}};
function p(k){return figma.variables.setBoundVariableForPaint({type:'SOLID',color:colors[k]},'color',vars[k]);}
function rect(name,x,y,w,h,color='warm',r=10){const n=figma.createRectangle();root.appendChild(n);n.name=name;n.resize(w,h);n.x=x;n.y=y;n.cornerRadius=r;n.fills=[p(color)];made.push(n.id);return n;}
function text(s,x,y,w,size=14,color='ink',weight='Regular'){const n=figma.createText();root.appendChild(n);n.fontName={family:'IBM Plex Sans',style:weight};n.fontSize=size;n.lineHeight={unit:'PERCENT',value:125};n.fills=[p(color)];n.characters=s;n.textAutoResize='HEIGHT';n.resize(w,n.height);n.x=x;n.y=y;made.push(n.id);return n;}
function path(name,pts){const n=figma.createVector();root.appendChild(n);n.name=name;n.vectorPaths=[{windingRule:'NONZERO',data:pts.map((p,i)=>(i?'L ':'M ')+p[0]+' '+p[1]).join(' ')}];n.fills=[];n.strokes=[p('muted')];n.strokeWeight=.7;made.push(n.id);return n;}
const wash=rect('Warm project palette backdrop',476,0,330,595,'warm',0);wash.fills=[{type:'GRADIENT_LINEAR',gradientTransform:[[1,0,0],[0,1,0]],gradientStops:[{position:0,color:{r:1,g:1,b:1,a:0}},{position:1,color:{...colors.warm,a:1}}]}];
text('APP DEVELOPMENT',0,25,770,26,'accent','SemiBold');rect('Section rule',0,67,778,1,'border',0);text('Hi-fi interface',0,76,300,15,'ink','SemiBold');
rect('People explanation',112,153,165,137,'warm');text('People\nrecognition',124,164,145,17,'ink','SemiBold');text('Confirm a familiar face before using a saved profile.',124,216,141,12,'muted');
rect('Find explanation',0,388,140,113,'warm');text('Find objects',0,359,145,17,'ink','SemiBold');text('Locate familiar things. Check where and when they were last seen.',12,401,116,12,'muted');
rect('Home explanation',290,472,173,75,'pale');text('One home overview.\nSix everyday functions.\nClear device status.',302,484,150,12,'accent');
rect('Family explanation',684,156,105,132,'warm');text('Send a request.\nCheck delivery\nand the family’s\nreply.',696,171,81,12,'muted');
text('Home',302,102,155,18,'ink','SemiBold');text('Family notifications',506,95,265,17,'ink','SemiBold');text('Storage',495,330,130,17,'ink','SemiBold');text('Remote control',652,330,142,17,'ink','SemiBold');
path('Flow / people to home',[[107,256],[286,256],[286,240],[302,240]]);
path('Flow / find to home',[[245,447],[276,447],[276,394],[302,394]]);
path('Flow / family',[[453,224],[488,224],[488,208],[506,208]]);
path('Flow / storage',[[453,418],[478,418],[478,464],[495,464]]);
path('Flow / remote',[[453,453],[631,453],[631,452],[657,452]]);
async function screen(id,name,x,y,w){const n=(await figma.getNodeByIdAsync(id)).clone();root.appendChild(n);n.name='Bright UI / '+name;n.rescale(w/n.width);n.x=x;n.y=y;n.strokes=[p('border')];n.strokeWeight=.65;n.effects=[{type:'DROP_SHADOW',color:{r:.18,g:.14,b:.1,a:.10},offset:{x:0,y:2},radius:5,spread:0,visible:true,blendMode:'NORMAL'}];made.push(n.id,...n.findAll(()=>true).map(c=>c.id));return n;}
const screens=[];
screens.push(await screen('286:1747','People recognition',10,119,96));
screens.push(await screen('286:1809','Object finding',149,346,96));
screens.push(await screen('286:1655','Whole-home overview',302,128,151));
screens.push(await screen('286:1945','Family reply',506,123,83));
screens.push(await screen('286:2272','Notification sent',595,123,83));
screens.push(await screen('286:1874','Storage positions',495,357,91));
screens.push(await screen('286:2007','Remote control',657,357,91));
text('Saved item positions',487,559,159,10,'muted');text('COME · STAY · HELP',649,559,142,10,'muted');
text('Editable concept UI · example recognition results and device states.',0,581,660,8,'muted');text('05 / 06',722,579,62,10,'muted');
figma.currentPage.selection=[root];figma.viewport.scrollAndZoomIntoView([board]);
return {createdNodeIds:made,mutatedNodeIds:changed,showcaseId:root.id,screens:screens.map(n=>({id:n.id,name:n.name,x:n.x,y:n.y,w:n.width,h:n.height})),hiddenOldContent:changed.length};
