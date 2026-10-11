import bpy
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'board05'
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT / 'models' / 'NEARBY_Warm_Product.blend'))
scene = bpy.data.scenes['NEARBY Warm | Studio parked']
bpy.context.window.scene = scene
scene.frame_set(100)
scene.render.engine = 'CYCLES'
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.resolution_x = 720
scene.render.resolution_y = 540
scene.render.resolution_percentage = 100
original_visibility = {o.name: o.hide_render for o in scene.objects}

def render(name, predicate, camera, target, scale):
    for o in scene.objects:
        if o.type not in ('LIGHT', 'CAMERA'):
            o.hide_render = not predicate(o)
    scene.camera.location = camera
    scene.camera.rotation_euler = (Vector(target)-scene.camera.location).to_track_quat('-Z','Y').to_euler()
    scene.camera.data.type = 'ORTHO'
    scene.camera.data.ortho_scale = scale
    scene.render.filepath = str(OUT / (name + '.png'))
    bpy.ops.render.render(write_still=True)

render('tray-assembly', lambda o: any(c.name.startswith(('03 |', '04 |')) for c in o.users_collection) and not o.name.startswith(('Paired handheld', 'Remote ')), (.8,-1.2,1.6), (0,0,.75), .79)
render('four-lift-posts', lambda o: o.name.startswith(('Fixed guide sleeve', 'Telescopic aluminum guide')), (1.2,-1.7,1.05), (0,0,.53), .65)
render('wheel-base', lambda o: o.name.startswith(('Integrated low bumper', 'Soft lower orange accent', 'Concealed wheel tread', 'Wheel satin hub')), (.8,-1.2,.8), (0,0,.075), .72)
render('direct-controls', lambda o: o.name.startswith(('Physical ', 'Quiet orange front locator')), (.25,-1,.95), (0,-.215,.69), .52)
print('BOARD05_DETAIL_RENDERS_COMPLETE')
