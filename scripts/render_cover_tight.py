import bpy
from pathlib import Path
from mathutils import Vector
out=Path(__file__).resolve().parent
bpy.ops.wm.open_mainfile(filepath=str(out/'NEARBY_Warm_Product.blend'))
home=bpy.data.scenes['NEARBY Warm | Sunlit home'];bpy.context.window.scene=home
bpy.ops.scene.new(type='FULL_COPY');cover=bpy.context.scene;cover.name='NEARBY Warm | Cover close view'
cover.camera.location=(1.65,-3.0,1.45)
cover.camera.rotation_euler=(Vector((.24,.0,.62))-cover.camera.location).to_track_quat('-Z','Y').to_euler()
cover.camera.data.ortho_scale=1.43
cover.render.resolution_x=1800;cover.render.resolution_y=1800;cover.render.film_transparent=False;cover.cycles.samples=48
cover.render.filepath=str(out/'assets'/'cover_home_close.png')
bpy.ops.render.render(write_still=True)
bpy.context.window.scene=home
bpy.ops.wm.save_as_mainfile(filepath=str(out/'NEARBY_Warm_Product.blend'))
print('COVER_CLOSE_READY')
