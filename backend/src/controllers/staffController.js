const { Staff } = require('../models');

exports.create = async (req, res) => {
  try{ 
    console.log('Creating staff with data:', req.body);
    const s = await Staff.create(req.body); 
    res.json(s); 
  }catch(err){ 
    console.error('Error creating staff:', err);
    res.status(500).json({ message: 'Server error', error: err.message }); 
  }
};

exports.list = async (req, res) => {
  try{ 
    const list = await Staff.findAll(); 
    res.json(list); 
  }catch(err){ 
    console.error('Error listing staff:', err);
    res.status(500).json({ message: 'Server error', error: err.message }); 
  }
};

exports.get = async (req, res) => {
  try{ 
    const s = await Staff.findByPk(req.params.id); 
    if(!s) return res.status(404).json({ message: 'Staff not found' }); 
    res.json(s); 
  }catch(err){ 
    console.error('Error getting staff:', err);
    res.status(500).json({ message: 'Server error', error: err.message }); 
  }
};

exports.update = async (req, res) => {
  try{ 
    const s = await Staff.findByPk(req.params.id); 
    if(!s) return res.status(404).json({ message: 'Staff not found' }); 
    await s.update(req.body); 
    res.json(s); 
  }catch(err){ 
    console.error('Error updating staff:', err);
    res.status(500).json({ message: 'Server error', error: err.message }); 
  }
};

exports.remove = async (req, res) => {
  try{ 
    const s = await Staff.findByPk(req.params.id); 
    if(!s) return res.status(404).json({ message: 'Staff not found' }); 
    await s.destroy(); 
    res.json({ message: 'Staff deleted successfully' }); 
  }catch(err){ 
    console.error('Error deleting staff:', err);
    res.status(500).json({ message: 'Server error', error: err.message }); 
  }
};
