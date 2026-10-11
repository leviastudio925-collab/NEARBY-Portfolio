await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('0:1'));
await Promise.all(['Regular','Medium','SemiBold','Bold'].map(style=>figma.loadFontAsync({family:'IBM Plex Sans',style})));
const board=await figma.getNodeByIdAsync('84:635');
const archive=board.clone();figma.currentPage.appendChild(archive);archive.x=34100;archive.y=-3065;archive.name='ARCHIVE / Board 06 / before six-function UI / 2026-10-09';
const changed=[board.id],created=[archive.id,...archive.findAll(()=>true).map(n=>n.id)];
for(const n of board.children){n.visible=false;changed.push(n.id);}board.name='06 / Connected home UI / Overview + six functions';
function tx(s,x,y,w,size=14,color={r:.14,g:.14,b:.14},weight='Regular'){const n=figma.createText();board.appendChild(n);n.fontName={family:'IBM Plex Sans',style:weight};n.fontSize=size;n.lineHeight={unit:'PERCENT',value:130};n.fills=[{type:'SOLID',color}];n.characters=s;n.textAutoResize='HEIGHT';n.resize(w,n.height);n.x=x;n.y=y;created.push(n.id);return n;}
tx('Connected home interface',28,25,1100,26,undefined,'SemiBold');
tx('A whole-home view, with six focused ways to keep everyday essentials close.',28,64,1300,15,{r:.45,g:.42,b:.40});
tx('Whole-home overview',28,103,619,16,undefined,'SemiBold');
const d=(await figma.getNodeByIdAsync('282:1364')).clone();board.appendChild(d);d.rescale(.43);d.x=28;d.y=133;created.push(d.id,...d.findAll(()=>true).map(n=>n.id));
const ids=['282:1504','282:1596','282:1658','282:1723','282:1794','282:1856'];
const labels=['01 / Home scan','02 / People','03 / Find objects','04 / Storage','05 / Family','06 / Remote'];
const copy=['Recognize rooms and review agreed places.','Confirm who is present before saving a profile.','Locate familiar objects with a last-seen time.','Keep everyday items in consistent positions.','Send a request and check delivery and replies.','Choose a stop, move on request and pause.'];
tx('Six functions / mobile companion',676,103,980,16,undefined,'SemiBold');
const clones=[];
for(let i=0;i<6;i++){const x=676+i*165;tx(labels[i],x,141,153,13,{r:.64,g:.31,b:.05},'SemiBold');const n=(await figma.getNodeByIdAsync(ids[i])).clone();board.appendChild(n);n.rescale(.385);n.x=x;n.y=169;n.name='UI presentation / '+labels[i];created.push(n.id,...n.findAll(()=>true).map(v=>v.id));clones.push(n.id);tx(copy[i],x,510,150,11,{r:.45,g:.42,b:.40});}
tx('Rooms · people · objects · device status',28,535,619,12,{r:.45,g:.42,b:.40});
tx('Concept UI · demonstration map, profiles and device states. Editable screens and interaction states are provided in the working UI area.',28,574,1510,9,{r:.48,g:.46,b:.44});tx('06 / 06',1595,574,62,11,{r:.48,g:.46,b:.44});
figma.currentPage.selection=[board];figma.viewport.scrollAndZoomIntoView([board]);
return {createdNodeIds:created,mutatedNodeIds:changed,boardId:board.id,archiveId:archive.id,dashboardClone:d.id,mobileClones:clones};
