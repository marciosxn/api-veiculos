const app = require('./src/app');
const { initDb } = require('./src/database');

initDb().then(() => {
  app.listen(3000, () => console.log('API rodando na porta 3000'));
});