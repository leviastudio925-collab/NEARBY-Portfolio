import bpy, math, json
from pathlib import Path
from mathutils import Vector
OUT=Path(__file__).resolve().parent
(OUT/'assets').mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene;s.name='NEARBY Warm | Studio parked'
s['design_status']='New concept inspired only by the supplied lift-box demo. Following and care interactions are proposed, not verified.'
s['target_dimensions_mm']='560 x 440 tray; parked tray 700 high; compact tray 450 high. Concept dimensions, not validated ergonomics.'
def mat(name,hexcol,metal=0,rough=.4,emit=0):
    rgb=[int(hexcol[i:i+2],16)/255 for i in (0,2,4)];rgb=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
    m=bpy.data.materials.new(name);m.diffuse_color=(*rgb,1);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*rgb,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
    if emit:p.inputs['Emission Color'].default_value=(*rgb,1);p.inputs['Emission Strength'].default_value=emit
    return m
shell=mat('Shell / satin warm porcelain','F2EEE8',.05,.29)
cream=mat('Tray / warm mineral','E8E2D9',.03,.4)
orange=mat('Accent / warm orange','F28A2E',.16,.27)
charcoal=mat('Base / soft graphite','242424',.12,.33)
rubber=mat('Wheel tread / matte rubber','363432',0,.85)
metal=mat('Lift guides / satin aluminum','C5C1BA',.82,.25)
blackglass=mat('Display / black glass','101010',.15,.20)
white=mat('Display lettering / soft white','FCFAF7',0,.4,.18)
wood=mat('Room oak / warm grain','B9A286',0,.6)
floor=mat('Studio / warm grey','E9E6E1',0,.7)
cloth=mat('Chair / warm woven textile','A79E92',0,.85)
def collection(name):
    c=bpy.data.collections.new(name);s.collection.children.link(c);return c
body=collection('01 | Mobile cabinet and storage')
lift=collection('02 | Lift-box principle from demo')
top=collection('03 | Tray and fixed essentials')
control=collection('04 | Clear controls and paired remote')
studio=collection('05 | Studio environment')
def move_col(o,c):
    for old in list(o.users_collection):old.objects.unlink(o)
    c.objects.link(o);return o
def box(name,loc,dim,m,c=body,r=.008):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=move_col(bpy.context.object,c);o.name=name;o.dimensions=dim;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if r:
        b=o.modifiers.new('Manufactured corner radius','BEVEL');b.width=r;b.segments=8;o.modifiers.new('Weighted surface normals','WEIGHTED_NORMAL')
    o.data.materials.append(m);return o
