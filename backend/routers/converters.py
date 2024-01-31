# API router for file conversion

from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse

from pdf2image import convert_from_path
import tempfile

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


