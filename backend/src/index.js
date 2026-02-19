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
    console.log('✅ Database connected');
    // Use force: false to avoid altering existing tables
    await sequelize.sync({ force: false });
    console.log('✅ Models synced');
    app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`));
  }catch(err){
    console.error('❌ Error starting server:', err.message);
    process.exit(1);
  }
}

start();
