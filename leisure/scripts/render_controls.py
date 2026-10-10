import bpy
from pathlib import Path
from mathutils import Vector
OUT=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(OUT/'models'/'NEARBY_Leisure_Product.blend'))
s=next(s for s in bpy.data.scenes if 'Studio parked' in s.name)
bpy.context.window.scene=s
s.frame_set(100)
s.camera.location=(.1,-1.6,.82)
s.camera.rotation_euler=(Vector((0,-.235,.67))-s.camera.location).to_track_quat('-Z','Y').to_euler()
s.camera.data.ortho_scale=.5
s.render.engine='CYCLES';s.cycles.samples=32;s.cycles.use_denoising=True
s.render.resolution_x=1540;s.render.resolution_y=320;s.render.resolution_percentage=100;s.render.film_transparent=True
s.render.image_settings.file_format='PNG';s.render.filepath=str(OUT/'assets'/'leisure_controls.png')
bpy.ops.render.render(write_still=True)
