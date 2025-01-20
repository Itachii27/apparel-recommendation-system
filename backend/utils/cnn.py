import numpy as np
from sklearn.metrics.pairwise import pairwise_distances
from typing import List, Dict
from utils.config import Config
from PIL import Image
import pandas as pd
import tensorflow as tf
import io
import os

# Load the dataset (replace with the actual path to your dataset)
dataset_path = Config.read('app', 'dataset')

# Ensure the dataset exists
if not os.path.exists(dataset_path):
    raise FileNotFoundError(f"The dataset file at {dataset_path} was not found.")

# Load the dataset
data = pd.read_pickle(dataset_path)

# Ensure the dataset has the necessary columns: 'asin', 'title', 'brand', 'medium_image_url'
required_columns = ['asin', 'title', 'brand', 'medium_image_url']
for col in required_columns:
    if col not in data.columns:
        raise ValueError(f"Missing required column: {col} in the dataset")

# Load the pre-trained CNN features and corresponding ASINs
bottleneck_features_train = np.load(Config.read('app', 'cnnmodel'))
bottleneck_features_train = bottleneck_features_train.astype(np.float64)
asins = np.load(Config.read('app', 'cssasins'))
asins = list(asins)


# Helper function to extract features from the uploaded image using a pre-trained model
def extract_features_from_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)

    # Load the VGG16 model for feature extraction
    model = tf.keras.applications.VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    features = model.predict(image_array)
    features = features.flatten()

    return features

# Function to get similar products based on CNN features
def get_similar_products_cnn(image_features, num_results: int) -> List[Dict]:

    pairwise_dist = pairwise_distances(bottleneck_features_train, image_features.reshape(1, -1))

    # Get the indices of the closest products
    indices = np.argsort(pairwise_dist.flatten())[0:num_results]

    results = []
    for i in range(len(indices)):
        # Get the product details for each closest match
        product_details = data[['asin', 'brand', 'title', 'medium_image_url']].loc[data['asin'] == asins[indices[i]]]
        for indx, row in product_details.iterrows():
            result = {
                'asin': row['asin'],
                'brand': row['brand'],
                'title': row['title'],
                'url': row['medium_image_url']
            }
            results.append(result)

    return results