def cylinder(name,loc,radius,depth,m,c=body,rot=(0,0,0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=64,radius=radius,depth=depth,location=loc,rotation=rot);o=move_col(bpy.context.object,c);o.name=name;o.data.materials.append(m)
    b=o.modifiers.new('Rounded rim','BEVEL');b.width=.003;b.segments=4;o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    for p in o.data.polygons:p.use_smooth=True
    return o
def label(name,txt,loc,size=.012,m=charcoal,c=control,flat=False):
    d=bpy.data.curves.new(name,'FONT');d.body=txt;d.size=size;d.extrude=.00015;d.align_x='CENTER';o=bpy.data.objects.new(name,d);c.objects.link(o);o.location=loc;o.rotation_euler=(0,0,0) if flat else (math.pi/2,0,0);o.data.materials.append(m);return o
def animate(o):
    raised=o.location.copy();o.location.z-=.25;o.keyframe_insert('location',frame=1);o.location=raised;o.keyframe_insert('location',frame=100)
    if o.animation_data and o.animation_data.action:
        for slot in o.animation_data.action.slots:pass
    return o
# A compact storage box + elevated horizontal surface stays close to the original demo.
box('Rounded cabinet shell',(0,0,.251),(.535,.414,.355),shell,r=.033)
box('Integrated low bumper',(0,0,.089),(.559,.442,.072),charcoal,r=.028)
box('Soft lower orange accent',(0,-.220,.094),(.345,.006,.009),orange,r=.004)
for z,h in [(.326,.133),(.162,.126)]:
    box('Flush storage drawer',(0,-.208,z),(.445,.012,h),shell,r=.018)
    box('Drawer recessed pull',(0,-.217,z+h/2-.024),(.164,.012,.008),charcoal,r=.004)
label('NEARBY cabinet brand','N E A R B Y',(0,-.224,.403),.013,charcoal)
for x in (-.207,.207):
    for y in (-.145,.145):
        cylinder('Concealed wheel tread',(x,y,.057),.055,.025,rubber,rot=(0,math.pi/2,0))
        cylinder('Wheel satin hub',(x+(.013 if x>0 else -.013),y,.057),.033,.003,metal,rot=(0,math.pi/2,0))
for x in (-.19,.19):
    for y in (-.127,.127):
        box('Fixed guide sleeve',(x,y,.411),(.033,.035,.055),charcoal,lift,.006)
        rail=box('Telescopic aluminum guide',(x,y,.552),(.017,.020,.254),metal,lift,.004)
        rail.scale.z=.06;rail.location.z=.425;rail.keyframe_insert('scale',frame=1);rail.keyframe_insert('location',frame=1)
        rail.scale.z=1;rail.location.z=.552;rail.keyframe_insert('scale',frame=100);rail.keyframe_insert('location',frame=100)
box('Covered lift actuator',(0,.112,.407),(.095,.065,.052),cream,lift,.012)
animate(box('Elevating platform / top target 700 mm',(0,0,.687),(.56,.44,.026),shell,top,.018))
animate(box('Tray non-slip insert',(0,0,.702),(.508,.384,.006),cream,top,.015))
for x in (-.269,.269):animate(box('Rounded tray side retaining rail',(x,0,.722),(.021,.428,.043),shell,top,.010))
for y in (-.209,.209):animate(box('Rounded tray front retaining rail',(0,y,.722),(.539,.021,.043),shell,top,.010))
animate(box('Quiet orange front locator',(0,-.221,.719),(.262,.004,.009),orange,top,.004))
# Same order in compact and raised modes. No automatic detection or dispensing claim.
for name,x,y,dim in [('Glasses',-.145,-.113,(.100,.073)),('Phone',.012,-.107,(.073,.128)),('Water',.165,.043,(.078,.098)),('Tissues',-.173,.080,(.106,.112))]:
    animate(box('Fixed object position / '+name,(x,y,.707),(*dim,.003),shell,top,.011))
    animate(label('Fixed position cue / '+name,name.upper(),(x,y-dim[1]/2-.016,.708),.009,charcoal,top,True))
phone=animate(box('Phone / everyday essential',(.012,-.107,.715),(.061,.116,.008),charcoal,top,.010))
animate(box('Phone screen',(.012,-.107,.720),(.052,.101,.002),blackglass,top,.007))
for x in (-.176,-.120):
    bpy.ops.mesh.primitive_torus_add(major_radius=.023,minor_radius=.0018,major_segments=48,minor_segments=10,location=(x,-.113,.718));o=move_col(bpy.context.object,top);o.name='Glasses frame';o.data.materials.append(charcoal);animate(o)
animate(box('Glasses bridge',(-.148,-.113,.718),(.018,.003,.003),charcoal,top,.001))
for x in (-.176,-.120):animate(box('Glasses temple',(x,-.078,.718),(.003,.060,.003),charcoal,top,.001))
animate(cylinder('Capped water bottle',(.165,.043,.776),.026,.127,shell,top))
animate(cylinder('Water bottle orange cap',(.165,.043,.846),.021,.014,orange,top))
animate(box('Tissue box',(-.173,.080,.741),(.078,.089,.069),shell,top,.010))
animate(box('Tissue opening',(-.173,.080,.777),(.007,.044,.002),charcoal,top,.002))
# Small mounted status display extends the demo's attached-phone idea without copying a robot head.
animate(box('Mounted display stem',(0,.153,.747),(.039,.023,.081),metal,control,.005))
animate(box('Mounted black status display',(0,.145,.817),(.171,.020,.094),blackglass,control,.017))
animate(label('Status / stationary','STAY',(0,.133,.821),.027,white))
animate(label('Status / within reach','Here beside you',(0,.132,.797),.008,white))
for x,word,m in [(-.12,'COME',orange),(0,'STAY',charcoal),(.12,'HELP',orange)]:
    animate(box('Physical '+word+' control',(x,-.219,.669),(.102,.026,.050),m,control,.012))
    animate(label('Physical '+word+' label',word,(x,-.234,.661),.016,white))
remote=box('Paired handheld remote',(.376,-.072,.024),(.078,.139,.020),shell,control,.013)
for word,y,m in [('COME',-.028,orange),('STAY',-.070,charcoal),('HELP',-.112,orange)]:
    box('Remote '+word+' button',(.376,y,.037),(.060,.032,.006),m,control,.006)
    label('Remote '+word+' label',word,(.376,y-.005,.041),.010,white,control,True)
# Lighting and actual editable scene rather than a flattened product image.
box('Studio ground',(0,0,-.017),(200,200,.026),floor,studio,0)
world=bpy.data.worlds.new('Soft studio world');s.world=world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.72,.69,.64,1);world.node_tree.nodes['Background'].inputs[1].default_value=.32
def light(name,loc,power,size,target=(0,0,.4),c=studio):
    d=bpy.data.lights.new(name,'AREA');o=bpy.data.objects.new(name,d);c.objects.link(o);o.location=loc;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();d.energy=power;d.shape='DISK';d.size=size;return o
