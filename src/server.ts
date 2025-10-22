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

app.listen(3003, () => {
 console.log("Servidor rodando na porta 3003! ");
});