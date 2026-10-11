await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('0:1'));
await Promise.all(['Regular','Medium','SemiBold','Bold'].map(style=>figma.loadFontAsync({family:'IBM Plex Sans',style})));
const root=await figma.getNodeByIdAsync('309:3220'),assets=await figma.getNodeByIdAsync('309:3221'),board=await figma.getNodeByIdAsync('296:3382');
const made=[],changed=[];
const vars={orange:'VariableID:84:133',pale:'VariableID:84:134',border:'VariableID:84:135',ink:'VariableID:84:136',muted:'VariableID:84:137',white:'VariableID:84:138',warm:'VariableID:84:140',accent:'VariableID:95:160'};
const paints={};for(const [k,id] of Object.entries(vars)){const v=await figma.variables.getVariableByIdAsync(id);paints[k]=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:1,g:1,b:1}},'color',v)];}
function rect(name,x,y,w,h,color,parent=root){const n=figma.createRectangle();parent.appendChild(n);n.name=name;n.resize(w,h);n.x=x;n.y=y;n.fills=paints[color];made.push(n.id);return n;}
function txt(s,x,y,w,size=11,color='ink',style='Regular',parent=root){const n=figma.createText();parent.appendChild(n);n.name=s.replaceAll('\n',' ').slice(0,70);n.fontName={family:'IBM Plex Sans',style};n.fontSize=size;n.lineHeight={unit:'PERCENT',value:125};n.fills=paints[color];n.characters=s;n.textAutoResize='HEIGHT';n.resize(w,n.height);n.x=x;n.y=y;made.push(n.id);return n;}
function imageBox(key,x,y,w,h,fit='FILL'){const n=rect(key,x,y,w,h,'warm');n.fills=[{type:'IMAGE',imageHash:HASHES[key],scaleMode:fit}];return n;}
// Shared photo and caption component: every repeated panel remains editable.
const component=figma.createComponent();assets.appendChild(component);component.name='NEARBY / Prototype evidence photo';component.description='Source photograph or video still with editable caption and source credit.';component.layoutMode='VERTICAL';component.itemSpacing=3;component.primaryAxisSizingMode='FIXED';component.counterAxisSizingMode='FIXED';component.resize(160,110);component.fills=[];made.push(component.id);
const photo=rect('Media',0,0,160,81,'warm',component);photo.layoutSizingHorizontal='FILL';photo.layoutSizingVertical='FILL';
const title=txt('Photo caption',0,0,160,10,'ink','Medium',component);title.layoutSizingHorizontal='FILL';
const source=txt('Source photo',0,0,160,8,'muted','Regular',component);source.layoutSizingHorizontal='FILL';
const captionProp=component.addComponentProperty('Caption','TEXT','Photo caption'),sourceProp=component.addComponentProperty('Source','TEXT','Source photo');title.componentPropertyReferences={characters:captionProp};source.componentPropertyReferences={characters:sourceProp};
const captionStyle=figma.createTextStyle();captionStyle.name='NEARBY / Evidence caption';captionStyle.fontName={family:'IBM Plex Sans',style:'Medium'};captionStyle.fontSize=10;captionStyle.lineHeight={unit:'PERCENT',value:125};title.textStyleId=captionStyle.id;
const sourceStyle=figma.createTextStyle();sourceStyle.name='NEARBY / Evidence source';sourceStyle.fontName={family:'IBM Plex Sans',style:'Regular'};sourceStyle.fontSize=8;sourceStyle.lineHeight={unit:'PERCENT',value:125};source.textStyleId=sourceStyle.id;
function tile(key,caption,x,y,w,h,credit='',fit='FILL'){const n=component.createInstance();root.appendChild(n);n.name=caption+' / '+key;n.resize(w,h);n.x=x;n.y=y;n.setProperties({[captionProp]:caption,[sourceProp]:credit||key.replaceAll('_',' ')});const r=n.findOne(c=>c.type==='RECTANGLE'&&c.name==='Media');r.fills=[{type:'IMAGE',imageHash:HASHES[key],scaleMode:fit}];made.push(n.id,...n.findAll(()=>true).map(c=>c.id));return n;}
rect('White page',0,0,1684,595,'white');rect('Electronics warm field',842,0,842,595,'warm');rect('Section separator',841,24,1,547,'border');
txt('PROTOTYPE ASSEMBLY',28,24,790,24,'accent','SemiBold');txt('ELECTRONICS & INTEGRATION',866,24,790,24,'accent','SemiBold');
rect('Assembly title rule',28,58,792,1,'orange');rect('Electronics title rule',866,58,790,1,'orange');
txt('A full-scale build exploring cabinet construction, guided lift hardware and the integration of physical controls.',28,73,254,11,'muted');
txt('Build sequence',28,130,256,13,'ink','SemiBold');
for(const [i,label] of ['01  Cabinet','02  Lift','03  Wiring'].entries()){const x=28+i*89;rect('Build step '+i,x,153,80,26,'pale');txt(label,x+7,159,72,10,'accent','Medium');if(i<2)txt('›',x+81,156,9,14,'accent');}
txt('Cabinet construction',28,192,258,13,'ink','SemiBold');
tile('IMG_5706','Lay out the panels',28,215,124,154);
tile('IMG_5705','Fasten the frame',164,215,124,154);
tile('IMG_5703','Fit the drawer rails',28,390,124,160);
tile('IMG_5719','Assemble the cabinet',164,390,124,160);
rect('Prototype hero field',310,73,510,262,'warm');
imageBox('IMG_5789-transparent',317,74,257,259,'FIT');
imageBox('IMG_5702',654,84,145,235,'FIT');
txt('Full-scale\nprototype',564,90,88,13,'accent','SemiBold');
txt('Lift platform\nGuided rails\nWheeled base',564,159,86,10,'muted');
txt('Human scale',326,316,140,9,'accent','Medium');txt('Open structure',653,321,150,9,'accent','Medium');
txt('Mechanical assembly details',310,348,510,13,'ink','SemiBold');
const mech=[['IMG_5728','01  Handle hardware'],['IMG_5755','02  Internal mounting'],['IMG_5765','03  Guide rail fitting'],['IMG_5770','04  Fastener adjustment'],['IMG_5790','05  Assembled lift'],['IMG_5702','06  Integrated structure']];
for(let i=0;i<mech.length;i++)tile(mech[i][0],mech[i][1],310+(i%3)*174,371+Math.floor(i/3)*101,162,92,'Assembly record');
txt('From a hand-drawn wiring plan to board assembly, cable routing and in-device integration.',866,73,790,11,'muted');
txt('Circuit planning & bench wiring',866,101,382,13,'ink','SemiBold');
txt('In-device integration',1268,101,388,13,'ink','SemiBold');
tile('IMG_5742','Hand-drawn wiring plan',866,125,184,219);
tile('IMG_5739','Control board assembly',1064,125,184,219);
tile('IMG_5784-frame1','Connect the board',1268,125,187,219,'Video 5784 · 00:31');
tile('IMG_5783-frame2','Mount the interface',1469,125,187,219,'Video 5783 · 00:12');
txt('Connection details / recorded sequences',866,358,790,13,'ink','SemiBold');
const vids=[['IMG_5774-frame1','Actuator connector','Video 5774 · 00:10'],['IMG_5777-frame1','Cable connections','Video 5777 · 00:09'],['IMG_5779-frame1','Internal cable routing','Video 5779 · 00:06'],['IMG_5793-frame1','Bench wiring check','Video 5793 · 00:08']];
for(let i=0;i<vids.length;i++)tile(vids[i][0],vids[i][1],866+i*201,383,i===3?187:184,180,vids[i][2]);
rect('Footer rule',28,575,1628,0.5,'border');txt('NEARBY  /  Physical prototype · assembly record',28,580,770,8,'muted');txt('Photographs and video stills document the build and wiring process.',866,580,730,8,'muted');txt('06',1637,580,20,8,'muted');
const old=await figma.getNodeByIdAsync('296:3779');old.visible=false;changed.push(old.id);board.name='06 / Prototype assembly + Electronics integration / Reference layout';changed.push(board.id);figma.currentPage.selection=[root];figma.viewport.scrollAndZoomIntoView([board]);
return {createdNodeIds:made,mutatedNodeIds:changed,createdStyleIds:[captionStyle.id,sourceStyle.id],root:root.id,component:component.id,photoPanels:root.findAllWithCriteria({types:['INSTANCE']}).length,textFonts:[...new Set(root.findAllWithCriteria({types:['TEXT']}).map(n=>n.fontName.family))],imageNodes:root.findAllWithCriteria({types:['RECTANGLE']}).filter(n=>n.fills.some(f=>f.type==='IMAGE')).map(n=>({id:n.id,name:n.name,width:n.width,height:n.height})),nodeCounts:root.findAll(()=>true).reduce((a,n)=>(a[n.type]=(a[n.type]||0)+1,a),{})};
