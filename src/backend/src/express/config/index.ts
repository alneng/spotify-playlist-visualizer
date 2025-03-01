export const NODE_ENV = process.env.NODE_ENV ?? "development";

export const EXPRESS_PORT = process.env.EXPRESS_PORT
  ? Number(process.env.EXPRESS_PORT)
  : 9988;
export const FLASK_PORT = process.env.FLASK_PORT || 9989;

export const FLASK_HOST = NODE_ENV === "production" ? "spv_flask" : "127.0.0.1";

export const CORS_OPTIONS =
  process.env.CORS_OPTIONS ??
  JSON.stringify({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: "GET,POST,OPTIONS",
  });

export const SPOTIFY_CLIENT_KEY = process.env.SPOTIFY_CLIENT_KEY;
