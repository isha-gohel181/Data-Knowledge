import HeroSection from '../models/HeroSection.js';

const DEFAULT_HERO_DATA = {
  headlinePrefix: 'Master Practical Data Analytics,',
  headlineHighlight: 'Data Science, ML & AI',
  description:
    'At Data Knowledge, our mission is to provide practical and industry-focused training in tools like SQL, Excel, Power BI, Tableau, Python, and Business Analysis. Gain real-world skills that companies actually look for in data analyst and data science roles.',
  primaryButtonText: 'Explore Programs',
  primaryButtonLink: '/courses',
  showPrimaryButton: true,
  secondaryButtonText: 'Book Consultation',
  secondaryButtonAction: 'consultation_modal',
  secondaryButtonLink: '',
  showSecondaryButton: true,
  mentorImage: '/data_knowlege/mentor/mentore_2.png',
  mentorImageAlt: 'Data Knowledge Mentors',
  badgeText: '',
  isActive: true,
};

// Public: Get Hero Section Data
export const getHeroSection = async (req, res) => {
  try {
    let hero = await HeroSection.findOne({ isActive: true }).sort({ updatedAt: -1 });

    if (!hero) {
      // If none found in DB, return default configuration
      return res.status(200).json({
        success: true,
        message: 'Default hero section retrieved',
        data: { hero: DEFAULT_HERO_DATA },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hero section retrieved successfully',
      data: { hero },
    });
  } catch (error) {
    // If DB is unreachable or errored, still return default hero data so frontend doesn't break
    console.error('Error fetching hero section:', error.message);
    res.status(200).json({
      success: true,
      message: 'Fallback hero section retrieved',
      data: { hero: DEFAULT_HERO_DATA },
    });
  }
};

// Admin: Get Hero Section Configuration
export const getHeroSectionAdmin = async (req, res) => {
  try {
    let hero = await HeroSection.findOne().sort({ updatedAt: -1 });

    if (!hero) {
      hero = await HeroSection.create(DEFAULT_HERO_DATA);
    }

    res.status(200).json({
      success: true,
      data: { hero },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch hero section config',
    });
  }
};

// Admin: Update Hero Section Configuration
export const updateHeroSection = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle uploaded file for mentorImage
    if (req.file) {
      updateData.mentorImage = `uploads/${req.file.filename}`;
    }

    // Parse boolean strings from multipart/form-data if necessary
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

    let hero = await HeroSection.findOne().sort({ updatedAt: -1 });

    if (hero) {
      hero = await HeroSection.findByIdAndUpdate(hero._id, updateData, {
        new: true,
        runValidators: true,
      });
    } else {
      hero = await HeroSection.create({ ...DEFAULT_HERO_DATA, ...updateData });
    }

    res.status(200).json({
      success: true,
      message: 'Hero section updated successfully',
      data: { hero },
    });
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update hero section',
    });
  }
};
