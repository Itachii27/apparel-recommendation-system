import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import pairwise_distances
from sklearn.feature_extraction.text import CountVectorizer
from typing import List, Dict
import os

from utils.config import Config

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

# Set up the vectorizer and fit the model
title_vectorizer = CountVectorizer()
title_features = title_vectorizer.fit_transform(data['title'])

# Function to calculate the bag-of-words model and return closest matches
def bag_of_words_model(query: str, num_results: int) -> List[Dict]:
    # Transform the input query to the same feature space
    query_vec = title_vectorizer.transform([query])
    
    # Calculate pairwise distances between the query and all items in the corpus
    pairwise_dist = pairwise_distances(title_features, query_vec, metric='cosine')
    
    # Get the indices of the closest matches
    indices = np.argsort(pairwise_dist.flatten())[0:num_results]
    
    results = []
    for idx in indices:
        result = {
            'asin': data['asin'].iloc[idx],
            'brand': data['brand'].iloc[idx],
            'title': data['title'].iloc[idx],
            'url': data['medium_image_url'].iloc[idx],
        }
        results.append(result)
    
    return results
