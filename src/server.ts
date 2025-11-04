// Este arquivo é responsável por iniciar o servidor da nossa API
// Ele importa a configuração do app e faz o servidor "escutar" em uma porta

import { app } from "./app";

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!`);
});
