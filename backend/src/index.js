require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 5000;

async function start(){
  try{
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync({ alter: true });
    app.listen(PORT, ()=> console.log('Server running on port', PORT));
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}

start();
