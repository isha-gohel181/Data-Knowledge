import Mentor from '../models/Mentor.js';

export const createMentor = async (req, res) => {
  try {
    const { name, role, exCompanies, experienceBadge, stats, bio, skills, accentGradient, glowColor, borderColor, status } = req.body;
    
    const image = req.files?.image?.[0]?.path?.replace(/\\/g, '/');

    const mentor = new Mentor({
      name,
      role,
      exCompanies: exCompanies ? (typeof exCompanies === 'string' ? JSON.parse(exCompanies) : exCompanies) : [],
      experienceBadge,
      image,
      stats: stats ? (typeof stats === 'string' ? JSON.parse(stats) : stats) : [],
      bio: bio ? (typeof bio === 'string' ? JSON.parse(bio) : bio) : [],
      skills: skills ? (typeof skills === 'string' ? JSON.parse(skills) : skills) : [],
      accentGradient,
      glowColor,
      borderColor,
      status
    });

    await mentor.save();
    res.status(201).json({ success: true, message: 'Mentor created successfully', data: mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMentors = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const mentors = await Mentor.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: mentors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }
    res.json({ success: true, data: mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, exCompanies, experienceBadge, stats, bio, skills, accentGradient, glowColor, borderColor, status } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (exCompanies) updateData.exCompanies = typeof exCompanies === 'string' ? JSON.parse(exCompanies) : exCompanies;
    if (experienceBadge) updateData.experienceBadge = experienceBadge;
    if (stats) updateData.stats = typeof stats === 'string' ? JSON.parse(stats) : stats;
    if (bio) updateData.bio = typeof bio === 'string' ? JSON.parse(bio) : bio;
    if (skills) updateData.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    if (accentGradient !== undefined) updateData.accentGradient = accentGradient;
    if (glowColor !== undefined) updateData.glowColor = glowColor;
    if (borderColor !== undefined) updateData.borderColor = borderColor;
    if (status) updateData.status = status;

    if (req.files?.image?.[0]) {
      updateData.image = req.files.image[0].path.replace(/\\/g, '/');
    }

    const mentor = await Mentor.findByIdAndUpdate(id, updateData, { new: true });
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    res.json({ success: true, message: 'Mentor updated successfully', data: mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const mentor = await Mentor.findByIdAndDelete(id);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }
    res.json({ success: true, message: 'Mentor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
