// Este arquivo configura a aplicação principal da API
// Aqui definimos as configurações básicas e conectamos todas as rotas

import express from "express";
import cors from "cors";
import db from "./db";
import usuarioRoutes from "./routes/usuarioRoutes";
import petRoutes from "./routes/petRoutes";
import adocaoRoutes from "./routes/adocaoRoutes";
import resgateRoutes from "./routes/resgateRoutes";
import doacaoRoutes from "./routes/doacaoRoutes";
import instituicaoRoutes from "./routes/instituicaoRoutes";
import enderecoRoutes from "./routes/enderecoRoutes";

export const app = express();

app.use(express.json());

app.use(cors());

app.get("/testConnection", async (req, res) => {
  try {
    await db.raw("SELECT 1+1 AS result");
    res.send("Conectado com sucesso ao banco de dados");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao conectar com o banco de dados");
  }
});

//Rotas
app.use("/usuarios", usuarioRoutes);
app.use("/pets", petRoutes);
app.use("/adocoes", adocaoRoutes);
app.use("/resgates", resgateRoutes);
app.use("/doacoes", doacaoRoutes);
app.use("/instituicoes", instituicaoRoutes);
app.use("/enderecos", enderecoRoutes);
