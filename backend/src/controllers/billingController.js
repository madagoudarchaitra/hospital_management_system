const { Billing, Patient, User } = require('../models');

exports.create = async (req, res) => {
  try{ const b = await Billing.create(req.body); res.json(b); }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.list = async (req, res) => {
  try{ 
    const list = await Billing.findAll({ 
      include: [{ model: Patient, include: [{ model: User, attributes: ['name'] }] }] 
    }); 
    res.json(list); 
  }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.get = async (req, res) => {
  try{ 
    const b = await Billing.findByPk(req.params.id, { 
      include: [{ model: Patient, include: [{ model: User, attributes: ['name'] }] }] 
    }); 
    if(!b) return res.status(404).json({}); 
    res.json(b); 
  }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.update = async (req, res) => {
  try{ const b = await Billing.findByPk(req.params.id); if(!b) return res.status(404).json({}); await b.update(req.body); res.json(b); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try{ const b = await Billing.findByPk(req.params.id); if(!b) return res.status(404).json({}); await b.destroy(); res.json({}); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};
