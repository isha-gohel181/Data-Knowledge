import * as programOfferService from '../services/programOfferService.js';

export const createProgram = async (req, res) => {
  try {
    let data = { ...req.body };

    if (!data.title || !data.shortTitle) {
      return res.status(400).json({
        success: false,
        message: 'Title and short title are required.',
      });
    }

    if (typeof data.highlights === 'string') {
      try {
        data.highlights = JSON.parse(data.highlights);
      } catch (e) {
        data.highlights = data.highlights.split('\n').map((s) => s.trim()).filter(Boolean);
      }
    }

    if (typeof data.tools === 'string') {
      try {
        data.tools = JSON.parse(data.tools);
      } catch (e) {
        data.tools = data.tools.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    if (data.order !== undefined) {
      data.order = Number(data.order) || 0;
    }
    if (data.isActive !== undefined) {
      data.isActive = data.isActive === 'true' || data.isActive === true;
    }

    const program = await programOfferService.createProgram(data);

    res.status(201).json({
      success: true,
      message: 'Program track created successfully',
      data: { program },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPrograms = async (req, res) => {
  try {
    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true' || req.query.isActive === true;
    } else if (!req.query.all) {
      filter.isActive = true;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { shortTitle: searchRegex },
        { badge: searchRegex },
      ];
    }

    const programs = await programOfferService.getPrograms(filter);

    res.json({
      success: true,
      message: 'Programs retrieved successfully',
      data: { programs },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProgramsAdmin = async (req, res) => {
  try {
    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true' || req.query.isActive === true;
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { shortTitle: searchRegex },
        { badge: searchRegex },
      ];
    }

    const programs = await programOfferService.getPrograms(filter);

    res.json({
      success: true,
      message: 'Admin programs retrieved successfully',
      data: { programs },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProgramById = async (req, res) => {
  try {
    const program = await programOfferService.getProgramById(req.params.id);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }
    res.json({
      success: true,
      data: { program },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProgram = async (req, res) => {
  try {
    let data = { ...req.body };

    if (typeof data.highlights === 'string') {
      try {
        data.highlights = JSON.parse(data.highlights);
      } catch (e) {
        data.highlights = data.highlights.split('\n').map((s) => s.trim()).filter(Boolean);
      }
    }

    if (typeof data.tools === 'string') {
      try {
        data.tools = JSON.parse(data.tools);
      } catch (e) {
        data.tools = data.tools.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    if (data.order !== undefined) {
      data.order = Number(data.order) || 0;
    }
    if (data.isActive !== undefined) {
      data.isActive = data.isActive === 'true' || data.isActive === true;
    }

    const program = await programOfferService.updateProgram(req.params.id, data);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }

    res.json({
      success: true,
      message: 'Program updated successfully',
      data: { program },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const program = await programOfferService.deleteProgram(req.params.id);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }
    res.json({
      success: true,
      message: 'Program deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const toggleProgramStatus = async (req, res) => {
  try {
    const program = await programOfferService.toggleProgramStatus(req.params.id);
    res.json({
      success: true,
      message: `Program ${program.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { program },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
