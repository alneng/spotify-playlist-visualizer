from flask import Flask, request, jsonify
import os
from io import StringIO
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from dotenv import load_dotenv
load_dotenv()

FLASK_PORT = os.getenv('FLASK_PORT')

app = Flask(__name__)


@app.route('/api/generateVectors', methods=['POST'])
def generate_vectors():
    # Load the dataset from the request body
    csv = request.data.decode('utf-8')
    request_data = StringIO(csv)
    df_spotify = pd.read_csv(request_data)

    # Selecting relevant columns for PCA and song/artist names
    df_spotify_data = df_spotify.iloc[:, :11]
    song_names = df_spotify.iloc[:, 18]
    artist_names = df_spotify.iloc[:, 19]

    # Handle the key feature (assuming it is in the first 11 columns)
    key = df_spotify_data['key']
    df_spotify_data['key_sin'] = np.sin(2 * np.pi * key / 12)
    df_spotify_data['key_cos'] = np.cos(2 * np.pi * key / 12)

    # Drop unneeded or irrelevant columns
    df_spotify_data.drop(columns=['key'], inplace=True)
    df_spotify_data.drop(columns=['speechiness'], inplace=True)
    df_spotify_data.drop(columns=['acousticness'], inplace=True)
    df_spotify_data.drop(columns=['instrumentalness'], inplace=True)
    df_spotify_data.drop(columns=['liveness'], inplace=True)

    # Reorder the columns according to weight, where original order is as follows:
    # 0            1      2        3    4       5     6      7
    # danceability,energy,loudness,mode,valence,tempo,key_sin,key_cos
    df_spotify_data = df_spotify_data.iloc[:, [3, 6, 7, 5, 4, 1, 0, 2]]

    # Normalize the rest of the data using Z-score normalization
    scaler = StandardScaler()
    normalized_data = scaler.fit_transform(df_spotify_data)

    # Apply PCA to reduce the dimensions (7 original - unencoded key + 2 circular keys) to 3
    pca = PCA(n_components=3)
    reduced_data = pca.fit_transform(normalized_data)

    # Construct the list of dictionaries for output
    data_to_export = []
    for i, vec in enumerate(reduced_data):
        data_point = {
            'vector': vec.tolist(),
            'songName': song_names.iloc[i],
            'artistName': artist_names.iloc[i],
        }
        data_to_export.append(data_point)

    # Return the data as a JSON response
    return jsonify(data_to_export)


if __name__ == '__main__':
    print(f'Flask API running at http://127.0.0.1:{FLASK_PORT}')
    app.run(host="0.0.0.0", debug=False, port=FLASK_PORT)
