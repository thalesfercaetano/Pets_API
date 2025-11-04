// Este arquivo contém a lógica de negócio relacionada a pets
// Aqui fazemos todas as operações no banco de dados relacionadas a pets (cadastrar, listar, atualizar, deletar)

import db from "../db";
import { Pet, PetResponse } from "../models/Pet";

export class PetBusiness {
  // Busca todos os pets cadastrados no banco de dados
  async listarPets(): Promise<PetResponse[]> {
    // Pega todos os pets da tabela PETS
    const pets = await db("PETS").select("*");
    
    // Transforma os dados do banco para o formato que a API retorna
    // O banco usa nomes em português (nome, especie) mas a API usa em inglês (name, type)
    return pets.map(pet => ({
      id: pet.id,
      name: pet.nome,
      type: pet.especie,
      owner_id: pet.instituicao_id,
    }));
  }

  // Cria um novo pet no banco de dados
  async criarPet(pet: Pet): Promise<PetResponse> {
    // Pega os dados do pet que foi enviado
    const { name, type, owner_id } = pet;

    // Insere o pet na tabela PETS
    // Alguns campos têm valores padrão (sexo "N" de não informado, status "disponível")
    const [id] = await db("PETS").insert({
      nome: name,
      especie: type,
      sexo: "N", 
      instituicao_id: owner_id,
      status_adocao: "disponível",
    });

    // Retorna os dados do pet criado
    return { id: id!, name, type, owner_id };
  }

  // Busca um pet específico pelo seu ID
  async buscarPetPorId(id: number): Promise<PetResponse | null> {
    // Procura o pet no banco pelo ID
    const pet = await db("PETS").where({ id }).first();
    
    // Se não encontrar, retorna null (nada)
    if (!pet) {
      return null;
    }

    // Se encontrar, retorna os dados formatados
    return {
      id: pet.id,
      name: pet.nome,
      type: pet.especie,
      owner_id: pet.instituicao_id,
    };
  }

  // Atualiza os dados de um pet existente
  async atualizarPet(id: number, dadosAtualizacao: { name?: string; type?: string; owner_id?: number }): Promise<boolean> {
    // Cria um objeto vazio para guardar apenas os campos que foram enviados para atualizar
    const updateData: any = {};
    
    // Se foi enviado um novo nome, adiciona no objeto de atualização
    if (dadosAtualizacao.name) {
      updateData.nome = dadosAtualizacao.name;
    }
    
    // Se foi enviado um novo tipo, adiciona no objeto de atualização
    if (dadosAtualizacao.type) {
      updateData.especie = dadosAtualizacao.type;
    }
    
    // Se foi enviado um novo owner_id, adiciona no objeto de atualização
    if (dadosAtualizacao.owner_id) {
      updateData.instituicao_id = dadosAtualizacao.owner_id;
    }

    // Se não foi enviado nenhum dado para atualizar, retorna false
    if (Object.keys(updateData).length === 0) {
      return false;
    }

    // Atualiza o pet no banco de dados
    const updatedRows = await db("PETS")
      .where({ id })
      .update(updateData);

    // Retorna true se atualizou algum registro, false se não encontrou o pet
    return updatedRows > 0;
  }

  // Deleta um pet do banco de dados
  async deletarPet(id: number): Promise<boolean> {
    // Remove o pet do banco pelo ID
    const deletedRows = await db("PETS").where({ id }).del();
    
    // Retorna true se deletou algum registro, false se não encontrou o pet
    return deletedRows > 0;
  }
}
