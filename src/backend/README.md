# spotify-playlist-visualizer (backend)

This is the README for the backend of spotify-playlist-visualizer. The backend is made up of an Express API and Flask API, and uses Postgres for the database.

## Quickstart

### App Requirements (dev and prod)

- Node.js 18.x
- Yarn - `npm i -g yarn`
- Docker Engine (Docker Desktop, optional but useful)
- A [Spotify web application](https://developer.spotify.com/dashboard) - client id and secret

### Local Development Database and API Setup (dev)

#### Installing Dependencies in `src/backend` (not recommended, see README.md at root)

1. Run `yarn install` for Express/DB dependencies
2. For Flask dependencies, run:
   - Unix/Mac systems: `yarn install-py`
   - Windows systems: `yarn install-py:win`

#### Configuration Setup

1. Create `src/backend/.env` <br>
   NOTE: where SPOTIFY_CLIENT_KEY - <base64 encoded `client_id:client_secret`>

```env
DATABASE_URL="postgresql://postgres:docker@localhost:5432/spv?schema=public"
SPOTIFY_CLIENT_KEY="..."
CORS_OPTIONS='{"origin":["http://localhost:5173","http://localhost:4173"],"credentials":true,"methods":"GET,POST,OPTIONS"}'
EXPRESS_PORT=9988
FLASK_PORT=9989
```

2. Run `docker run --name spotify-playlist-visualizer -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres` to create the docker container for Postgres
3. Run `docker exec -ti spotify-playlist-visualizer psql -U postgres -c "CREATE DATABASE spv;"` to create the database
4. Run `yarn prisma:reset` to apply the migrations to the database and generate the prisma client

#### Starting the API

- [From `src/backend`] Run `yarn dev` (Unix/Mac) or `yarn dev:win` (Windows)
- [From `/` or "root directory"] Run `yarn backend` (Unix/Mac) or `yarn backend:win` (Windows)

or (below instructions apply to from `src/backend`)

- Express app only: `yarn dev:express`
- Flask app only: `dev:flask` (Unix/Mac) or `dev:flask:win` (Windows)

Note that the Flask API does not support hot reloading, meaning when making changes to the Flask API, it must be restarted for changes to take effect.

### Containerized with Docker (prod)

#### Configuration

- `src/backend/.env`

```env
DATABASE_URL="postgresql://postgres:docker@postgres:5432/spv?schema=public"
SPOTIFY_CLIENT_KEY="..."
CORS_OPTIONS='{"origin":["https://your-domain.com"],"credentials":true,"methods":"GET,POST,OPTIONS"}'
EXPRESS_PORT=9988
FLASK_PORT=9989
```

#### Build and Deploy

1. Edit configuration above to `.env`
2. Run `yarn deploy` to build the API and start the containers (Express, Flask, Postgres)
3. Run `yarn prod:init-db` (First time setup only)
4. Run `yarn prisma:migrate:prod` to apply migrations to the database
