import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("ENDERECOS", (table) => {
    table.increments("id").primary();
    table.string("rua", 255).notNullable();
    table.string("numero", 20);
    table.string("complemento", 100);
    table.string("bairro", 100).notNullable();
    table.string("cidade", 100).notNullable();
    table.string("estado", 2).notNullable();
    table.string("cep", 8);
    table.decimal("latitude", 10, 8);
    table.decimal("longitude", 11, 8);
  });

  await knex.schema.createTable("USUARIOS", (table) => {
    table.increments("id").primary();
    table.string("nome", 150).notNullable();
    table.string("email", 150).unique().notNullable();
    table.string("senha_hash", 255).notNullable();
    table.string("telefone", 20);
    table.integer("endereco_id").references("id").inTable("ENDERECOS");
    table.timestamp("data_cadastro").defaultTo(knex.fn.now());
    table.boolean("ativo").defaultTo(true);
  });

  await knex.schema.createTable("INSTITUICOES", (table) => {
    table.increments("id").primary();
    table.string("nome", 255).notNullable();
    table.string("cnpj", 14).unique();
    table.string("email", 150).unique().notNullable();
    table.string("telefone", 20);
    table.string("link_site", 255);
    table.text("descricao");
    table.integer("endereco_id").references("id").inTable("ENDERECOS");
    table.timestamp("data_cadastro").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("PETS", (table) => {
    table.increments("id").primary();
    table.string("nome", 100).notNullable();
    table.string("especie", 50).notNullable();
    table.string("raca", 100);
    table.string("sexo", 1).notNullable();
    table.string("idade_aproximada", 50);
    table.string("porte", 50);
    table.text("descricao_saude");
    table.text("historia");
    table.integer("instituicao_id").notNullable().references("id").inTable("INSTITUICOES");
    table.string("status_adocao", 50).notNullable();
  });

  await knex.schema.createTable("FOTOS_PET", (table) => {
    table.increments("id").primary();
    table.integer("pet_id").notNullable().references("id").inTable("PETS");
    table.string("url_foto", 255).notNullable();
    table.boolean("principal").defaultTo(false);
  });

  await knex.schema.createTable("REQUISITOS_ADOCAO", (table) => {
    table.increments("id").primary();
    table.integer("pet_id").notNullable().references("id").inTable("PETS");
    table.string("descricao_requisito", 255).notNullable();
  });

  await knex.schema.createTable("PROCESSO_ADOCAO", (table) => {
    table.increments("id").primary();
    table.integer("pet_id").notNullable().references("id").inTable("PETS");
    table.integer("usuario_id").notNullable().references("id").inTable("USUARIOS");
    table.integer("instituicao_id").notNullable().references("id").inTable("INSTITUICOES");
    table.timestamp("data_solicitacao").defaultTo(knex.fn.now());
    table.string("status", 50).notNullable();
  });

  await knex.schema.createTable("TIPOS_DOACAO", (table) => {
    table.increments("id").primary();
    table.string("nome_tipo", 100).unique().notNullable();
    table.string("unidade_medida", 50);
  });

  await knex.schema.createTable("DOACOES", (table) => {
    table.increments("id").primary();
    table.integer("usuario_id").notNullable().references("id").inTable("USUARIOS");
    table.integer("instituicao_id").notNullable().references("id").inTable("INSTITUICOES");
    table.integer("tipo_doacao_id").notNullable().references("id").inTable("TIPOS_DOACAO");
    table.decimal("quantidade", 10, 2).notNullable();
    table.timestamp("data_doacao").defaultTo(knex.fn.now());
    table.string("status_entrega", 50);
  });

  await knex.schema.createTable("REPORTES_RESGATE", (table) => {
    table.increments("id").primary();
    table.integer("usuario_reporter_id").references("id").inTable("USUARIOS");
    table.timestamp("data_hora_reporte").defaultTo(knex.fn.now());
    table.decimal("latitude", 10, 8).notNullable();
    table.decimal("longitude", 11, 8).notNullable();
    table.text("descricao_local");
    table.string("condicao_animal", 100);
  });

  await knex.schema.createTable("STATUS_RESGATE", (table) => {
    table.increments("id").primary();
    table.integer("reporte_id").notNullable().references("id").inTable("REPORTES_RESGATE");
    table.integer("instituicao_responsavel_id").references("id").inTable("INSTITUICOES");
    table.timestamp("data_atribuicao").defaultTo(knex.fn.now());
    table.string("status", 50).notNullable();
  });

  await knex.schema.createTable("PET_REPORTADO_APOS_RESGATE", (table) => {
    table.increments("id").primary();
    table.integer("reporte_id").unique().notNullable().references("id").inTable("REPORTES_RESGATE");
    table.integer("pet_id").unique().notNullable().references("id").inTable("PETS");
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("PET_REPORTADO_APOS_RESGATE");
  await knex.schema.dropTableIfExists("STATUS_RESGATE");
  await knex.schema.dropTableIfExists("REPORTES_RESGATE");
  await knex.schema.dropTableIfExists("DOACOES");
  await knex.schema.dropTableIfExists("TIPOS_DOACAO");
  await knex.schema.dropTableIfExists("PROCESSO_ADOCAO");
  await knex.schema.dropTableIfExists("REQUISITOS_ADOCAO");
  await knex.schema.dropTableIfExists("FOTOS_PET");
  await knex.schema.dropTableIfExists("PETS");
  await knex.schema.dropTableIfExists("INSTITUICOES");
  await knex.schema.dropTableIfExists("USUARIOS");
  await knex.schema.dropTableIfExists("ENDERECOS");
}

