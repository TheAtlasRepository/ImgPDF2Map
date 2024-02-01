# API router for file conversion
import os

from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse

from pdf2image import convert_from_path
import tempfile

from PIL import Image

#from ..modules import converter

router = APIRouter()

#route to convert .pdf to .png image. upload file is required to be a .pdf file optionally with a page number
@router.post('/pdf2png')
async def pdf2png(file: UploadFile = File(...), page_number: int = 1):
    #failsafe checks
    if file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail='File must be a .pdf file')
    if page_number < 0:
        raise HTTPException(status_code=400, detail='Page number must be greater than 0')
    if page_number > 100:
        raise HTTPException(status_code=400, detail='Page number must be less than 100')
    
    #create temporary file to store pdf
    temp_pdf = tempfile.NamedTemporaryFile(delete=False)
    temp_pdf.write(await file.read())
    temp_pdf.close()

    #making the name of the image
    image_name = file.filename[:-4] +'p'+ str(page_number) + '.png'

    #convert pdf to image
    images = convert_from_path(temp_pdf.name)

    #make temporary file to store image
    temp_image = tempfile.NamedTemporaryFile(delete=False)
    images[page_number-1].save(temp_image.name, 'PNG')
    temp_image.close()

    #return image
    return FileResponse(temp_image.name, media_type='image/png', filename=image_name)

#route to convert several image formats to .png
#known good formats: .bmp, .dds, .gif, .ico, .jpe, .jpeg, .jpg, .tiff, .cr2, .dng, .jfif, .nef, .webp
@router.post('/image2png')
async def image2png(file: UploadFile = File(...)):
    #failsafe checks
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail='File must be an image')
    if file.content_type == 'image/png':
        raise HTTPException(status_code=400, detail='File is already a .png file')
    if file.content_type == 'image/svg+xml':
        raise HTTPException(status_code=400, detail='File is an SVG file, which is not supported')
    if file.content_type == 'image/ERF':
        raise HTTPException(status_code=400, detail='File is an ERF file, which is not supported')
    if file.content_type == 'image/NRW':
        raise HTTPException(status_code=400, detail='File is an NRW file, which is not supported')
    if file.content_type == 'image/ORF':
        raise HTTPException(status_code=400, detail='File is an ORF file, which is not supported')
    if file.content_type == 'image/PEF':
        raise HTTPException(status_code=400, detail='File is an PEF file, which is not supported')
    if file.content_type == 'image/RAF':
        raise HTTPException(status_code=400, detail='File is an RAF file, which is not supported')
    if file.content_type == 'image/RW2':
        raise HTTPException(status_code=400, detail='File is an RW2 file, which is not supported')
    
    #create a temporary file to store input image
    temp_image = tempfile.NamedTemporaryFile(delete=False)
    temp_image.write(await file.read())
    temp_image.close()

    #making the name of the image, used for the return
    image_name = os.path.splitext(file.filename)[0] + '.png'

    #convert image to png
    image = Image.open(temp_image.name)
    png_image = image.convert('RGB')

    #create a temporary PNG to store the converted image
    temp_png = tempfile.NamedTemporaryFile(delete=False)
    png_image.save(temp_png.name, 'PNG')
    temp_png.close()

    #return PNG
    return FileResponse(temp_png.name, media_type='image/png', filename=image_name)
