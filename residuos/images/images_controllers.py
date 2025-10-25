from fastapi import APIRouter, UploadFile, File, HTTPException
from images.images_services import process_image
import os

router = APIRouter()

@router.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    
    if file.content_type not in ["image/png", "image/jpeg"]:
        raise HTTPException(status_code=400, detail="Tipo de archivo inválido. Solo se permite PNG o JPEG.")

    if not os.path.exists("temp_images"):
        os.makedirs("temp_images")
        
    file_location = f"temp_images/{file.filename}"
    try:
        with open(file_location, "wb") as image_file:
            image_file.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No se pudo guardar el archivo: {str(e)}")
    try:
        response_text = process_image(file_location, file.content_type)
        return {"result": response_text}
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    
    except Exception as e:
        print(f"Error procesando imagen: {e}")
        raise HTTPException(status_code=500, detail="Error interno al procesar la imagen.")