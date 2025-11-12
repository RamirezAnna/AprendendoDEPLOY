const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Reusa o modelo existente
const User = require('../models/User');

// Conexão cacheada entre invocações (serverless)
let cached = global.__mongoose;
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI não definida nas variáveis de ambiente');
    cached.promise = mongoose.connect(uri)
      .then((mongooseInstance) => mongooseInstance);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    await dbConnect();

    const { nome, email, senha } = req.body || {};
    const nomeTrim = typeof nome === 'string' ? nome.trim() : '';
    const emailNorm = typeof email === 'string' ? String(email).trim().toLowerCase() : '';
    const senhaStr = typeof senha === 'string' ? senha : '';

    if (!nomeTrim || !emailNorm || !senhaStr) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }
    // validações simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(emailNorm)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    if (senhaStr.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter ao menos 6 caracteres' });
    }

  const exists = await User.findOne({ email: emailNorm });
    if (exists) return res.status(409).json({ error: 'Email já cadastrado' });

  const hashed = await bcrypt.hash(senhaStr, 10);
  const user = new User({ nome: nomeTrim, email: emailNorm, senha: hashed });
    await user.save();

    return res.status(201).json({ message: 'Usuário criado', userId: user._id });
  } catch (err) {
    console.error('Erro /api/signup:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};
