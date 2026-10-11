await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('0:1'));
await Promise.all(['Regular','Medium','SemiBold','Bold'].map(style=>figma.loadFontAsync({family:'IBM Plex Sans',style})));
const root=await figma.getNodeByIdAsync('278:1242');root.resize(2920,2040);
const made=[], links=[], screens=[];
const V={orange:'VariableID:84:133',pale:'VariableID:84:134',border:'VariableID:84:135',ink:'VariableID:84:136',muted:'VariableID:84:137',white:'VariableID:84:138',red:'VariableID:84:139',warm:'VariableID:84:140',accent:'VariableID:95:160'};
const vars={};for(const k in V)vars[k]=await figma.variables.getVariableByIdAsync(V[k]);
const C={orange:'#F28A2E',pale:'#FFF1E5',border:'#E7D8CD',ink:'#242424',muted:'#797571',white:'#FFFFFF',warm:'#F5F1EB',accent:'#A44F0D',red:'#B64930',panel:'#303234',soft:'#B9BAB8',green:'#91BCA6'};
const iconIds={home:'127:161',map:'127:204',person:'127:169',find:'127:142',storage:'127:157',family:'127:173',remote:'127:164',pin:'127:200',arrow:'127:190',check:'127:184',settings:'127:207',battery:'127:193',stop:'127:181',phone:'127:147',bottle:'127:151',tissues:'127:154',alert:'127:187'};
const icons={};for(const k in iconIds)icons[k]=await figma.getNodeByIdAsync(iconIds[k]);
const action=await figma.getNodeByIdAsync('127:213');
const MAP='95cbf0aa8d2dc0032d2e67ee9cf80ac2ce66efe6',PERSON='9f29f5f1af9fd31da71c60704f46e96bdde857d8',SCENE='d3f02109acc15318d249ff8383d01eccc68b3ccf',PRODUCT='2d7da6f3f26df3b39322a58e64def35ef23663a2',TRAY='8c1451f5a4b2e8c8a9bdfca6dffab87d8d7122fb';
function rgb(k){const h=(C[k]||k).replace('#','');return {r:parseInt(h.slice(0,2),16)/255,g:parseInt(h.slice(2,4),16)/255,b:parseInt(h.slice(4,6),16)/255};}
function paint(k){let p={type:'SOLID',color:rgb(k)};return vars[k]?figma.variables.setBoundVariableForPaint(p,'color',vars[k]):p;}
function keep(n){made.push(n.id);return n;}
function box(p,name,x,y,w,h,color='white',r=0){const n=keep(figma.createFrame());p.appendChild(n);n.name=name;n.resize(w,h);n.x=x;n.y=y;n.fills=color?[paint(color)]:[];n.cornerRadius=r;n.clipsContent=true;return n;}
function txt(p,s,x,y,w,size=16,color='ink',weight='Regular'){const n=keep(figma.createText());p.appendChild(n);n.name=s.slice(0,45);n.fontName={family:'IBM Plex Sans',style:weight};n.fontSize=size;n.lineHeight={unit:'PERCENT',value:130};n.fills=[paint(color)];n.characters=s;n.textAutoResize='HEIGHT';n.resize(w,n.height);n.x=x;n.y=y;return n;}
function image(p,name,hash,x,y,w,h,mode='FILL',radius=16){const n=keep(figma.createRectangle());p.appendChild(n);n.name=name;n.resize(w,h);n.x=x;n.y=y;n.cornerRadius=radius;n.fills=[{type:'IMAGE',imageHash:hash,scaleMode:mode}];return n;}
function icon(p,key,x,y,size=24,color='ink'){const n=keep(icons[key].createInstance());p.appendChild(n);n.rescale(size/24);n.x=x;n.y=y;for(const v of n.findAll(c=>c.type==='VECTOR')){if(v.strokes.length)v.strokes=[paint(color)];if(v.fills.length)v.fills=[paint(color)];}return n;}
function chip(p,label,x,y,w,color='pale',ink='accent'){const n=box(p,label,x,y,w,28,color,14);txt(n,label,10,5,w-20,12,ink,'Medium');return n;}
function button(p,label,x,y,w=342,target=null){const n=keep(action.createInstance());p.appendChild(n);n.resize(w,50);n.x=x;n.y=y;n.cornerRadius=16;n.setProperties({'Label#127:0':label});for(const t of n.findAll(c=>c.type==='TEXT')){t.fontSize=16;t.resize(w-32,24);}if(target)links.push([n,target]);return n;}
function row(p,title,sub,key,x,y,w=342,dark=true){const n=box(p,title,x,y,w,70,dark?'panel':'white',16);icon(n,key,16,22,24,dark?'orange':'accent');txt(n,title,54,12,w-74,16,dark?'white':'ink','Medium');txt(n,sub,54,36,w-70,12,dark?'soft':'muted');return n;}
function mark(p,label,key,x,y,w=120){const n=box(p,label,x,y,w,36,'white',18);icon(n,key,10,9,18,'accent');txt(n,label,35,9,w-41,13,'ink','Medium');return n;}
function phone(title,subtitle,index){const x=1530+(index%3)*445,y=100+Math.floor(index/3)*950;const n=box(root,'APP / '+String(index+1).padStart(2,'0')+' / '+title,x,y,390,844,'ink',36);screens.push(n);txt(n,'9:41',24,18,90,14,'white','Medium');box(n,'Camera island',149,12,92,24,'#111213',12);icon(n,'battery',338,18,24,'white');txt(n,'NEARBY',24,63,180,14,'orange','SemiBold');icon(n,'settings',342,62,22,'white');txt(n,title,24,101,342,30,'white','SemiBold');txt(n,subtitle,24,144,342,13,'soft');return n;}
function nav(n,active){const b=box(n,'Bottom navigation',12,766,366,64,'panel',24);['Home','Find','Family','Remote'].forEach((s,i)=>{const x=8+i*88;const selected=i===active;const item=box(b,s,x,7,86,50,selected?'orange':null,18);icon(item,['home','find','family','remote'][i],31,5,21,selected?'ink':'soft');const t=txt(item,s,3,29,80,10,selected?'ink':'soft','Medium');t.textAlignHorizontal='CENTER';links.push([item,['map','find','family','remote'][i]]);});}
function sectionLabel(s,x,y,w){txt(root,s,x,y,w,22,'ink','SemiBold');}
txt(root,'NEARBY / Connected home, familiar things.',40,30,2600,34,'ink','SemiBold');
const dash=box(root,'DASHBOARD / Whole-home overview',40,100,1440,900,'warm',32);
box(dash,'Navigation rail',16,16,84,868,'white',28);icon(dash,'home',44,42,28,'accent');
const navLabels=['Overview','People','Find','Storage','Family','Control'];const keys=['map','person','find','storage','family','remote'];
for(let i=0;i<6;i++){const item=box(dash,'Navigate '+navLabels[i],25,146+i*99,66,78,i===0?'ink':null,22);icon(item,keys[i],21,12,24,i===0?'white':'ink');const t=txt(item,navLabels[i],1,45,64,10,i===0?'white':'muted','Medium');t.textAlignHorizontal='CENTER';links.push([item,['map','people','find','storage','family','remote'][i]]);}
txt(dash,'Your home, at a glance',128,35,750,32,'ink','SemiBold');txt(dash,'Anna’s apartment  /  Overview',128,82,580,14,'muted');chip(dash,'DEMO HOME',1240,39,156,'pale','accent');
const modes=box(dash,'Map layer filters',128,124,560,48,'white',24);['All rooms','People','Objects','Device'].forEach((s,i)=>{const f=box(modes,s,5+i*137,5,134,38,i===0?'ink':null,20);const t=txt(f,s,10,10,114,13,i===0?'white':'muted','Medium');t.textAlignHorizontal='CENTER';links.push([f,['map','people','find','remote'][i]]);});
image(dash,'Three-dimensional apartment',MAP,116,190,968,600,'FIT',24);
links.push([mark(dash,'Anna · living room','person',325,576,180),'people']);
links.push([mark(dash,'Glasses · tray','find',460,674,158),'find']);
links.push([mark(dash,'NEARBY · parked','storage',202,709,176),'remote']);
mark(dash,'Bedroom','pin',801,349,124);mark(dash,'Kitchen','pin',260,347,114);
const status=box(dash,'Home status strip',128,803,930,65,'white',20);
for(const [i,a]of [['4 rooms','Map reviewed'],['1 person','Confirmed profile'],['4 essentials','Saved locations'],['82% battery','Device online']].entries()){icon(status,['map','person','storage','battery'][i],18+i*233,22,24,'accent');txt(status,a[0],54+i*233,12,172,16,'ink','Medium');txt(status,a[1],54+i*233,37,172,12,'muted');}
const dev=box(dash,'NEARBY device card',1100,123,308,316,'white',26);txt(dev,'NEARBY',20,18,170,20,'ink','SemiBold');chip(dev,'Online',218,19,70,'pale','accent');txt(dev,'Living room · parked',20,51,268,14,'muted');image(dev,'Current cabinet',PRODUCT,54,83,200,148,'FIT',0);button(dev,'Remote control',20,249,268,'remote');
const person=box(dash,'Recognized person card',1100,453,308,174,'white',26);icon(person,'person',20,20,27,'accent');txt(person,'Anna is in the living room',58,18,228,17,'ink','SemiBold');txt(person,'Confirmed profile · seen 09:41',20,68,268,13,'muted');button(person,'Review people',20,105,268,'people');
const item=box(dash,'Find an item card',1100,641,308,227,'white',26);icon(item,'find',20,20,28,'accent');txt(item,'Looking for something?',58,18,230,17,'ink','SemiBold');txt(item,'Glasses',20,67,268,25,'ink','SemiBold');txt(item,'Last seen on the NEARBY tray\nLiving room · 09:40',20,105,268,14,'muted');button(item,'Find an object',20,158,268,'find');

