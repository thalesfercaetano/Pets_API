import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
const envPath = path.resolve(__dirname, envFile);
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '1234', 
      database: process.env.DB_NAME || 'PETS_API',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "migrations"),
      tableName: "knex_migrations"
    },
    seeds: {
      directory: path.resolve(__dirname, "src", "database", "seeds"),
    }
  },


  test: {
      client: "pg",
      connection: {
        host: process.env.DB_HOST_TEST || process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT_TEST || process.env.DB_PORT) || 5432,
        user: process.env.DB_USER_TEST || process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD_TEST || process.env.DB_PASSWORD || '1234',
        database: process.env.DB_NAME_TEST || 'PETS_API_TEST',
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        directory: path.resolve(__dirname, "src", "database", "migrations"),
        tableName: "knex_migrations"
      }
    },



  staging: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_NAME || 'PETS_API',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_NAME || 'PETS_API',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};

export default config;