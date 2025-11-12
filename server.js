require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// Model
const User = require('./models/User');

// Connect
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => {
    console.error('Erro ao conectar MongoDB:', err.message);
    process.exit(1);
  });

// Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: 'Preencha todos os campos' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email já cadastrado' });
    // Hash senha antes de salvar
    const saltRounds = 10;
    const hashed = await bcrypt.hash(senha, saltRounds);
    const user = new User({ nome, email, senha: hashed });
    await user.save();
    res.status(201).json({ message: 'Usuário criado', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.get('/', (req, res) => res.json({ ok: true }));

// Evita iniciar o servidor quando a plataforma (ex.: Vercel) usar funções serverless
if (require.main === module) {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}
