export interface Pet {
  id?: number;
  name: string;
  type: string;
  owner_id: number;
}

export interface PetRequest {
  name: string;
  type: string;
  owner_id: number;
}

export interface PetResponse {
  id: number;
  name: string;
  type: string;
  owner_id: number;
}

