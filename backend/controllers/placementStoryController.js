import * as storyService from '../services/placementStoryService.js';

export const createPlacementStory = async (req, res) => {
  try {
    let data = { ...req.body };

    // Handle thumbnail from uploaded file
    if (req.file) {
      data.thumbnail = req.file.filename;
    } else if (req.files && req.files['thumbnail'] && req.files['thumbnail'][0]) {
      data.thumbnail = req.files['thumbnail'][0].filename;
    } else if (req.files && req.files['image'] && req.files['image'][0]) {
      data.thumbnail = req.files['image'][0].filename;
    }

    if (req.files && req.files['video'] && req.files['video'][0]) {
      data.video = req.files['video'][0].filename;
    }

    if (!data.studentName || !data.company || !data.instagramUrl) {
      return res.status(400).json({
        success: false,
        message: 'Student name, company, and Instagram URL are required.',
      });
    }

    // Convert order to number if provided
    if (data.order !== undefined) {
      data.order = Number(data.order) || 0;
    }
    if (data.isActive !== undefined) {
      data.isActive = data.isActive === 'true' || data.isActive === true;
    }

    const story = await storyService.createPlacementStory(data);

    res.status(201).json({
      success: true,
      message: 'Instagram placement story created successfully',
      data: { story },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPlacementStories = async (req, res) => {
  try {
    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true' || req.query.isActive === true;
    } else if (!req.query.all) {
      // By default, public endpoint returns only active stories
      filter.isActive = true;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { studentName: searchRegex },
        { company: searchRegex },
        { role: searchRegex },
        { badge: searchRegex },
      ];
    }

    const stories = await storyService.getPlacementStories(filter);

    res.json({
      success: true,
      message: 'Placement stories retrieved successfully',
      data: { stories },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPlacementStoriesAdmin = async (req, res) => {
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
        { role: searchRegex },
        { badge: searchRegex },
      ];
    }

    const stories = await storyService.getPlacementStories(filter);

    res.json({
      success: true,
      message: 'Admin placement stories retrieved successfully',
      data: { stories },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPlacementStoryById = async (req, res) => {
  try {
    const story = await storyService.getPlacementStoryById(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Placement story not found',
      });
    }

    res.json({
      success: true,
      message: 'Placement story retrieved successfully',
      data: { story },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updatePlacementStory = async (req, res) => {
  try {
    let data = { ...req.body };

    if (req.file) {
      data.thumbnail = req.file.filename;
    } else if (req.files && req.files['thumbnail'] && req.files['thumbnail'][0]) {
      data.thumbnail = req.files['thumbnail'][0].filename;
    } else if (req.files && req.files['image'] && req.files['image'][0]) {
      data.thumbnail = req.files['image'][0].filename;
    }

    if (req.files && req.files['video'] && req.files['video'][0]) {
      data.video = req.files['video'][0].filename;
    }

    if (data.order !== undefined) {
      data.order = Number(data.order) || 0;
    }
    if (data.isActive !== undefined) {
      data.isActive = data.isActive === 'true' || data.isActive === true;
    }

    const story = await storyService.updatePlacementStory(req.params.id, data);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Placement story not found',
      });
    }

    res.json({
      success: true,
      message: 'Placement story updated successfully',
      data: { story },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const deletePlacementStory = async (req, res) => {
  try {
    const story = await storyService.deletePlacementStory(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Placement story not found',
      });
    }

    res.json({
      success: true,
      message: 'Placement story deleted successfully',
      data: { id: req.params.id },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const togglePlacementStoryStatus = async (req, res) => {
  try {
    const story = await storyService.togglePlacementStoryStatus(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Placement story not found',
      });
    }

    res.json({
      success: true,
      message: `Placement story is now ${story.isActive ? 'Active' : 'Inactive'}`,
      data: { story },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
