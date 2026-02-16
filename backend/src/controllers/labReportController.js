const { LabReport, Patient, User } = require('../models');

exports.create = async (req, res) => {
  try{ const r = await LabReport.create(req.body); res.json(r); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.list = async (req, res) => {
  try{ 
    const list = await LabReport.findAll({ 
      include: [{ model: Patient, include: [{ model: User, attributes: ['name'] }] }] 
    }); 
    res.json(list); 
  }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.get = async (req, res) => {
  try{ 
    const r = await LabReport.findByPk(req.params.id, { 
      include: [{ model: Patient, include: [{ model: User, attributes: ['name'] }] }] 
    }); 
    if(!r) return res.status(404).json({}); 
    res.json(r); 
  }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.update = async (req, res) => {
  try{ const r = await LabReport.findByPk(req.params.id); if(!r) return res.status(404).json({}); await r.update(req.body); res.json(r); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try{ const r = await LabReport.findByPk(req.params.id); if(!r) return res.status(404).json({}); await r.destroy(); res.json({}); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};
