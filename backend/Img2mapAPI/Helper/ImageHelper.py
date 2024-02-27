from pdf2image import convert_from_path
import tempfile
from PIL import Image


#function to convert a .pdf page to .png
def pdf2png(file, page_number):
    #failsafe checks
    if file.content_type != 'application/pdf':
        raise Exception('File must be a .pdf file')
    if page_number < 0:
        raise Exception('Body content must be at least 1 page')
    if page_number > 100:
        raise Exception('Page number must be less than 100')
    
    with open(file.filename, 'wb') as f:
        f.write(file.read())
    
    #create temporary file to store pdf
    temp_pdf = tempfile.NamedTemporaryFile(delete=False)
    temp_pdf.write(file.read())
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
    return temp_image.name, image_name