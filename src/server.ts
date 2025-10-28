import express from "express";
import cors from "cors";
import db from "./db"; 

export const app = express();

app.use(express.json());
app.use(cors());

app.get("/testConnection", async (req, res) => {
  try {
    await db.raw("SELECT 1+1 AS result");
    res.send("Conectado com sucesso ao conectar com o banco de dados");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao conectar com o banco de dados");
  }
});

//Endpoints basicos para usuarios

app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [id] = await db("USUARIOS").insert({ name, email, password });
    res.status(201).json({ id, name, email });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar usuário");
  }
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body; 
  try {
    const user = await db("USUARIOS").where({ email, password }).first(); 
    if (user) {
      res.status(200).json({ id: user.id, name: user.name, email: user.email });
    } else {
      res.status(401).send("Credenciais inválidas");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao fazer login");
  }
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db("USUARIOS").where({ id }).first();
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("Usuário não encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar usuário");
  }
});

app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body; 
  try {
    const updatedRows = await db("USUARIOS")
      .where({ id })
      .update({ name, email, password });
    if (updatedRows) {
      res.status(200).send("Usuário atualizado com sucesso");
    } else {
      res.status(404).send("Usuário não encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao atualizar usuário");
  }
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await db("USUARIOS").where({ id }).del();
    if (deletedRows) {
      res.status(200).send("Usuário deletado com sucesso");
    } else {
      res.status(404).send("Usuário não encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao deletar usuário");
  }
});

//Endpoints basicos para pets

app.post("/pets", async (req, res) => {
  const { name, type, owner_id } = req.body;  
  try {
    const [id] = await db("PETS").insert({ name, type, owner_id });
    res.status(201).json({ id, name, type, owner_id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar pet");
  }
});

app.get("/pets", async (req, res) => {
  try {
    const pets = await db("PETS").select("*");
    res.status(200).json(pets);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar pets");
  }
});

app.get("/pets/:id", async (req, res) => {    
  const { id } = req.params;
  try {
    const pet = await db("PETS").where({ id }).first();
    if (pet) {
      res.status(200).json(pet);
    } else {
      res.status(404).send("Pet não encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar pet");
  }
});

app.patch("/pets/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, owner_id } = req.body;
  try {
    const updatedRows = await db("PETS")
      .where({ id })
      .update({ name, type, owner_id });
    if (updatedRows) {
      res.status(200).send("Pet atualizado com sucesso");
    } else {
      res.status(404).send("Pet não encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao atualizar pet");
  }
});

app.delete("/pets/:id", async (req, res) => {
  const { id } = req.params;  
  try {
    const deletedRows = await db("PETS").where({ id }).del();
    if (deletedRows) {
      res.status(200).send("Pet deletado com sucesso");
    } else {
      res.status(404).send("Pet não encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao deletar pet");
  }
});

app.listen(3003, () => {
 console.log("Servidor rodando na porta 3003! ");
});