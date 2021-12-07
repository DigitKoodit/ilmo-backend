import { Application } from "express";

export type IlmoServer = {
  app: Application;
  database: any;
};
