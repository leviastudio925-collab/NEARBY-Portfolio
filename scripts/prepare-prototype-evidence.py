from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
import pillow_heif, imageio_ffmpeg, subprocess, re,json
pillow_heif.register_heif_opener()
src=Path('C:/Users/LEVIAT/Desktop/Enzo 手工作业/Enzo 手工作业/用所选项目新建的文件夹')
out=Path('assets/prototype-evidence');out.mkdir(parents=True,exist_ok=True)
photos=[]
for f in sorted(src.iterdir()):
 if f.suffix.lower() in ['.heic','.jpg']:
  im=ImageOps.exif_transpose(Image.open(f)).convert('RGB');im.thumbnail((1600,1600)); im.save(out/(f.stem+'.jpg'),quality=90)
  photos.append((f.stem,im.copy()))
def sheet(items,path,cols=7):
 canvas=Image.new('RGB',(cols*200,((len(items)+cols-1)//cols)*280),'#eeeeee');d=ImageDraw.Draw(canvas)
 for i,(name,im) in enumerate(items):
  im=im.copy();im.thumbnail((192,248));x=(i%cols)*200;y=(i//cols)*280;canvas.paste(im,(x+(200-im.width)//2,y));d.text((x+8,y+252),name,fill='black')
 canvas.save(path)
sheet(photos,out/'photo-contact.jpg')
ff=imageio_ffmpeg.get_ffmpeg_exe();records=[];viditems=[]
for f in sorted(src.with_name(src.name+'video').glob('*.MOV')):
 p=subprocess.run([ff,'-i',str(f)],capture_output=True,text=True,encoding='utf8',errors='replace');m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',p.stderr)
 if not m:continue
 duration=int(m[1])*3600+int(m[2])*60+float(m[3]);records.append({'file':str(f),'duration':duration})
 for j,frac in enumerate([.15,.5,.85]):
  dest=out/(f.stem+'-frame'+str(j)+'.jpg')
  subprocess.run([ff,'-y','-ss',str(duration*frac),'-i',str(f),'-frames:v','1','-vf','scale=640:-2','-q:v','3',str(dest)],capture_output=True)
  if dest.exists():viditems.append((f.stem+' '+str(round(duration*frac,1))+'s',Image.open(dest)))
sheet(viditems,out/'video-contact.jpg',6)
(out/'media-manifest.json').write_text(json.dumps(records,indent=2),encoding='utf8')
print(json.dumps({'photos':len(photos),'videos':records,'ffmpeg':ff},ensure_ascii=False))
