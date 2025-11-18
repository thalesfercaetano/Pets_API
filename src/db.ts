import knex from "knex";
import config from "../knexfile";

const env = process.env.NODE_ENV || "development";

const db = knex((config as any)[env]);

export default db;