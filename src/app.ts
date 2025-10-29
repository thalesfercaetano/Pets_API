import express from "express";
import cors from "cors";
import db from "./db";
import usuarioRoutes from "./routes/usuarioRoutes";
import petRoutes from "./routes/petRoutes";

export const app = express();

app.use(express.json());
app.use(cors());

//Verificação de conexão com o banco de dados
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
app.use("/", usuarioRoutes);
app.use("/", petRoutes);
