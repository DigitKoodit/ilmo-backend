import express from "express";
import { apiRouter } from "./routes";
import { IlmoServer } from "./types/server";
import { initDatabase } from "./services/database";
import { config } from "dotenv";

/**
 * Connects to the database then starts the server.
 */
const initServer = async () => {
  config();
  const app = express();
  const database = await initDatabase();

  const ilmoServer: IlmoServer = {
    app,
    database,
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
