await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('0:1'));
await Promise.all(['Regular','Medium','SemiBold','Bold','Medium Italic'].map(style=>figma.loadFontAsync({family:'IBM Plex Sans',style})));
const board=await figma.getNodeByIdAsync('84:480'),old=await figma.getNodeByIdAsync('294:2752');
const made=[],changed=[old.id],sx=806/870,sy=595/681;
const root=figma.createFrame();board.appendChild(root);root.name='Board 05 / Reference-matched app layout + photographic background';root.resize(806,595);root.x=878;root.y=0;root.fills=[{type:'SOLID',color:{r:1,g:1,b:1}}];root.clipsContent=true;made.push(root.id);
let b64='';for(const id of TRANSFER_IDS)b64+=(await figma.getNodeByIdAsync(id)).characters;const im=figma.createImage(figma.base64Decode(b64));const bg=figma.createRectangle();root.appendChild(bg);bg.name='Reference composition / reconstructed photographic background';bg.resize(806,595);bg.fills=[{type:'IMAGE',imageHash:im.hash,scaleMode:'CROP',imageTransform:[[1,0,0],[0,1,0]]}];made.push(bg.id);
const palette={ink:{r:.141176,g:.141176,b:.141176},muted:{r:.47451,g:.45882,b:.44314},card:{r:.888,g:.867,b:.833},orange:{r:.949,g:.541,b:.18},accent:{r:.643,g:.31,b:.051},white:{r:1,g:1,b:1}};
function t(s,x,y,w,size=16,color='ink',style='Regular'){const n=figma.createText();root.appendChild(n);n.name=s.slice(0,60);n.fontName={family:'IBM Plex Sans',style};n.fontSize=size*sy;n.lineHeight={unit:'PERCENT',value:125};n.fills=[{type:'SOLID',color:palette[color]}];n.characters=s;n.textAutoResize='HEIGHT';n.resize(w*sx,n.height);n.x=x*sx;n.y=y*sy;made.push(n.id);return n;}
function card(name,x,y,w,h){const n=figma.createRectangle();root.appendChild(n);n.name=name;n.resize(w*sx,h*sy);n.x=x*sx;n.y=y*sy;n.cornerRadius=13*sy;n.fills=[{type:'SOLID',color:palette.card}];made.push(n.id);return n;}
function line(name,pts){const n=figma.createVector();root.appendChild(n);n.name=name;n.vectorPaths=[{windingRule:'NONZERO',data:pts.map((p,i)=>(i?'L ':'M ')+(p[0]*sx)+' '+(p[1]*sy)).join(' ')}];n.fills=[];n.strokes=[{type:'SOLID',color:{r:.43,g:.41,b:.37}}];n.strokeWeight=.7;made.push(n.id);return n;}
t('APP DEVELOPMENT',10,36,800,29,'accent','SemiBold');const rule=line('Reference header rule',[[0,90],[870,90]]);rule.strokes=[{type:'SOLID',color:palette.orange,opacity:.55}];
t('Hi-fi interface',15,91,310,18,'ink','SemiBold');
card('Reference / find and identify panel',10,184,292,131);
t('Find & identify',115,159,205,20,'ink','SemiBold');t('Find familiar things,\nconfirm who is there,\nand check their\nlocation.',128,193,166,16);
card('Reference / map and storage panel',36,427,270,192);t('Map & storage',42,399,245,19,'ink','SemiBold');t('Review the\nhome, find\nsaved places\nand keep\nitems in their\nfamiliar spots.',47,443,93,15);
card('Reference / family panel',477,111,326,75);t('Send a request\nand check delivery\nand family replies.',665,126,133,14);t('Family',658,190,180,20,'ink','SemiBold');
card('Reference / remote control panel',376,522,215,96);t('Remote\ncontrol',380,472,169,20,'ink','SemiBold');t('Choose a stop,\ncheck battery\nand control\nmovement.',392,531,108,14);
t('Home',325,119,150,20,'ink','SemiBold');
line('Reference connection / find',[[63,309],[63,325],[305,325]]);
line('Reference connection / map',[[281,450],[368,450],[368,420]]);
line('Reference connection / family',[[431,283],[478,283]]);
line('Reference connection / remote',[[431,400],[561,400],[561,416]]);
async function screen(id,name,x,y,h,rotation=0){const n=(await figma.getNodeByIdAsync(id)).clone();root.appendChild(n);n.name='Reference UI / '+name;n.rescale(h*sy/n.height);n.rotation=rotation;n.x=x*sx;n.y=y*sy;n.strokes=[{type:'SOLID',color:{r:.43,g:.40,b:.34}}];n.strokeWeight=.55;n.effects=[{type:'DROP_SHADOW',color:{r:.13,g:.1,b:.06,a:.17},offset:{x:0,y:1.5},radius:3,spread:0,visible:true,blendMode:'NORMAL'}];made.push(n.id,...n.findAll(()=>true).map(c=>c.id));return n;}
const screens=[];
screens.push(await screen('286:1809','Find objects',18,118,193));
screens.push(await screen('286:1747','Person recognition / tilted',201,235,171,-30));
screens.push(await screen('286:1655','Home / central',305,147,273));
screens.push(await screen('286:2069','Home map',143,421,160));
screens.push(await screen('286:1874','Storage',207,438,168));
screens.push(await screen('286:1945','Family reply',479,124,172));
screens.push(await screen('286:2272','Family request sent',570,124,172));
screens.push(await screen('286:2007','Remote device control',499,416,195));
const logo=(await figma.getNodeByIdAsync('127:157')).createInstance();root.appendChild(logo);logo.rescale(43*sy/24);logo.x=734*sx;logo.y=369*sy;for(const v of logo.findAll(n=>n.type==='VECTOR')){if(v.strokes.length)v.strokes=[{type:'SOLID',color:palette.orange}];if(v.fills.length)v.fills=[{type:'SOLID',color:palette.orange}];}made.push(logo.id);
const brand=t('NEARBY',706,420,101,14,'accent','SemiBold');brand.textAlignHorizontal='CENTER';
const quote=t('“Familiar things close,\nfamily connected.”',595,568,275,28,'white','Medium Italic');quote.effects=[{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:.45},offset:{x:0,y:1.5},radius:2,spread:0,visible:true,blendMode:'NORMAL'}];
t('Interactive concept · example recognition, location and device states',12,667,700,10,'muted');
old.visible=false;for(const id of TRANSFER_IDS)(await figma.getNodeByIdAsync(id)).remove();
figma.currentPage.selection=[root];figma.viewport.scrollAndZoomIntoView([board]);
return {createdNodeIds:made,mutatedNodeIds:changed,removedNodeIds:TRANSFER_IDS,showcaseId:root.id,backgroundHash:im.hash,phoneCount:screens.length,phoneIds:screens.map(n=>n.id)};
