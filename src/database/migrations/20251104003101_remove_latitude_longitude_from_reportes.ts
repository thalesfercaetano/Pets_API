import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex("REPORTES_RESGATE")
    .whereNull("descricao_local")
    .update({ descricao_local: "Localização não informada" });
  
  await knex.schema.table("REPORTES_RESGATE", (table) => {
    table.dropColumn("latitude");
    table.dropColumn("longitude");
  });
  
  await knex.raw('ALTER TABLE "REPORTES_RESGATE" ALTER COLUMN "descricao_local" SET NOT NULL');
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("REPORTES_RESGATE", (table) => {
    table.decimal("latitude", 10, 8).notNullable();
    table.decimal("longitude", 11, 8).notNullable();
  });
  
  await knex.raw('ALTER TABLE "REPORTES_RESGATE" ALTER COLUMN "descricao_local" DROP NOT NULL');
}

