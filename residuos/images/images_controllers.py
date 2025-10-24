from fastapi import APIRouter, UploadFile, File
from images.images_services import process_image
import os
router = APIRouter()


@router.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    if file.content_type not in ["image/png", "image/jpeg"]:
        return {"error": "Invalid file type. Only PNG and JPEG are allowed."}
    if not os.path.exists("temp_images"):
        os.makedirs("temp_images")
    file_location = f"temp_images/{file.filename}"
    with open(file_location, "wb") as image_file:
        image_file.write(await file.read())

    try:
        response = process_image(file_location)
        return {"result": response}
    except ValueError as ve:
        return {"error": str(ve)}
    
    except Exception as e:
        print(f"Error processing image: {e}")
        return {"error": "An error occurred while processing the image."}