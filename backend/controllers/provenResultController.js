import * as resultService from '../services/provenResultService.js';

export const createProvenResult = async (req, res) => {
  try {
    let data = { ...req.body };

    // Handle image from uploaded file
    if (req.file) {
      data.image = req.file.filename;
    } else if (req.files && req.files['image'] && req.files['image'][0]) {
      data.image = req.files['image'][0].filename;
    }

    if (!data.studentName || !data.company) {
      return res.status(400).json({
        success: false,
        message: 'Student name and company name are required.',
      });
    }

    // Convert order to number if provided
    if (data.order !== undefined) {
      data.order = Number(data.order) || 0;
    }
    if (data.isActive !== undefined) {
      data.isActive = data.isActive === 'true' || data.isActive === true;
    }

    const result = await resultService.createProvenResult(data);

    res.status(201).json({
      success: true,
      message: 'Placement result card created successfully',
      data: { result },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProvenResults = async (req, res) => {
  try {
    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true' || req.query.isActive === true;
    } else if (!req.query.all) {
      // By default, public endpoint returns active results only
      filter.isActive = true;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { studentName: searchRegex },
        { company: searchRegex },
        { salary: searchRegex },
        { transitionTag: searchRegex },
        { badge: searchRegex },
      ];
    }

    const results = await resultService.getProvenResults(filter);

    res.json({
      success: true,
      message: 'Proven placement results retrieved successfully',
      data: { results },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProvenResultsAdmin = async (req, res) => {
  try {
    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true' || req.query.isActive === true;
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { studentName: searchRegex },
        { company: searchRegex },
        { salary: searchRegex },
        { transitionTag: searchRegex },
        { badge: searchRegex },
      ];
    }

    const results = await resultService.getProvenResults(filter);

    res.json({
      success: true,
      message: 'Admin proven results retrieved successfully',
      data: { results },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProvenResultById = async (req, res) => {
  try {
    const result = await resultService.getProvenResultById(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Placement result not found',
      });
    }
    res.json({
      success: true,
      data: { result },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProvenResult = async (req, res) => {
  try {
    let data = { ...req.body };

    if (req.file) {
      data.image = req.file.filename;
    } else if (req.files && req.files['image'] && req.files['image'][0]) {
      data.image = req.files['image'][0].filename;
    }

    if (data.order !== undefined) {
      data.order = Number(data.order) || 0;
    }
    if (data.isActive !== undefined) {
      data.isActive = data.isActive === 'true' || data.isActive === true;
    }

    const result = await resultService.updateProvenResult(req.params.id, data);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Placement result not found',
      });
    }

    res.json({
      success: true,
      message: 'Placement result updated successfully',
      data: { result },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteProvenResult = async (req, res) => {
  try {
    const result = await resultService.deleteProvenResult(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Placement result not found',
      });
    }
    res.json({
      success: true,
      message: 'Placement result deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const toggleProvenResultStatus = async (req, res) => {
  try {
    const result = await resultService.toggleProvenResultStatus(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Placement result not found',
      });
    }
    res.json({
      success: true,
      message: `Placement result ${result.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { result },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
