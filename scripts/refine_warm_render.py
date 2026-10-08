import bpy,math,json
from pathlib import Path
from mathutils import Vector
OUT=Path(__file__).resolve().parent
bpy.ops.wm.open_mainfile(filepath=str(OUT/'NEARBY_Warm_Product.blend'))
ink=bpy.data.materials['Base / soft graphite']
for scene in bpy.data.scenes:
    for o in scene.objects:
        if o.type=='FONT' and o.data.body in ('COME','HELP'):
            o.data.materials.clear();o.data.materials.append(ink)
        if o.name.startswith('Concealed wheel') or o.name.startswith('Wheel satin'):o.location.z-=.002
        if o.name.startswith('Studio ground'):o.location.z=-.013
def linear(hexcol):
    v=[int(hexcol[i:i+2],16)/255 for i in (0,2,4)];return [x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in v]
for m in bpy.data.materials:
    if not m.use_nodes:continue
    if m.name.startswith(('Room oak','Chair / warm woven')):
        ns=m.node_tree.nodes;ls=m.node_tree.links;p=ns.get('Principled BSDF');tex=ns.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=150 if m.name.startswith('Chair') else 7;tex.inputs['Detail'].default_value=2
        if m.name.startswith('Room'):
            coord=ns.new('ShaderNodeTexCoord');mapping=ns.new('ShaderNodeMapping');mapping.inputs['Scale'].default_value=(2,38,4);ls.new(coord.outputs['Generated'],mapping.inputs['Vector']);ls.new(mapping.outputs['Vector'],tex.inputs['Vector'])
            ramp=ns.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].position=.2;ramp.color_ramp.elements[0].color=(*linear('AB9377'),1);ramp.color_ramp.elements[1].position=.8;ramp.color_ramp.elements[1].color=(*linear('C8B497'),1);ls.new(tex.outputs['Fac'],ramp.inputs[0]);ls.new(ramp.outputs['Color'],p.inputs['Base Color'])
        bump=ns.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.12;bump.inputs['Distance'].default_value=.0012;ls.new(tex.outputs['Fac'],bump.inputs['Height']);ls.new(bump.outputs['Normal'],p.inputs['Normal'])
home=bpy.data.scenes['NEARBY Warm | Sunlit home'];bpy.context.window.scene=home
house=next(c for c in home.collection.children if c.name.startswith('06 | Warm'))
wall=next(o for o in home.objects if o.name.startswith('Home back wall'));wall.hide_render=True;wallmat=wall.data.materials[0]
def cube(name,loc,dim,m):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=dim;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    for c in list(o.users_collection):c.objects.unlink(o)
    house.objects.link(o);o.data.materials.append(m);return o
cube('Home wall left of open window',(-2.06,1.2,1.3),(1.88,.06,2.6),wallmat)
cube('Home wall right of open window',(1.28,1.2,1.3),(3.44,.06,2.6),wallmat)
cube('Home wall below open window',(-.78,1.2,.25),(.68,.06,.5),wallmat)
cube('Home wall above open window',(-.78,1.2,2.50),(.68,.06,.22),wallmat)
window=next(o for o in home.objects if o.name.startswith('Window outside'));m=window.data.materials[0];ns=m.node_tree.nodes;ls=m.node_tree.links;out=ns.get('Material Output');mix=ns.new('ShaderNodeMixShader');lightpath=ns.new('ShaderNodeLightPath');emit=ns.new('ShaderNodeEmission');emit.inputs['Color'].default_value=(*linear('FBF6EA'),1);emit.inputs['Strength'].default_value=.8;trans=ns.new('ShaderNodeBsdfTransparent');ls.new(lightpath.outputs['Is Shadow Ray'],mix.inputs[0]);ls.new(emit.outputs[0],mix.inputs[1]);ls.new(trans.outputs[0],mix.inputs[2]);ls.new(mix.outputs[0],out.inputs['Surface'])
sun=next(o for o in home.objects if o.name.startswith('Afternoon sun'));sun.rotation_euler=(-.8,-.2,0);sun.data.energy=2;sun.data.angle=.025
for o in home.objects:
    if o.name.startswith('Chair wood leg'):o.location.z=.195
    if o.name.startswith('Sideboard legs'):o.location.z=.055
home.view_settings.exposure=.05
park=bpy.data.scenes['NEARBY Warm | Studio parked'];park.frame_set(100)
bpy.context.window.scene=home;bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'NEARBY_Warm_Product.blend'))
def render(scene,name,w,h,transparent):
    bpy.context.window.scene=scene;scene.cycles.samples=48;scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.film_transparent=transparent;scene.render.filepath=str(OUT/'assets'/name);bpy.ops.render.render(write_still=True)
def camera(scene,loc,target,scale):
    scene.camera.location=loc;scene.camera.rotation_euler=(Vector(target)-scene.camera.location).to_track_quat('-Z','Y').to_euler();scene.camera.data.ortho_scale=scale
camera(park,(1.4,-2.,1.32),(0,0,.41),1.30);render(park,'studio_parked.png',1800,1400,True)
park.frame_set(1);camera(park,(1.4,-2.,1.16),(0,0,.27),1.10);render(park,'studio_follow.png',1800,1400,True)
park.frame_set(100);camera(park,(.7,-1.1,1.4),(0,0,.71),.81);render(park,'tray_detail.png',1800,1400,True)
exp=bpy.data.scenes['NEARBY Warm | Exploded concept'];render(exp,'exploded.png',1800,1400,True)
render(home,'home_hero.png',1800,1800,False)
park.frame_set(100);camera(park,(1.4,-2.,1.32),(0,0,.41),1.30);bpy.context.window.scene=home;bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'NEARBY_Warm_Product.blend'))
print('WARM_MATERIAL_AND_RENDER_REVIEW_READY')
