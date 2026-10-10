import bpy, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'models'/'NEARBY_Leisure_Product.blend'))
park=next(s for s in bpy.data.scenes if 'Studio parked' in s.name)
shell=bpy.data.materials['Shell / satin warm porcelain']
orange=bpy.data.materials['Accent / warm orange']
ink=bpy.data.materials['Base / soft graphite']
metal=next((m for m in bpy.data.materials if 'alumin' in m.name.lower() or 'satin metal' in m.name.lower()),shell)

def cube(scene,name,loc,dims,mat,bevel=.006):
    bpy.context.window.scene=scene
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    o=bpy.context.object;o.name='Transport / '+name;o.dimensions=dims
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    m=o.modifiers.new('Rounded edges','BEVEL');m.width=bevel;m.segments=4
    o.modifiers.new('Normals','WEIGHTED_NORMAL');o.data.materials.append(mat)
    return o

def add_hardware(s,extended=False):
    c=bpy.data.collections.new('Portable transport - proposed mechanics');s.collection.children.link(c)
    def box(name,loc,dims,mat,b=.006):
        o=cube(s,name,loc,dims,mat,b)
        for q in list(o.users_collection):q.objects.unlink(o)
        c.objects.link(o);return o
    for x in [-.132,.132]:
        box('rear pull-handle guide',(x,.237,.25),(.029,.029,.33),ink)
        box('telescopic pull-handle tube',(x,.238,.65 if extended else .398),(.018,.018,.57 if extended else .066),metal)
    box('graspable towing grip',(0,.238,.94 if extended else .437),(.285,.032,.032),ink,.014)
    box('towing grip orange release',(0,.216,.94 if extended else .437),(.052,.010,.010),orange,.004)
    for x in [-.274,.274]:
        box('side carry recess',(x,0,.301),(.018,.15,.077),ink,.015)
        box('side carry grip',(x*1.05,0,.298),(.024,.112,.026),shell,.010)
    for x in [-.231,.231]:
        box('drawer transport latch',(x,-.222,.326),(.028,.018,.032),orange,.006)
        box('tray transport lock tab',(x,-.222,.446),(.029,.017,.025),orange,.005)
    box('manual towing release',( .27,.11,.12),(.018,.055,.028),orange,.005)
    for o in c.objects:o['status']='Proposed transport hardware, strength and drivetrain release untested'

def camera(s,loc,target,scale):
    s.camera.location=loc;s.camera.rotation_euler=(Vector(target)-s.camera.location).to_track_quat('-Z','Y').to_euler();s.camera.data.ortho_scale=scale

def copy_packed(name,extended=False):
    bpy.context.window.scene=park;park.frame_set(1)
    bpy.ops.scene.new(type='FULL_COPY');s=bpy.context.scene;s.name=name;s.frame_set(1)
    for o in s.objects:
        o.animation_data_clear()
        if any(k in o.name for k in ['Tea coaster','Leisure ceramic','Tea surface','Cup handle','Book paper','Book orange','Capped water','Water bottle','Phone /','Phone screen','Mounted display stem','Black display','Here beside','Status title','Status subtitle']):o.hide_render=True
        if o.type=='FONT' and (o.data.body in ['Ready for your break','A familiar place','Here beside you'] or o.location.z>.49):o.hide_render=True
        # Hide upright display assembly; packed screen lies flat in a recessed tray.
        if o.type=='MESH' and o.location.z>.49 and o.name.lower().find('display')>=0:o.hide_render=True
    cube(s,'folded status screen',(0,.115,.464),(.169,.094,.016),ink)
    add_hardware(s,extended)
    s['design_status']='Portable transport proposal: clear tray, secure drawers, lower and lock, disable following, manually tow or two-hand carry. No measured mass or verified vehicle fit.'
    camera(s,(1.45,-2,1.35),(0,0,.48 if extended else .25),1.78 if extended else 1.03)
    return s

packed=copy_packed('NEARBY Portable / Packed and locked')
tow=copy_packed('NEARBY Portable / Manual tow handle extended',True)
detail=copy_packed('NEARBY Portable / Carry and locking details')
camera(detail,(1.20,-1.8,1.4),(0,0,.33),.88)
cargo=copy_packed('NEARBY Portable / Generic car boot simulation')
# Generic luggage compartment, intentionally not associated with a real vehicle.
cube(cargo,'simulated cargo floor',(0,.09,-.023),(1.10,.89,.045),ink,.025)
cube(cargo,'simulated cargo side left',(-.54,.10,.20),(.045,.85,.44),shell,.018)
cube(cargo,'simulated cargo side right',(.54,.10,.20),(.045,.85,.44),shell,.018)
cube(cargo,'simulated cargo back',(0,.51,.21),(1.10,.045,.46),shell,.018)
cube(cargo,'simulated loading sill',(0,-.36,.025),(1.10,.055,.08),ink,.012)
camera(cargo,(1.9,-2.5,2.1),(0,.10,.22),1.67)

def render(s,name,w=1400,h=1100):
    bpy.context.window.scene=s;s.render.engine='CYCLES';s.cycles.samples=28;s.cycles.use_denoising=True
    s.render.resolution_x=w;s.render.resolution_y=h;s.render.resolution_percentage=100
    s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.filepath=str(ROOT/'assets'/name)
    bpy.ops.render.render(write_still=True)

# Scene-based geometry bounds exclude the studio, camera, lights and off-board remote.
points=[]
for o in packed.objects:
    if o.type=='MESH' and not o.hide_render and ('Transport /' in o.name or any(k in o.name for k in ['cabinet','bumper','drawer','platform','Tray','tray','wheel','Wheel','guide','Physical','control','handle','lift','Elevating'])):
        points += [o.matrix_world@Vector(v) for v in o.bound_box]
lo=[min(v[i] for v in points) for i in range(3)];hi=[max(v[i] for v in points) for i in range(3)]
envelope=[round((hi[i]-lo[i])*1000) for i in range(3)]
bpy.context.window.scene=packed;bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'models'/'NEARBY_Leisure_Portable_Product.blend'))
for s,f in [(packed,'portable_packed.png'),(tow,'portable_tow.png'),(detail,'portable_details.png'),(cargo,'portable_car_boot.png')]:render(s,f)
(ROOT/'models'/'portable_model_manifest.json').write_text(json.dumps({'theme':'Following tea table plus suitcase-like manual transport','scenes':[s.name for s in [packed,tow,detail,cargo]],'mode_sequence':['Leisure','Park','Clear tray and secure drawers','Lower and mechanically lock','Disable follow drive','Extend handle and manually tow','Two-hand lift into car','Unpack at destination'],'packed_model_bounds_mm_xyz':envelope,'dimension_status':'Virtual model estimate only; no measured mass, transport loading strength or vehicle compatibility','new_hardware_status':'Concept proposal, not demonstrated in original prototype'},indent=2),encoding='utf-8')
print('PORTABLE_MODEL_READY',envelope)
