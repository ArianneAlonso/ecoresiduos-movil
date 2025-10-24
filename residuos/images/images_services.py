from google.genai import types
from images.config.config import client
from images.config.template import prompt_system
def process_image(image_path: str):
    if image_path is None: 
        raise ValueError("image_path must be provided")
    
    with open(image_path, "rb") as image_file: 
        image_bytes = image_file.read() #convertir la imagen a bytes. 

    for chunk in client.models.generate_content_stream(
        model="gemini-2.5-flash",
        contents=[
            prompt_system,
            types.Part.from_bytes(data=image_bytes, mime_type="image/png")
        ]
    ):
        if chunk.text:
            yield(chunk.text)