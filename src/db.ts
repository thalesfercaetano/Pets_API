import knex, { Knex } from "knex";
import config from "../knexfile";
import dotenv from "dotenv";

dotenv.config();

const environment = process.env.NODE_ENV || "development";
const knexConfig = (config as { [key: string]: Knex.Config })[environment];

if (!knexConfig) {
  throw new Error(`Config do Knex não encontrada para o ambiente "${environment}"`);
}

const db = knex(knexConfig);

export default db;