# spotify-playlist-visualizer (frontend)

This is the README for the frontend of spotify-playlist-visualizer. The frontend is a Vite React TypeScript app.

## Quickstart

### App Requirements (dev and prod)

- Node.js 18.x
- Yarn - `npm i -g yarn`

### Local Development Setup (dev)

#### Installing Dependencies in `src/frontend` (not recommended, see [README.md](https://github.com/alneng/spotify-playlist-visualizer/blob/main/README.md) at root)

1. Run `yarn install` for Vite/React app dependencies

#### Starting the App

- [From `src/frontend`] Run `yarn dev`
- [From `/` or "root directory"] Run `yarn frontend`

### Build and Serve (prod)

#### Configuration

- `src/frontend/.env.production`

```env
VITE_BACKEND_URL="https://api.your-domain.com"
```

#### Build and Deploy

1. Run `yarn build` to build the app
2. Run `yarn preview` to serve the app on port 4173
