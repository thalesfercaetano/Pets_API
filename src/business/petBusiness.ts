import db from "../db";
import { Pet, PetResponse } from "../models/Pet";

export class PetBusiness {
  async listarPets(): Promise<PetResponse[]> {
    const pets = await db("PETS").select("*");
    return pets.map(pet => ({
      id: pet.id,
      name: pet.nome,
      type: pet.especie,
      owner_id: pet.instituicao_id,
    }));
  }

  async criarPet(pet: Pet): Promise<PetResponse> {
    const { name, type, owner_id } = pet;

    const [id] = await db("PETS").insert({
      nome: name,
      especie: type,
      sexo: "N", 
      instituicao_id: owner_id,
      status_adocao: "disponível",
    });

    return { id: id!, name, type, owner_id };
  }

  async buscarPetPorId(id: number): Promise<PetResponse | null> {
    const pet = await db("PETS").where({ id }).first();
    
    if (!pet) {
      return null;
    }

    return {
      id: pet.id,
      name: pet.nome,
      type: pet.especie,
      owner_id: pet.instituicao_id,
    };
  }

  async atualizarPet(id: number, dadosAtualizacao: { name?: string; type?: string; owner_id?: number }): Promise<boolean> {
    const updateData: any = {};
    
    if (dadosAtualizacao.name) {
      updateData.nome = dadosAtualizacao.name;
    }
    
    if (dadosAtualizacao.type) {
      updateData.especie = dadosAtualizacao.type;
    }
    
    if (dadosAtualizacao.owner_id) {
      updateData.instituicao_id = dadosAtualizacao.owner_id;
    }

    if (Object.keys(updateData).length === 0) {
      return false;
    }

    const updatedRows = await db("PETS")
      .where({ id })
      .update(updateData);

    return updatedRows > 0;
  }

  async deletarPet(id: number): Promise<boolean> {
    const deletedRows = await db("PETS").where({ id }).del();
    return deletedRows > 0;
  }
}

