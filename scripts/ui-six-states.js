await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('0:1'));
await Promise.all(['Regular','Medium','SemiBold','Bold'].map(style=>figma.loadFontAsync({family:'IBM Plex Sans',style})));
const root=await figma.getNodeByIdAsync('278:1242');root.resize(2920,3090);
const made=[],changed=[];
const stateTargets={map:'282:1504',people:'282:1596',find:'282:1658',storage:'282:1723',family:'282:1794',remote:'282:1856'};
const box1=await figma.getNodeByIdAsync('282:1682');box1.x=174;box1.y=316;box1.resize(54,34);changed.push(box1.id);
const box2=await figma.getNodeByIdAsync('282:1613');box2.x=72;box2.y=193;box2.resize(91,96);changed.push(box2.id);
const specs=[['mapReview','map','Review home map'],['peopleReview','people','Confirm recognized person'],['storageEdit','storage','Review saved positions'],['familySent','family','Notification sent'],['moving','remote','Moving to day chair'],['stopped','remote','Movement paused']];
function col(h){return {r:parseInt(h.slice(0,2),16)/255,g:parseInt(h.slice(2,4),16)/255,b:parseInt(h.slice(4,6),16)/255};}
function frame(p,x,y,w,h,fill){const n=figma.createFrame();p.appendChild(n);n.resize(w,h);n.x=x;n.y=y;n.cornerRadius=22;n.fills=[{type:'SOLID',color:col(fill)}];made.push(n.id);return n;}
function text(p,s,x,y,w,size=16,fill='FFFFFF',weight='Regular'){const n=figma.createText();p.appendChild(n);n.fontName={family:'IBM Plex Sans',style:weight};n.fontSize=size;n.lineHeight={unit:'PERCENT',value:130};n.fills=[{type:'SOLID',color:col(fill)}];n.characters=s;n.textAutoResize='HEIGHT';n.resize(w,n.height);n.x=x;n.y=y;made.push(n.id);return n;}
const actions=[];
function button(p,label,y,key){const n=frame(p,24,y,342,50,'F28A2E');n.name=label;const t=text(n,label,16,14,310,16,'242424','SemiBold');t.textAlignHorizontal='CENTER';actions.push([n,key]);return n;}
function swap(p,before,after){const n=p.findOne(n=>n.type==='TEXT'&&n.characters===before);if(n){n.characters=after;changed.push(n.id);}}
for(let i=0;i<specs.length;i++){
const [key,source,label]=specs[i],src=await figma.getNodeByIdAsync(stateTargets[source]),s=src.clone();root.appendChild(s);s.x=40+i*470;s.y=2150;s.name='STATE / '+label;made.push(s.id,...s.findAll(()=>true).map(n=>n.id));stateTargets[key]=s.id;
if(i<3){for(const c of s.children)if(c.y>= (i===0?478:i===1?491:411)&&c.y<766)c.visible=false;
const panel=frame(s,24,491,342,173,'303234');text(panel,label,18,18,306,20,'FFFFFF','SemiBold');
const content=i===0?'Living room · Kitchen · Bedroom · Bath\nAgreed stop: day chair\nBathroom: no movement zone':i===1?'Anna · suggested profile\nLiving room · seen 09:41\nConfirm or review before saving.':'Glasses: tray · front left\nPhone: tray · center\nWater / tissues: back right / back left';text(panel,content,18,58,306,14,'B9BAB8');button(s,i===0?'Confirm reviewed map':i===1?'Confirm Anna’s profile':'Keep these positions',690,source);
}else if(i===3){swap(s,'Sent 09:38  ·  Delivered','Sent just now · awaiting delivery');swap(s,'Mei replied · 09:40','Waiting for a reply');swap(s,'“I’ll call you in a moment.”','No response yet.');const old=s.findOne(n=>n.type==='INSTANCE'&&n.y===690);if(old)old.visible=false;button(s,'View family messages',690,'family');
}else{swap(s,'STAY · parked',i===4?'MOVING · day chair':'STAY · paused');swap(s,'Living room · connected',i===4?'On the way to the day chair':'Paused · waiting for your request');
for(const n of s.findAll(n=>n.name==='STAY control'))actions.push([n,'stopped']);for(const n of s.findAll(n=>n.type==='INSTANCE'&&n.componentProperties&&Object.values(n.componentProperties).some(v=>v.type==='TEXT'&&v.value==='COME')))actions.push([n,'moving']);
}
for(const nav of s.findAll(n=>n.name==='Bottom navigation'))for(const [j,c]of nav.children.entries())actions.push([c,['map','find','family','remote'][j]]);
}
text(root,'Interaction states / review, send, move and pause',40,2073,2500,28,'242424','SemiBold');
return {createdNodeIds:made,mutatedNodeIds:[root.id,...changed],targets:stateTargets,stateActions:actions.map(([n,key])=>({id:n.id,target:key}))};
