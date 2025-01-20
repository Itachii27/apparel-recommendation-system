import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import pairwise_distances
from typing import List, Dict
from utils.config import Config
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

# Set up the vectorizer and fit the model
tfidf_title_vectorizer = TfidfVectorizer(min_df = 0.0)
tfidf_title_features = tfidf_title_vectorizer.fit_transform(data['title'])

# Function to calculate the tf-idf model and return closest matches
def tfidf_model(input_text: str, num_results: int) -> List[Dict]:

    # Transform the input text to the same TF-IDF feature space
    query_vec = tfidf_title_vectorizer.transform([input_text])

    pairwise_dist = pairwise_distances(tfidf_title_features, query_vec)

    # np.argsort will return indices of 9 smallest distances
    indices = np.argsort(pairwise_dist.flatten())[0:num_results]

    #data frame indices of the 9 smallest distace's
    df_indices = list(data.index[indices])

    results = []
    for i in range(0,len(indices)):
        result = {
            'asin': data['asin'].loc[df_indices[i]],
            'brand': data['brand'].loc[df_indices[i]],
            'title': data['title'].loc[df_indices[i]],
            'url': data['medium_image_url'].loc[df_indices[i]]
        }
        results.append(result)

    return results