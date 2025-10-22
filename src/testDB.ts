import db from './db';

async function testDatabase() {
  try {
    const result = await db.raw('SELECT NOW()');
    console.log('Conexão OK:', result);

    const usuarios = await db('USUARIOS').select('*');
    console.log('Usuários:', usuarios);

    const pets = await db('PETS').select('*');
    console.log('Pets:', pets);

  } catch (error) {
    console.error('Erro ao testar banco:', error);
  } finally {
    await db.destroy(); 
  }
}

testDatabase();