import bpy, math, json
from pathlib import Path
from mathutils import Vector
OUT=Path(__file__).resolve().parents[1]
(OUT/'assets').mkdir(exist_ok=True)
BASE=OUT.parent/'models'/'NEARBY_Warm_Product.blend'
bpy.ops.wm.open_mainfile(filepath=str(BASE))
for scene in bpy.data.scenes:
    scene.name=scene.name.replace('NEARBY Warm','NEARBY Leisure')
    scene['design_status']='Leisure tea-table concept for young adults. Original lift-box geometry retained. User-following confirmed by creator; recognition-board validation and motion integration remain to be measured.'
    scene['control_states']='FOLLOW / STAY / HEIGHT; lift after stopping. Mapping and presets are proposed.'
for o in bpy.data.objects:
    if o.type=='FONT':
        if o.data.body=='COME':o.data.body='FOLLOW';o.data.size*=.8
        if o.data.body=='HELP':o.data.body='HEIGHT';o.data.size*=.8
        if o.data.body=='Here beside you':o.data.body='Ready for your break'
        if o.data.body in ('GLASSES','TISSUES'):o.hide_render=True
    if o.name.startswith(('Glasses frame','Glasses bridge','Glasses temple','Tissue box','Tissue opening','Fixed object position / Glasses','Fixed object position / Tissues')):
        o.hide_render=True
    if 'Telescopic aluminum guide' in o.name:
        o['note']='Visual actuator/guide envelope, not an A2 manufacturing drawing.'
shell=bpy.data.materials['Shell / satin warm porcelain']
cream=bpy.data.materials['Tray / warm mineral']
orange=bpy.data.materials['Accent / warm orange']
ink=bpy.data.materials['Base / soft graphite']
def material(name,color):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    shader=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
    if shader is None:shader=m.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
    shader.inputs['Base Color'].default_value=(*color,1)
    shader.inputs['Roughness'].default_value=.4
    return m
tea=material('Tea / warm amber',(.22,.085,.016))
paper=material('Book / warm paper',(.73,.67,.55))
def add_collection(scene):
    c=bpy.data.collections.new('Leisure / tea and reading');scene.collection.children.link(c);return c
def tocol(o,c):
    for q in list(o.users_collection):q.objects.unlink(o)
    c.objects.link(o)
def animate(o,dz):
    final=o.location.copy();o.location.z-=dz;o.keyframe_insert('location',frame=1);o.location=final;o.keyframe_insert('location',frame=100)
def cube(name,loc,dims,mat,c,dz):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;tocol(o,c);o.dimensions=dims
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    b=o.modifiers.new('Soft edges','BEVEL');b.width=.005;b.segments=4;o.modifiers.new('Surface normals','WEIGHTED_NORMAL');o.data.materials.append(mat);animate(o,dz);return o
def cyl(name,loc,r,h,mat,c,dz):
    bpy.ops.mesh.primitive_cylinder_add(vertices=64,radius=r,depth=h,location=loc);o=bpy.context.object;o.name=name;tocol(o,c);o.data.materials.append(mat)
    b=o.modifiers.new('Soft rim','BEVEL');b.width=.0015;b.segments=4
    for p in o.data.polygons:p.use_smooth=True
    animate(o,dz);return o
for scene in list(bpy.data.scenes):
    if 'Technical form' in scene.name:continue
    bpy.context.window.scene=scene;c=add_collection(scene);dz=.25
    z=.708 + (.25 if 'Exploded' in scene.name else 0)
    cyl('Tea coaster',(-.152,-.110,z+.003),.045,.005,orange,c,dz)
    # Open ceramic cup shell, with visible interior.
    seg=64;verts=[];faces=[]
    rings=[(.030,z+.007),(.033,z+.075),(.028,z+.075),(.026,z+.016)]
    for r,zz in rings:
        verts.extend([(-.152+r*math.cos(i*2*math.pi/seg),-.110+r*math.sin(i*2*math.pi/seg),zz) for i in range(seg)])
    for k in range(3):
        for i in range(seg):faces.append((k*seg+i,k*seg+(i+1)%seg,(k+1)*seg+(i+1)%seg,(k+1)*seg+i))
    mesh=bpy.data.meshes.new('Cup shell mesh');mesh.from_pydata(verts,[],faces);mesh.update()
    cup=bpy.data.objects.new('Leisure ceramic tea cup',mesh);c.objects.link(cup);cup.data.materials.append(shell)
    for p in mesh.polygons:p.use_smooth=True
    animate(cup,dz)
    cyl('Tea surface',(-.152,-.110,z+.055),.0265,.001,tea,c,dz)
    bpy.ops.mesh.primitive_torus_add(major_radius=.024,minor_radius=.004,major_segments=40,minor_segments=12,location=(-.110,-.110,z+.040),rotation=(math.pi/2,0,0))
    handle=bpy.context.object;handle.name='Cup handle';tocol(handle,c);handle.data.materials.append(shell);animate(handle,dz)
    cube('Book paper block',(-.150,.084,z+.015),(.111,.142,.023),paper,c,dz)
    cube('Book orange cover',(-.150,.084,z+.030),(.117,.148,.003),orange,c,dz)
park=next(s for s in bpy.data.scenes if 'Studio parked' in s.name)
def camera(scene,loc,target,scale):
    scene.camera.location=loc;scene.camera.rotation_euler=(Vector(target)-scene.camera.location).to_track_quat('-Z','Y').to_euler();scene.camera.data.ortho_scale=scale
def render(scene,name,w=1600,h=1280,transparent=True):
    bpy.context.window.scene=scene;scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=True
    scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.resolution_percentage=100;scene.render.film_transparent=transparent;scene.render.image_settings.file_format='PNG';scene.render.filepath=str(OUT/'assets'/name)
    bpy.ops.render.render(write_still=True)
park.frame_set(100);camera(park,(1.4,-2,1.32),(0,0,.41),1.30)
bpy.context.window.scene=park;bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'models'/'NEARBY_Leisure_Product.blend'))
render(park,'leisure_parked.png')
park.frame_set(1);camera(park,(1.4,-2,1.16),(0,0,.27),1.10);render(park,'leisure_follow.png')
park.frame_set(100);camera(park,(.7,-1.1,1.4),(0,0,.71),.81);render(park,'leisure_tray.png')
exp=next(s for s in bpy.data.scenes if 'Exploded' in s.name);render(exp,'leisure_exploded.png')
home=next(s for s in bpy.data.scenes if 'Sunlit home' in s.name);home.frame_set(100);render(home,'leisure_home.png',1600,1600,False)
park.frame_set(100);camera(park,(1.4,-2,1.32),(0,0,.41),1.30);bpy.context.window.scene=park;bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'models'/'NEARBY_Leisure_Product.blend'))
(OUT/'model_manifest.json').write_text(json.dumps({'theme':'Young adult leisure tea table','scenes':[s.name for s in bpy.data.scenes],'controls':['FOLLOW','STAY','HEIGHT'],'geometry_basis':'Original mobile cabinet and four-point adjustable surface','tea_motion_validation':'Not measured','dimensions_status':'Concept dimensions inherited from previous model'},indent=2),encoding='utf-8')
print('LEISURE_MODEL_READY')
