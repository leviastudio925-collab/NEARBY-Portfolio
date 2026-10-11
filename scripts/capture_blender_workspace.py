import bpy
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
scene = bpy.data.scenes['NEARBY Warm | Studio parked']
bpy.context.window.scene = scene
scene.frame_set(100)
for obj in scene.objects:
    obj.select_set(False)
    if obj.type in {'LIGHT', 'CAMERA'} or 'ground' in obj.name.lower():
        obj.hide_set(True)
    elif obj.type == 'MESH':
        obj.color = (0.65, 0.65, 0.65, 1)

for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        space = area.spaces.active
        space.shading.type = 'SOLID'
        space.shading.light = 'STUDIO'
        space.shading.color_type = 'MATERIAL'
        space.shading.show_shadows = True
        space.shading.show_cavity = True
        space.overlay.show_floor = True
        space.overlay.show_extras = False
        space.show_region_ui = False
        space.region_3d.view_location = Vector((0, 0, 0.40))
        space.region_3d.view_distance = 1.75
        space.region_3d.view_rotation = Vector((1.15, -1.8, 1.05)).to_track_quat('Z', 'Y')
        space.region_3d.view_perspective = 'ORTHO'
    elif area.type == 'PROPERTIES':
        area.spaces.active.context = 'MODIFIER'

shell = next(o for o in scene.objects if o.name.startswith('Rounded cabinet shell'))
shell.select_set(True)
bpy.context.view_layer.objects.active = shell

def capture():
    bpy.ops.screen.screenshot(filepath=str(ROOT / 'assets/board05/nearby-blender-workspace.png'))
    print('NEARBY_WORKSPACE_CAPTURED', flush=True)
    bpy.app.timers.register(lambda: bpy.ops.wm.quit_blender() and None, first_interval=2)
    return None

bpy.app.timers.register(capture, first_interval=10)
