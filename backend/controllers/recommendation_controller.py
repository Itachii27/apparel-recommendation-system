import asyncio
from fastapi.responses import PlainTextResponse
from fastapi_router_controller import Controller
from fastapi import APIRouter, File, UploadFile, HTTPException
from utils.BagOfWords import bag_of_words_model
from utils.cnn import extract_features_from_image, get_similar_products_cnn
from utils.logger import Logger
from utils.tfidf import tfidf_model
import shutil
import os

logger = Logger.get_logger(__name__)

router = APIRouter(prefix='/v1')
controller = Controller(router, openapi_tag={
    'name': 'Recommendation System',
})


@controller.use()
@controller.resource()
class RecommendationController():
    def __init__(self):
        pass
    @controller.route.get(
        '/recommend/bog',
        tags=['recommend-apparel'],
        summary='Recommends the apparel')
    async def recommend(self, input: str):
        try:
            if not input:
                logger.error('Input is required.')
                raise HTTPException(
                    status_code=500, detail='Input is required.')

            results = bag_of_words_model(input, 5)
            return {"results": results}
        except asyncio.CancelledError:
            logger.error(
                'Canceling network request due to disconnect in client.')
        except Exception as error:
            logger.error('Error {}'.format(error))

    @controller.route.get(
        '/recommend/tfidf',
        tags=['recommend-apparel'],
        summary='Recommends the apparel')
    async def recommend(self, input: str):
        try:
            if not input:
                logger.error('Input is required.')
                raise HTTPException(
                    status_code=500, detail='Input is required.')

            results = tfidf_model(input, 5)
            return {"results": results}
        except asyncio.CancelledError:
            logger.error(
                'Canceling network request due to disconnect in client.')
        except Exception as error:
            logger.error('Error {}'.format(error))

    @controller.route.post(
        '/recommend/cnn',
        tags=['recommend-apparel'],
        summary='Recommends the apparel')
    async def recommend(self, file: UploadFile = File(...)):
        try:
            UPLOAD_FOLDER = 'uploads/'
            # Save the uploaded file
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Process the uploaded image
            with open(file_path, "rb") as img_file:
                image_bytes = img_file.read()

            # Log image size for debugging
            if len(image_bytes) == 0:
                raise HTTPException(status_code=400, detail="Uploaded image is empty.")
            else:
                print(f"Image size: {len(image_bytes)} bytes")

            # Extract features from the image
            image_features = extract_features_from_image(image_bytes)

            results = get_similar_products_cnn(image_features, 5)
            return {"results": results}
        except asyncio.CancelledError:
            logger.error(
                'Canceling network request due to disconnect in client.')
        except Exception as error:
            logger.error('Error {}'.format(error))
    
    @controller.route.get(
        '/deleteUpload')
    async def recommend(self, password: str):
        try:
            if not password:
                logger.error('Password is required.')
                raise HTTPException(
                    status_code=500, detail='Password is required.')

            if password != "1328":
                return {"results": "Unauthorized: Incorrect password"}

            UPLOAD_FOLDER = 'uploads/'
            # Check if the uploads folder exists
            if not os.path.exists(UPLOAD_FOLDER):
                raise HTTPException(status_code=404, detail="Uploads folder does not exist")
            # List all files in the uploads folder
            files = os.listdir(UPLOAD_FOLDER)
            if not files:
                return {"results": "No files to delete"}
             # Delete all files in the uploads folder
            for file in files:
                file_path = os.path.join(UPLOAD_FOLDER, file)
                try:
                    # Check if it is a file before trying to delete it
                    if os.path.isfile(file_path):
                        os.remove(file_path)
                        print(f"Deleted: {file_path}")
                    else:
                        print(f"Skipping directory: {file_path}")
                except Exception as e:
                    print(f"Error deleting file {file_path}: {str(e)}")

            return {"results": "All files have been deleted successfully."}
        except asyncio.CancelledError:
            logger.error(
                'Canceling network request due to disconnect in client.')
        except Exception as error:
            logger.error('Error {}'.format(error))

    @controller.route.get(
        '/readLogs')
    async def readLogs(self):
        try:
            # Check if the log file exists
            LOG_FILE_PATH = 'logs.log'
            if not os.path.exists(LOG_FILE_PATH):
                raise HTTPException(status_code=404, detail="Log file not found")
    
            # Read the log file content
            try:
                with open(LOG_FILE_PATH, 'r') as log_file:
                    logs_content = log_file.read()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error reading log file: {str(e)}")

            # Return the log content as plain text
            return PlainTextResponse(content=logs_content)
        except asyncio.CancelledError:
            logger.error(
                'Canceling network request due to disconnect in client.')
        except Exception as error:
            logger.error('Error {}'.format(error))