const home=phone('Your whole home','Map reviewed today · 4 rooms',0);const mapCard=box(home,'Whole-home map card',16,185,358,286,'warm',26);image(mapCard,'Apartment map',MAP,0,0,358,253,'FIT',22);chip(mapCard,'Living room',18,238,125);chip(mapCard,'NEARBY parked',150,238,150);links.push([mapCard,'remote']);
const shortcuts=box(home,'Six function shortcuts',24,491,342,166,null,0);shortcuts.layoutMode='VERTICAL';shortcuts.itemSpacing=10;
for(let r=0;r<2;r++){const strip=box(shortcuts,'Function row',0,0,342,78,null);strip.layoutMode='HORIZONTAL';strip.itemSpacing=9;for(let c=0;c<3;c++){const i=r*3+c;const tile=box(strip,navLabels[i],0,0,108,78,'panel',18);icon(tile,keys[i],42,12,24,'orange');const t=txt(tile,['Home scan','People','Find items','Storage','Family','Control'][i],4,48,100,12,'white','Medium');t.textAlignHorizontal='CENTER';links.push([tile,['map','people','find','storage','family','remote'][i]]);}}
button(home,'Review rooms & boundaries',24,690,342,'mapReview');nav(home,0);

const people=phone('People at home','Known faces, with your confirmation',1);image(people,'Anna in her living room',PERSON,16,185,358,285,'FILL',26);const recognition=box(people,'Recognition frame',56,203,137,172,null,16);recognition.strokes=[paint('orange')];recognition.strokeWeight=2;chip(people,'Anna · confirmed',34,430,173,'white','ink');row(people,'Anna','Living room · seen at 09:41','person',24,491);row(people,'Unknown visitor','No profile match · review before saving','alert',24,572);button(people,'Review recognized people',24,690,342,'peopleReview');nav(people,0);

