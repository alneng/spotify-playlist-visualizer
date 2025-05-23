# spotify-playlist-visualizer

Spotify Playlist Visualizer transforms your Spotify playlists into a dynamic 3D experience, visualizing each song as a vector in space. By analyzing the audio features provided by Spotify, we position each song relative to others, creating a unique visual representation of your music taste.

> [!WARNING]  
> On November 27, 2024, [Spotify made changes to the Spotify Web API](https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api) that deprecated many of their endpoints, including the ability to get a track's audio features.
> As a result, Spotify Playlist Visualizer services will be suspended indefinitely as the app cannot create the visualizations without the track data.

## Quickstart

### App Requirements

- Node.js 18.x
- Python 3.x
- Yarn - `npm i -g yarn`
- Docker Engine (Docker Desktop, optional but useful)
- A [Spotify web application](https://developer.spotify.com/dashboard) - client id and secret

### Pre-development Configuration Setup

#### Installing Dependencies for frontend and backend

- [Unix/Mac] Run `yarn i`
- [Windows] Run `yarn i:win`

#### Configuration for backend

- Follow "Configuration Setup" in [`src/backend/README.md`](https://github.com/alneng/spotify-playlist-visualizer/blob/main/src/backend/README.md)

#### Starting the application

- Have the database running with docker (see backend instructions)
- To run the whole application (React, Express, and Flask): `yarn dev` (Unix/Mac) or `yarn dev:win` (Windows)
- To run the **React app only**: `yarn frontend`
- To run the **Backend only** (Express, Flask): `yarn backend` (Unix/Mac) or `yarn backend:win` (Windows)
