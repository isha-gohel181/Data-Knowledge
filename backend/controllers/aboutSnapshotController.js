import AboutSnapshot from '../models/AboutSnapshot.js';

export const DEFAULT_ABOUT_SNAPSHOT = {
  badgeText: 'About Data Knowledge',
  headlinePrefix: 'Empowering Learners with',
  headlineHighlight: 'Real-World Skills.',
  paragraph1:
    'At Data Knowledge, our mission is to provide practical and industry-focused training in tools like SQL, Excel, Power BI, Tableau, Python, and Business Analysis. Our courses are designed to help learners gain real-world skills that companies actually look for in data analyst and data science roles.',
  paragraph2:
    'The training programs focus on hands-on learning, real-time projects, and step-by-step guidance so that students can confidently work on real business problems. Whether you are a beginner starting your data analytics journey or a working professional looking to upgrade your skills, our courses are structured to support your career growth.',
  bulletPoints: [
    'Hands-on training in SQL, Excel, Power BI, Tableau, Python & Business Analysis',
    'Learn from real industry experts with experience in Data Analytics, ML & AI',
    'Job-ready preparation with resume building, mock interviews & real-time projects',
    'Continuous project support, code reviews & personalized career mentorship',
  ],
  primaryButtonText: 'Discover More About Us',
  primaryButtonLink: '/about-us',
  showPrimaryButton: true,
  secondaryButtonText: 'Explore Courses',
  secondaryButtonLink: '/courses',
  showSecondaryButton: true,
  image: '/hero_section.png',
  imageAlt: 'Data Knowledge Practical Learning',
  isActive: true,
};

// Public: Get About Snapshot data
export const getAboutSnapshot = async (req, res) => {
  try {
    let data = await AboutSnapshot.findOne({ isActive: true }).sort({ updatedAt: -1 });
    if (!data) {
      return res.status(200).json({
        success: true,
        message: 'Default About Snapshot retrieved',
        data: { aboutSnapshot: DEFAULT_ABOUT_SNAPSHOT },
      });
    }

    res.status(200).json({
      success: true,
      message: 'About Snapshot retrieved successfully',
      data: { aboutSnapshot: data },
    });
  } catch (error) {
    console.error('Error fetching About Snapshot:', error.message);
    res.status(200).json({
      success: true,
      message: 'Fallback About Snapshot retrieved',
      data: { aboutSnapshot: DEFAULT_ABOUT_SNAPSHOT },
    });
  }
};

// Admin: Get full About Snapshot config
export const getAboutSnapshotAdmin = async (req, res) => {
  try {
    let data = await AboutSnapshot.findOne().sort({ updatedAt: -1 });
    if (!data) {
      data = await AboutSnapshot.create(DEFAULT_ABOUT_SNAPSHOT);
    }

    res.status(200).json({
      success: true,
      data: { aboutSnapshot: data },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch About Snapshot config',
    });
  }
};

// Admin: Update About Snapshot
export const updateAboutSnapshot = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle image file upload
    if (req.file) {
      updateData.image = `uploads/${req.file.filename}`;
    }

    // Parse bulletPoints if passed as JSON string
    if (typeof updateData.bulletPoints === 'string') {
      try {
        updateData.bulletPoints = JSON.parse(updateData.bulletPoints);
      } catch (e) {
        updateData.bulletPoints = updateData.bulletPoints
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    if (updateData.showPrimaryButton !== undefined) {
      updateData.showPrimaryButton =
        updateData.showPrimaryButton === 'true' || updateData.showPrimaryButton === true;
    }
    if (updateData.showSecondaryButton !== undefined) {
      updateData.showSecondaryButton =
        updateData.showSecondaryButton === 'true' || updateData.showSecondaryButton === true;
    }
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    }

    let data = await AboutSnapshot.findOne().sort({ updatedAt: -1 });

    if (data) {
      data = await AboutSnapshot.findByIdAndUpdate(data._id, updateData, {
        new: true,
        runValidators: true,
      });
    } else {
      data = await AboutSnapshot.create({ ...DEFAULT_ABOUT_SNAPSHOT, ...updateData });
    }

    res.status(200).json({
      success: true,
      message: 'About Snapshot updated successfully',
      data: { aboutSnapshot: data },
    });
  } catch (error) {
    console.error('Error updating About Snapshot:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update About Snapshot',
    });
  }
};