const find=phone('Find an object','A clear location for everyday essentials',2);const search=box(find,'Object search',24,185,342,52,'panel',18);icon(search,'find',16,15,24,'orange');txt(search,'Glasses',55,15,240,16,'white','Medium');
image(find,'Glasses on the tray',SCENE,16,254,358,267,'FILL',26);const focus=box(find,'Glasses location highlight',111,325,75,50,null,12);focus.strokes=[paint('orange')];focus.strokeWeight=2;chip(find,'Last seen · 09:40',34,477,169,'white','ink');row(find,'Glasses are on the tray','Living room · check the latest image','find',24,540);txt(find,'Can’t see them? Scan again to update the location.',26,629,334,13,'soft');button(find,'Show location on map',24,690,342,'map');nav(find,1);

const storage=phone('A place for everything','Familiar positions, easier to remember',3);const tray=box(storage,'Tray arrangement',16,185,358,205,'warm',26);image(tray,'Model of the tray',TRAY,33,0,292,190,'FIT',0);chip(tray,'4 saved positions',100,160,162);
const stock=box(storage,'Stored items',24,411,342,242,null);stock.layoutMode='VERTICAL';stock.itemSpacing=10;for(const a of [['Glasses','Tray · front left','find'],['Phone','Tray · center','phone'],['Water + tissues','Tray · back right / back left','bottle']])row(stock,a[0],a[1],a[2],0,0,342,true);
button(storage,'Edit saved positions',24,690,342,'storageEdit');nav(storage,1);

