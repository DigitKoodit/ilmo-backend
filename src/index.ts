import express from "express";
import { apiRouter } from "./routes";
import type { IlmoServer } from "./types/server";
import { database } from "./services/database";
import { config } from "dotenv";
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
