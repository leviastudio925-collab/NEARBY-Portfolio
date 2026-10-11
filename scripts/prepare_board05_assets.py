from pathlib import Path
from PIL import Image, ImageChops
import json, base64
root = Path(__file__).resolve().parents[1]
out = root / 'assets' / 'board05'
files = {'exploded':root/'assets/exploded.png', 'hero':root/'assets/studio_parked.png', 'tray':out/'tray-assembly.png', 'lift':out/'four-lift-posts.png', 'base':out/'wheel-base.png', 'controls':out/'direct-controls.png', 'stm32':out/'stm32-reference.jpg', 'actuator':root/'assets/tech_electric_actuator.png'}
result = {}
for name, path in files.items():
    im = Image.open(path).convert('RGBA')
    if im.getchannel('A').getextrema()[0] < 255:
        bbox = im.getchannel('A').getbbox()
    else:
        diff = ImageChops.difference(im.convert('RGB'), Image.new('RGB', im.size, 'white')).convert('L')
        bbox = diff.point(lambda x:255 if x>24 else 0).getbbox()
    if bbox: im = im.crop(bbox)
    im.thumbnail((580,760) if name in ('exploded','hero') else (280,230), Image.Resampling.LANCZOS)
    im = im.quantize(colors=128)
    target = out / (name+'-layout.png')
    im.save(target, optimize=True)
    result[name] = {'width':im.width, 'height':im.height, 'base64':base64.b64encode(target.read_bytes()).decode()}
(out/'transfer.json').write_text(json.dumps(result))
print(json.dumps({n:{'width':v['width'],'height':v['height'],'bytes':len(v['base64'])} for n,v in result.items()}))