const family=phone('Keep family close','Clear messages and visible replies',4);const contact=box(family,'Family contact',24,185,342,120,'panel',24);icon(contact,'family',20,25,40,'orange');txt(contact,'Mei',82,22,230,24,'white','SemiBold');txt(contact,'Daughter · preferred contact',82,60,230,13,'soft');
const request=box(family,'Help notification',24,325,342,210,'panel',24);chip(request,'HELP REQUEST',18,18,140);txt(request,'Could you give me a hand?',18,63,306,21,'white','SemiBold');txt(request,'Include: request + living room location',18,103,306,13,'soft');txt(request,'Sent 09:38  ·  Delivered',18,149,306,13,'orange','Medium');
const reply=box(family,'Caregiver reply',24,554,342,95,'pale',22);txt(reply,'Mei replied · 09:40',18,15,306,13,'accent','SemiBold');txt(reply,'“I’ll call you in a moment.”',18,42,306,20,'ink','Medium');button(family,'Send a new notification',24,690,342,'familySent');nav(family,2);

const remote=phone('Beside you, on request','Living room · connected',5);image(remote,'Live device scenario',SCENE,16,185,358,244,'FILL',26);chip(remote,'STAY · parked',34,386,155,'white','ink');const dest=row(remote,'Destination: day chair','Agreed stop · living room','pin',24,448);links.push([dest,'map']);
const controls=box(remote,'Direction controls',24,537,342,107,'panel',24);txt(controls,'Move to an agreed place',16,12,310,14,'white','Medium');const come=button(controls,'COME',16,43,150,'moving');const stay=box(controls,'STAY control',177,43,149,50,'white',16);txt(stay,'STAY',221-177,13,92,16,'ink','SemiBold');links.push([stay,'stopped']);
txt(remote,'STAY pauses movement. Resume only with a new request.',26,655,334,13,'soft');button(remote,'Ask family for help',24,702,342,'family');nav(remote,3);

sectionLabel('Six connected functions',40,1055,1420);txt(root,'Recognize the home → confirm the person → find an item → keep its place → notify family → control the device.',40,1093,1390,19,'muted');
const summaries=[['01 / Whole-home recognition','Review rooms, doorways and agreed stops.','map'],['02 / Person recognition','Confirm a profile before applying preferences.','person'],['03 / Object finding','Show the last seen place and capture time.','find'],['04 / Storage','Give each familiar object a consistent position.','storage'],['05 / Family notifications','Separate sent, delivered and replied states.','family'],['06 / Remote control','Request a destination, pause and resume clearly.','remote']];
for(let i=0;i<6;i++){const x=40+(i%2)*710,y=1160+Math.floor(i/2)*148;const c=box(root,summaries[i][0],x,y,680,124,'white',24);icon(c,summaries[i][2],24,29,36,'accent');txt(c,summaries[i][0],82,23,570,21,'ink','SemiBold');txt(c,summaries[i][1],82,65,564,16,'muted');}
txt(root,'Concept UI · example identities, locations and device states. No live recognition or hardware control is connected.',40,1634,1380,16,'muted');
return {createdNodeIds:made,mutatedNodeIds:[root.id],dashboardId:dash.id,screenIds:screens.map(n=>n.id),links:links.map(([n,key])=>({id:n.id,target:key})),counts:{nodes:made.length,mobileScreens:screens.length}};

