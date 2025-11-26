import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Tabela para armazenar os swipes (likes/passes)
  await knex.schema.createTable("SWIPES", (table) => {
    table.increments("id").primary();
    table.integer("usuario_id").references("id").inTable("USUARIOS");
    table.integer("instituicao_id").references("id").inTable("INSTITUICOES");
    table.integer("pet_id").references("id").inTable("PETS");
    table.string("tipo", 10).notNullable();
    table.timestamp("data_swipe").defaultTo(knex.fn.now());
    table.index(["usuario_id", "pet_id"]);
    table.index(["instituicao_id", "pet_id"]);
  });

  // Tabela para armazenar os matches (quando há like mútuo)
  await knex.schema.createTable("MATCHES", (table) => {
    table.increments("id").primary();
    table.integer("usuario_id").notNullable().references("id").inTable("USUARIOS");
    table.integer("instituicao_id").notNullable().references("id").inTable("INSTITUICOES");
    table.integer("pet_id").notNullable().references("id").inTable("PETS");
    table.string("status", 20).defaultTo("ativo").notNullable();
    table.timestamp("data_match").defaultTo(knex.fn.now());
    table.timestamp("ultima_interacao").defaultTo(knex.fn.now());
    table.index(["usuario_id"]);
    table.index(["instituicao_id"]);
    table.index(["pet_id"]);
    table.unique(["usuario_id", "pet_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("MATCHES");
  await knex.schema.dropTableIfExists("SWIPES");
}