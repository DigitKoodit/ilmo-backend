import express from "express";
import { apiRouter } from "./routes";
import type { IlmoServer } from "./types/server";
import { database } from "./services/database";
import { config } from "dotenv";
import cors from "cors";
config();

/**
 * Connects to the database then starts the server.
 */
const initServer = async () => {
  const app = express();
  const dbInstance = await database.init();

  const ilmoServer: IlmoServer = {
    app,
    database: dbInstance,
  };

  // TODO: config CORS more strictly
  app.use(cors());
  app.use(express.json());

  // attach routers
  app.use("/api", apiRouter);

  return ilmoServer;
};

// start server
initServer().then((server) => {
  server.app.listen(process.env.PORT, () => {
    console.log("listening to port", process.env.PORT);
  });
});
