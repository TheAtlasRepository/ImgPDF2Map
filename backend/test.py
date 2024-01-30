import requests
from pdf2image import convert_from_path

def pdf2png(pdf_url, image_name):
    response = requests.get(pdf_url)
    with open('temp.pdf', 'wb') as f:
        f.write(response.content)
    images = convert_from_path('temp.pdf')
    images[0].save(image_name, 'png')
    print("Image saved: " + image_name)

pdf2png("blob:http://localhost:3000/a1949917-a5f7-4a5c-bc53-0201c426f9cc", "test.png")