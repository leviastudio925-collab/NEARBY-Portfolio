from pathlib import Path
from PIL import Image,ImageOps
import pillow_heif,imageio_ffmpeg,subprocess,json
pillow_heif.register_heif_opener()
p=Path('assets/prototype-evidence');out=p/'high-resolution';out.mkdir(exist_ok=True)
src=Path('C:/Users/LEVIAT/Desktop/Enzo 手工作业/Enzo 手工作业/用所选项目新建的文件夹')
ids=['5705','5703','5755','5765','5789','5706','5770','5734','5742','5739'];manifest=[]
for n in ids:
 f=next(src.glob('IMG_'+n+'.*'));im=ImageOps.exif_transpose(Image.open(f)).convert('RGB');dest=out/(f.stem+'.jpg');im.save(dest,quality=95,subsampling=0,optimize=True)
 manifest.append({'key':f.stem,'path':str(dest.resolve()),'width':im.width,'height':im.height,'bytes':dest.stat().st_size})
ff=imageio_ffmpeg.get_ffmpeg_exe()
vids=json.loads((p/'selected-videos.json').read_text(encoding='utf8'))
for n,j in [('5774',1),('5777',1),('5784',1),('5779',1),('5783',2),('5792',1),('5793',1)]:
 r=next(v for v in vids if Path(v['file']).stem=='IMG_'+n);tm=r['duration']*[.15,.5,.85][j];name='IMG_'+n+'-frame'+str(j);dest=out/(name+'.jpg')
 subprocess.run([ff,'-y','-ss',str(tm),'-i',r['file'],'-frames:v','1','-q:v','1',str(dest)],capture_output=True,check=True)
 im=Image.open(dest);manifest.append({'key':name,'path':str(dest.resolve()),'width':im.width,'height':im.height,'bytes':dest.stat().st_size,'time':tm})
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(manifest,ensure_ascii=False))
