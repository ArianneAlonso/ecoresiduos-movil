from google.genai import types
from images.config.config import client
from images.config.template import prompt_system
import os

def process_image(image_path: str, mime_type: str): 
    """
    Procesa una imagen usando Gemini, devuelve una respuesta de texto única.
    """
    
    if image_path is None: 
        raise ValueError("image_path no fue proporcionado")
    
    if mime_type not in ["image/png", "image/jpeg"]:
         raise ValueError("Tipo de archivo no soportado por el modelo")

    try:
        with open(image_path, "rb") as image_file: 
            image_bytes = image_file.read()

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                prompt_system,
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            ]
        )

        if response.text:
            return response.text
        else:
            raise ValueError("La IA no generó una respuesta de texto.")
            
    except Exception as e:
        print(f"Error llamando a la API de Gemini: {str(e)}")
        raise ValueError(f"Error en la API de IA: {str(e)}")
        
    finally:
        if os.path.exists(image_path):
            os.remove(image_path)