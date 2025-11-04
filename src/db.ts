// Este arquivo é responsável por conectar nossa aplicação com o banco de dados
// Ele lê as configurações e cria a conexão que será usada em todo o projeto

import knex from "knex";
import config from "../knexfile";
import dotenv from "dotenv";

dotenv.config();

const environment = process.env.NODE_ENV || "development";

const knexConfig = config[environment];

if (!knexConfig) {
  throw new Error(`Config do Knex não encontrada para o ambiente "${environment}"`);
}

const db = knex(knexConfig);

export default db;