const { Patient, User } = require('../models');
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
  try{
    const { name, age, gender, address } = req.body;
    // Create a user for the patient with the provided name
    const pw = await bcrypt.hash('patient123', 10);
    const [user] = await User.findOrCreate({
      where: { email: `patient-${Date.now()}@example.com` },
      defaults: { name, password: pw, role: 'patient' }
    });
    // Create patient linked to the user
    const p = await Patient.create({ userId: user.id, age, gender, address });
    // Return patient with user included
    const patientWithUser = await Patient.findByPk(p.id, { include: User });
    res.json(patientWithUser);
  }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.list = async (req, res) => {
  try{ const list = await Patient.findAll({ include: User }); res.json(list); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.get = async (req, res) => {
  try{ const p = await Patient.findByPk(req.params.id, { include: User }); if(!p) return res.status(404).json({}); res.json(p); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.update = async (req, res) => {
  try{ const p = await Patient.findByPk(req.params.id); if(!p) return res.status(404).json({}); await p.update(req.body); res.json(p); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try{ const p = await Patient.findByPk(req.params.id); if(!p) return res.status(404).json({}); await p.destroy(); res.json({}); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};