light('Large left studio softbox',(-2,-3,4),350,3)
light('Right studio edge softbox',(2,.7,2.6),260,2)
light('Front studio fill',(0,-2,1.4),65,2)
d=bpy.data.cameras.new('Product camera');cam=bpy.data.objects.new('Product camera',d);studio.objects.link(cam);s.camera=cam;d.type='ORTHO';d.lens=60
def camera(loc,target,scale):
    s.camera.location=loc;s.camera.rotation_euler=(Vector(target)-s.camera.location).to_track_quat('-Z','Y').to_euler();s.camera.data.ortho_scale=scale
def settings(scene):
    scene.render.engine='CYCLES';scene.cycles.samples=64;scene.cycles.use_denoising=True;scene.render.resolution_x=1800;scene.render.resolution_y=1400;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.view_settings.view_transform='AgX';scene.view_settings.exposure=-.15
def render(scene,name,w=1800,h=1400,transparent=False):
    scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.film_transparent=transparent;scene.render.filepath=str(OUT/'assets'/name);bpy.ops.render.render(write_still=True,scene=scene.name)
settings(s);s.frame_start=1;s.frame_end=100;s.frame_set(100);camera((1.4,-2.0,1.32),(0,0,.41),1.30)
for o in control.objects:
    if o.name.startswith(('Paired handheld','Remote ')):o.hide_render=True
studio.objects['Studio ground'].hide_render=True
render(s,'studio_parked.png',transparent=True)
s.frame_set(1);camera((1.4,-2.0,1.16),(0,0,.27),1.10);render(s,'studio_follow.png',transparent=True)
s.frame_set(100);camera((.7,-1.1,1.4),(0,0,.71),.81);render(s,'tray_detail.png',transparent=True)
camera((1.4,-2.0,1.32),(0,0,.41),1.30)
bpy.ops.scene.new(type='FULL_COPY');exp=bpy.context.scene;exp.name='NEARBY Warm | Exploded concept'
for o in exp.objects:
    if o.type in ('LIGHT','CAMERA') or any('Studio' in c.name for c in o.users_collection):continue
    o.animation_data_clear()
    if any('03 | Tray' in c.name or '04 | Clear' in c.name for c in o.users_collection):o.location.z+=.25
    elif any('02 | Lift' in c.name for c in o.users_collection):o.location.z+=.1
    if o.name.startswith('Flush storage drawer') or o.name.startswith('Drawer recessed'):o.location.y-=.16
    if o.name=='Rounded cabinet shell':o.location.x+=.34
exp.camera.data.ortho_scale=1.75;exp.camera.location=(1.8,-2.5,1.6);exp.camera.rotation_euler=(Vector((.1,0,.51))-exp.camera.location).to_track_quat('-Z','Y').to_euler();settings(exp)
render(exp,'exploded.png',transparent=True)
bpy.context.window.scene=s;bpy.ops.scene.new(type='FULL_COPY');home=bpy.context.scene;home.name='NEARBY Warm | Sunlit home'
for o in home.objects:
    if o.type=='LIGHT':o.hide_render=True
    if o.name=='Studio ground':o.hide_render=False
house=bpy.data.collections.new('06 | Warm domestic environment');home.collection.children.link(house)
wall=mat('Home wall / chalk','F5F0E7',0,.8)
box('Home back wall',(0,1.2,1.25),(6,.06,2.6),wall,house,0)
box('Home left wall',(-1.55,0,1.3),(.06,3.6,2.6),wall,house,0)
for x in (-1.12,-.44):box('Window frame',(x,1.15,1.45),(.025,.037,1.9),shell,house,.002)
box('Window outside',(-.78,1.18,1.45),(.64,.022,1.88),mat('Daylight window','FBF6EA',0,.6,.3),house,.002)
box('Window horizontal bar',(-.78,1.135,1.32),(.68,.04,.025),shell,house,.001)
box('Window sheer curtain',(-1.14,1.1,1.48),(.10,.09,2),shell,house,.006)
# Simple but finished furniture establishes domestic scale without mannequin people.
box('Armchair seat',(.87,.35,.41),(.59,.56,.15),cloth,house,.07)
box('Armchair back',(.87,.64,.72),(.59,.13,.64),cloth,house,.07)
for x in (.55,1.19):
    box('Chair warm wood arm',(x,.34,.64),(.06,.58,.075),wood,house,.025)
    for y in (.14,.58):box('Chair wood leg',(x,y,.20),(.04,.04,.39),wood,house,.01)
