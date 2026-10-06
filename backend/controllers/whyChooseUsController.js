import WhyChooseUs from '../models/WhyChooseUs.js';

export const DEFAULT_WHY_CHOOSE_US = {
  badgeText: 'The Data Knowledge Advantage',
  title: 'Why Choose Us?',
  description:
    'Practical skills, industry-working mentors, and dedicated career placement support designed to get you hired.',
  items: [
    {
      title: 'Industry Working Mentors',
      desc: 'Learn from mentors who work in the industry and bring real-world experience to every session.',
      highlight: 'Real-World Experience',
      iconType: 'mentors',
      iconBg: 'bg-blue-50 text-[#3498db] border-blue-200/80',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      order: 1,
      isActive: true,
    },
    {
      title: 'Daily Mock Interviews',
      desc: 'Crack real interviews with daily scenario-based mock sessions.',
      highlight: 'Scenario-Based Prep',
      iconType: 'mock-interviews',
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200/80',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      order: 2,
      isActive: true,
    },
    {
      title: '100% Placement Support',
      desc: 'Resume building, Naukri optimization & interview cracking strategy.',
      highlight: 'Career Acceleration',
      iconType: 'placement-support',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      order: 3,
      isActive: true,
    },
    {
      title: 'Real-Time Projects',
      desc: 'Work on 10+ industry-level projects with real datasets.',
      highlight: '10+ Live Datasets',
      iconType: 'projects',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      order: 4,
      isActive: true,
    },
    {
      title: 'Lifetime Doubt Support',
      desc: 'Get mentorship support even after course completion.',
      highlight: 'Continuous Guidance',
      iconType: 'doubt-support',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200/80',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      order: 5,
      isActive: true,
    },
    {
      title: '100% Knowledge Guarantee',
      desc: 'Learn with confidence—we guarantee your understanding.',
      highlight: 'Zero Compromise',
      iconType: 'knowledge-guarantee',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200/80',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      order: 6,
      isActive: true,
    },
  ],
  ctaTitle: 'Ready to start your data transformation?',
  ctaSubtitle: 'Talk to our career advisors and get a personalized learning roadmap.',
  ctaButtonText: 'Get Free Career Guidance',
  ctaButtonLink: '/contact',
  showCtaBanner: true,
  isActive: true,
};

// Public: Get Why Choose Us data
export const getWhyChooseUs = async (req, res) => {
  try {
    let data = await WhyChooseUs.findOne({ isActive: true }).sort({ updatedAt: -1 });
    if (!data) {
      return res.status(200).json({
        success: true,
        message: 'Default Why Choose Us retrieved',
        data: { whyChooseUs: DEFAULT_WHY_CHOOSE_US },
      });
    }

    // Filter only active items if items array exists
    const sanitizedData = data.toObject();
    if (Array.isArray(sanitizedData.items)) {
      sanitizedData.items = sanitizedData.items
        .filter((item) => item.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    res.status(200).json({
      success: true,
      message: 'Why Choose Us retrieved successfully',
      data: { whyChooseUs: sanitizedData },
    });
  } catch (error) {
    console.error('Error fetching Why Choose Us:', error.message);
    res.status(200).json({
      success: true,
      message: 'Fallback Why Choose Us retrieved',
      data: { whyChooseUs: DEFAULT_WHY_CHOOSE_US },
    });
  }
};

// Admin: Get full Why Choose Us configuration
export const getWhyChooseUsAdmin = async (req, res) => {
  try {
    let data = await WhyChooseUs.findOne().sort({ updatedAt: -1 });
    if (!data) {
      data = await WhyChooseUs.create(DEFAULT_WHY_CHOOSE_US);
    }

    res.status(200).json({
      success: true,
      data: { whyChooseUs: data },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch Why Choose Us config',
    });
  }
};

// Admin: Update Why Choose Us
export const updateWhyChooseUs = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Parse items if passed as string
    if (typeof updateData.items === 'string') {
      try {
        updateData.items = JSON.parse(updateData.items);
      } catch (e) {
        console.error('Error parsing items string:', e);
      }
    }

    if (updateData.showCtaBanner !== undefined) {
      updateData.showCtaBanner =
        updateData.showCtaBanner === 'true' || updateData.showCtaBanner === true;
    }
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    }

    let data = await WhyChooseUs.findOne().sort({ updatedAt: -1 });

    if (data) {
      data = await WhyChooseUs.findByIdAndUpdate(data._id, updateData, {
        new: true,
        runValidators: true,
      });
    } else {
      data = await WhyChooseUs.create({ ...DEFAULT_WHY_CHOOSE_US, ...updateData });
    }

    res.status(200).json({
      success: true,
      message: 'Why Choose Us updated successfully',
      data: { whyChooseUs: data },
    });
  } catch (error) {
    console.error('Error updating Why Choose Us:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update Why Choose Us',
    });
  }
};
