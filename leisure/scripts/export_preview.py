from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
output=ROOT/'NEARBY_Leisure_Portfolio_Preview.pdf'
c=canvas.Canvas(str(output),pagesize=(1684,595),pageCompression=1)
c.setTitle('NEARBY - Bring your break with you')
c.setAuthor('NEARBY Portfolio')
for i in range(1,7):
    path=ROOT.parent/'previews'/f'board-{i:02}.png'
    im=Image.open(path)
    assert im.size==(1684,595),(i,im.size)
    c.drawImage(ImageReader(str(path)),0,0,width=1684,height=595)
    c.showPage()
c.save()
reader=PdfReader(str(output))
assert len(reader.pages)==6
assert all(tuple(map(float,p.mediabox[2:]))==(1684.0,595.0) for p in reader.pages)
print('Verified six-page preview PDF:',output)