box('Chair soft cushion',(.89,.45,.58),(.44,.11,.33),cream,house,.048)
box('Wood sideboard',(.30,.94,.37),(1.6,.36,.59),wood,house,.025)
for x in (-.38,.98):box('Sideboard legs',(x,.94,.065),(.045,.27,.11),wood,house,.008)
box('Wall picture',(.35,1.151,1.6),(.63,.027,.43),wood,house,.008)
box('Wall picture warm canvas',(.35,1.13,1.6),(.58,.006,.38),cream,house,.001)
label('Wall picture abstract line','HOME',(.35,1.119,1.57),.030,wood,house)
# A capped plant and books provide restrained lived-in context.
cylinder('Planter',(.88,.91,.714),.072,.108,cream,house)
for i in range(7):
    angle=i*2.4;loc=(.88+math.cos(angle)*.08,.91+math.sin(angle)*.06,.81+i*.026)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=12,location=loc);o=move_col(bpy.context.object,house);o.name='Plant leaf';o.scale=(.075,.022,.018);o.rotation_euler=(.4,0,angle);o.data.materials.append(mat('Plant olive '+str(i),'606B51',0,.65))
for i in range(3):box('Sideboard familiar book',(-.17+i*.031,.89,.758),(.025,.14,.16),cream if i%2 else charcoal,house,.004)
for o in home.objects:
    if o.name.startswith(('Paired handheld','Remote ')):
        o.hide_render=False;o.location+=Vector((.819,.35,.644))
light('Home large window key',(-2,-2,3.8),260,2.4,target=(.2,.2,.55),c=house)
light('Home warm fill',(2,-1,2.6),140,2,target=(.2,.2,.6),c=house)
sun_data=bpy.data.lights.new('Afternoon sun','SUN');sun_obj=bpy.data.objects.new('Afternoon sun',sun_data);house.objects.link(sun_obj);sun_obj.rotation_euler=(.52,-.45,-.5);sun_data.energy=1.15;sun_data.angle=.035
home.camera.location=(2.8,-4.5,2.0);home.camera.rotation_euler=(Vector((.15,.25,.76))-home.camera.location).to_track_quat('-Z','Y').to_euler();home.camera.data.ortho_scale=2.08;settings(home)
render(home,'home_hero.png',1800,1800,False)
bpy.context.window.scene=s;camera((1.4,-2.0,1.32),(0,0,.41),1.30);s.frame_set(100)
bpy.ops.scene.new(type='FULL_COPY');sk=bpy.context.scene;sk.name='NEARBY Warm | Technical form study'
sk.render.engine='BLENDER_WORKBENCH';sk.display.shading.light='STUDIO';sk.display.shading.color_type='SINGLE';sk.display.shading.single_color=(.86,.86,.86);sk.display.shading.show_shadows=True;sk.display.shading.show_cavity=True;sk.display.shading.cavity_type='BOTH';sk.display.shading.background_type='WORLD';sk.world.color=(1,1,1);sk.camera.data.ortho_scale=1.10
if hasattr(sk.display.shading,'show_object_outline'):sk.display.shading.show_object_outline=True
sk.camera.location=(0,-3,.55);sk.camera.rotation_euler=(Vector((0,0,.43))-sk.camera.location).to_track_quat('-Z','Y').to_euler();render(sk,'form_front.png',1000,1200,True)
sk.camera.location=(3,0,.55);sk.camera.rotation_euler=(Vector((0,0,.43))-sk.camera.location).to_track_quat('-Z','Y').to_euler();render(sk,'form_side.png',1000,1200,True)
sk.camera.location=(1.5,-2.2,1.5);sk.camera.rotation_euler=(Vector((0,0,.43))-sk.camera.location).to_track_quat('-Z','Y').to_euler();sk.camera.data.ortho_scale=1.25;render(sk,'form_perspective.png',1000,1200,True)
bpy.context.window.scene=home
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'NEARBY_Warm_Product.blend'))
result={'scenes':[q.name for q in bpy.data.scenes],'objects':len(s.objects),'renders':sorted(p.name for p in (OUT/'assets').glob('*.png')),'new_design':True,'original_demo_influence':'storage box, rising surface, four guides, mounted screen','clinically_validated':False,'follow_validated':False}
(OUT/'model_manifest.json').write_text(json.dumps(result,indent=2),encoding='utf-8');print(json.dumps(result))
