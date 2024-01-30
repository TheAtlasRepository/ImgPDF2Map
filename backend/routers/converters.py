# API router for file conversion

from fastapi import APIRouter, File, UploadFile, Depends, HTTPException

from ..modules import converter

router = APIRouter()

# Router path for file conversion

# This route takes a blob encoded as pdf and returns a png image, additionally takes a perameter on a specific page to convert
# The function responsible for this is pdf2png in modules/converter.py
@router.post("/pdf2png")
async def convert_pdf2png(file: UploadFile = File(...), page: int = 0):
    try:
        return converter.pdf2png(file, page)
    except:
        raise HTTPException(status_code=500, detail="Error converting file")    