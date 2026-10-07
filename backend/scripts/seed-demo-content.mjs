import dotenv from "dotenv";
import mongoose from "mongoose";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import Course from "../models/Course.js";
import CourseCategory from "../models/CourseCategory.js";
import Lesson from "../models/Lesson.js";
import Module from "../models/Module.js";
import ForumThread from "../models/ForumThread.js";
import JobPosting from "../models/JobPosting.js";
import News from "../models/News.js";
import User from "../models/user.js";
import CourseEnrollment from "../models/CourseEnrollment.js";
import Order from "../models/Order.js";
import VideoLesson from "../models/video.js";
import Assignment from "../models/Assignment.js";
import AssignmentSubmission from "../models/assignmentSubmission.js";
import ZoomMeeting from "../models/ZoomMeeting.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const environmentFile = process.argv.includes("--production") ? "../.env.production" : "../.env";
dotenv.config({ path: resolve(__dirname, environmentFile) });

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is not configured in backend/.env");
}

const courseCatalog = [
  {
    title: "Content Strategy Foundations",
    category: "Content Marketing",
    slug: "content-strategy-foundations",
    subtitle: "Build a repeatable system for useful, high-performing content.",
    description: "Learn how to research an audience, shape a clear content strategy, and measure what matters.",
    shortDescription: "A practical introduction to audience research, editorial planning, and content measurement.",
    price: 4999, salePrice: 2999, level: ["beginner"], tags: ["content strategy", "marketing", "editorial"],
    topic: ["Content Marketing", "Strategy"], targetAudience: ["Founders", "Creators", "Marketing professionals"],
    outcomes: ["Define a focused audience and content promise", "Create a four-week editorial plan", "Measure content performance with useful signals"],
    modules: [
      ["Audience and Positioning", "Define who you serve and why your point of view matters.", ["Audience research", "Positioning statement", "Content promise"]],
      ["Editorial System", "Turn strategy into a repeatable publishing workflow.", ["Content pillars", "Editorial calendar", "Measurement loop"]],
    ],
  },
  {
    title: "Performance Marketing Lab",
    category: "Digital Marketing",
    slug: "performance-marketing-lab",
    subtitle: "Plan, launch, and optimize campaigns with confidence.",
    description: "Build a complete performance marketing system across acquisition, landing pages, creative testing, and reporting.",
    shortDescription: "A hands-on campaign lab for marketers who want clearer decisions and better returns.",
    price: 7999, salePrice: 4999, level: ["intermediate"], tags: ["paid media", "analytics", "growth"],
    topic: ["Digital Marketing", "Growth"], targetAudience: ["Marketing executives", "Agency teams", "Founders"],
    outcomes: ["Create a measurable campaign brief", "Build a testing roadmap", "Read acquisition performance without vanity metrics"],
    modules: [
      ["Campaign Architecture", "Connect objectives, audiences, offers, and channels.", ["Brief and objectives", "Audience segments", "Channel selection"]],
      ["Optimization and Reporting", "Use evidence to improve campaigns every week.", ["Creative testing", "Conversion tracking", "Executive reporting"]],
    ],
  },
  {
    title: "Data Visualization with Stories",
    category: "Data & Analytics",
    slug: "data-visualization-with-stories",
    subtitle: "Turn complex data into clear decisions and compelling narratives.",
    description: "Learn the principles of visual encoding, dashboard hierarchy, chart selection, and narrative communication.",
    shortDescription: "Design dashboards and presentations that help people understand what the data means.",
    price: 6499, salePrice: 3999, level: ["intermediate"], tags: ["data", "visualization", "storytelling"],
    topic: ["Analytics", "Design"], targetAudience: ["Analysts", "Product teams", "Data professionals"],
    outcomes: ["Choose the right chart for a question", "Design a readable dashboard hierarchy", "Present insight with a clear narrative"],
    modules: [
      ["Visual Grammar", "Learn how visual choices affect comprehension.", ["Data types", "Encodings", "Chart selection"]],
      ["Dashboard Storytelling", "Build a decision-ready analytical experience.", ["Hierarchy", "Annotations", "Narrative walkthrough"]],
    ],
  },
  {
    title: "Product Design Sprint",
    category: "Design & UX",
    slug: "product-design-sprint",
    subtitle: "Move from ambiguous problem to tested product direction.",
    description: "Practice a structured design sprint covering discovery, ideation, prototyping, usability testing, and handoff.",
    shortDescription: "A focused product design process for teams that need to learn quickly.",
    price: 8999, salePrice: 5999, level: ["advanced"], tags: ["ux", "product design", "prototyping"],
    topic: ["UX Design", "Product"], targetAudience: ["Product designers", "PMs", "Startup teams"],
    outcomes: ["Frame a useful product problem", "Prototype a testable experience", "Turn user evidence into product decisions"],
    modules: [
      ["Discover and Define", "Align a team around the right problem.", ["User interviews", "Journey mapping", "How-might-we questions"]],
      ["Prototype and Validate", "Test the riskiest assumptions before building.", ["Rapid prototyping", "Usability sessions", "Decision handoff"]],
    ],
  },
  {
    title: "AI Workflows for Knowledge Teams",
    category: "Technology & AI",
    slug: "ai-workflows-for-knowledge-teams",
    subtitle: "Design reliable AI-assisted workflows without losing judgment.",
    description: "Create practical AI workflows for research, synthesis, documentation, and review with clear quality and privacy guardrails.",
    shortDescription: "A practical guide to using AI as a dependable collaborator in knowledge work.",
    price: 5999, salePrice: 3499, level: ["beginner", "intermediate"], tags: ["AI", "productivity", "research"],
    topic: ["Artificial Intelligence", "Workflows"], targetAudience: ["Researchers", "Operators", "Knowledge workers"],
    outcomes: ["Map a workflow suitable for AI assistance", "Write prompts with useful constraints", "Review outputs for accuracy and risk"],
    modules: [
      ["Workflow Design", "Find the right tasks for an AI collaborator.", ["Task decomposition", "Context packets", "Human checkpoints"]],
      ["Quality and Scale", "Make AI-assisted work consistent and trustworthy.", ["Evaluation rubrics", "Reusable templates", "Privacy basics"]],
    ],
  },
];

const seedNews = {
  title: "Data Knowledge launches a new learning season",
  articleTitle: "Data Knowledge launches a new learning season",
  slug: "data-knowledge-new-learning-season",
  summary:
    "Explore new courses, community discussions, and practical opportunities built for the next stage of your work.",
  excerpt:
    "Explore new courses, community discussions, and practical opportunities built for the next stage of your work.",
  content:
    "We are bringing together structured learning, peer discussion, and real project opportunities in one connected experience.",
  url: "https://dataknowledge.vercel.app/news/data-knowledge-new-learning-season",
  publishedAt: new Date(),
  language: "en",
  country: "IN",
  categories: ["Platform"],
  tags: ["announcement", "learning"],
  newsType: "normal",
  status: "active",
  stats: { views: 0, likes: 0, shares: 0 },
};

async function getSeedUser() {
  const user = await User.findOne({
    role: { $in: ["admin", "super_admin", "instructor"] },
    status: "active",
    isBanned: { $ne: true },
  }).sort({ createdAt: 1 });

  if (!user) {
    throw new Error(
      "No active admin, super_admin, or instructor user exists. Create one before seeding forum and gigs."
    );
  }

  return user;
}

async function getDemoStudent() {
  const user = await User.findOne({
    email: "student@dataknowledge.in",
    role: "student",
    status: "active",
    isBanned: { $ne: true },
  });

  if (!user) {
    throw new Error(
      "The demo student student@dataknowledge.in does not exist. Create the web demo user before seeding."
    );
  }

  return user;
}

async function upsertCourse(courseDefinition, seedUser) {
  const { modules: moduleDefinitions, outcomes, ...courseFields } = courseDefinition;
  const category = await CourseCategory.findOneAndUpdate(
    { slug: courseDefinition.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
    {
      $set: {
        name: courseDefinition.category,
        status: "active",
        isDeleted: false,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
  const courseData = {
    ...courseFields,
    categoryId: category._id,
    instructorId: seedUser._id,
    currency: "INR",
    duration: moduleDefinitions.length * 180,
    totalLessons: moduleDefinitions.length * 3,
    languages: ["English"],
    requirements: ["A willingness to practice between lessons"],
    learningOutcomes: outcomes,
    isPublished: true,
    isFeatured: true,
    enrollmentType: "open",
    enableQA: true,
    enableReviews: true,
    faq: [
      {
        question: "Who is this course for?",
        answer: `It is designed for ${courseDefinition.targetAudience.join(", ").toLowerCase()}.`,
        category: "course",
      },
      {
        question: "What will I build?",
        answer: courseDefinition.outcomes[0],
        category: "course",
      },
    ],
    contentSections: [
      {
        sectionType: "hero",
        sectionTitle: courseDefinition.title,
        sectionDescription: courseDefinition.description,
        order: 0,
      },
      {
        sectionType: "outcomes",
        sectionTitle: "What you will leave with",
        listItems: outcomes.map((text) => ({ text })),
        order: 1,
      },
    ],
    landingPageSections: [],
  };

  const course = await Course.findOneAndUpdate(
    { slug: courseDefinition.slug },
    { $set: courseData },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Rebuild only the seeded curriculum for this course, so rerunning the
  // script reflects edits to the catalog without creating duplicate lessons.
  const existingModules = await Module.find({ courseId: course._id }).select("_id");
  await Lesson.deleteMany({ moduleId: { $in: existingModules.map(({ _id }) => _id) } });
  await Module.deleteMany({ courseId: course._id });
  const moduleIds = [];
  for (const [moduleIndex, [title, description, lessonTitles]] of moduleDefinitions.entries()) {
    const module = await Module.create({
      courseId: course._id,
      title,
      description,
      objectives: lessonTitles,
      order: moduleIndex + 1,
      estimatedDuration: 180,
      isPublished: true,
    });
    const lessons = await Lesson.insertMany(
      lessonTitles.map((lessonTitle, lessonIndex) => ({
        title: lessonTitle,
        description: `${lessonTitle} practical lesson for ${courseDefinition.title}.`,
        type: lessonIndex === 0 ? "video" : lessonIndex === lessonTitles.length - 1 ? "assignment" : "text",
        language: "English",
        section: course._id,
        moduleId: module._id,
        accessibility: "free",
        content: {
          blocks: [
            {
              type: "paragraph",
              data: { text: `Work through the ${lessonTitle.toLowerCase()} exercise and capture one practical takeaway.` },
            },
          ],
        },
        order: lessonIndex + 1,
        duration: 45 + lessonIndex * 10,
        isActive: true,
        ismobileOnly: false,
      }))
    );
    const assignmentLesson = lessons[lessons.length - 1];
    await Assignment.findOneAndUpdate(
      { courseId: course._id, title: `${title} practical assignment` },
      {
        $set: {
          title: `${title} practical assignment`,
          subject: courseDefinition.category,
          language: "English",
          description: `Apply the ideas from ${title.toLowerCase()} to a real example. Submit a concise explanation of your approach, the decisions you made, and one improvement you would make after reviewing your work.`,
          maxScore: 100,
          duration: 45,
          maxAttempts: 2,
          materials: "",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    module.lessons = lessons.map((lesson) => lesson._id);
    await module.save();
    const videoLesson = lessons[0];
    await VideoLesson.findOneAndUpdate(
      { lessonId: videoLesson._id, title: videoLesson.title },
      {
        $set: {
          description: `Demo pre-uploaded video for ${courseDefinition.title}.`,
          sourcePlatform: "youtube",
          videoId: "aqz-KE-bpKQ",
          secureUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
          embedUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ",
          originalUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
          duration: 596,
          quality: "720p",
          uploadedBy: seedUser._id,
          status: "ready",
          isPublic: false,
          isDeleted: false,
          uploadMethod: "existing_video_id",
          linkedAt: new Date(),
          uploadTime: new Date(),
          tags: ["demo", "pre-uploaded", "course-video"],
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    moduleIds.push(module._id);
  }

  course.modules = moduleIds;
  await course.save();
  return course;
}

async function seedDemoPurchase(student, course) {
  const pricePaid = Number(course.salePrice ?? course.price ?? 0);
  const orderNo = `DEMO-PAID-${course.slug.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}`;
  const decimalPrice = mongoose.Types.Decimal128.fromString(pricePaid.toFixed(2));

  const order = await Order.findOneAndUpdate(
    { orderNo },
    {
      $set: {
        userId: student._id,
        items: [
          {
            courseId: course._id,
            type: "course",
            pricePaid: decimalPrice,
            currency: course.currency || "INR",
          },
        ],
        subTotal: decimalPrice,
        discount: mongoose.Types.Decimal128.fromString("0.00"),
        tax: mongoose.Types.Decimal128.fromString("0.00"),
        gstRate: mongoose.Types.Decimal128.fromString("0.00"),
        grandTotal: decimalPrice,
        payment: {
          provider: "free",
          paymentIntent: "demo-approved-payment",
          status: "paid",
        },
        isRefunded: false,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const enrollment = await CourseEnrollment.findOneAndUpdate(
    { userId: student._id, courseId: course._id },
    {
      $set: {
        type: "course",
        enrolledAt: new Date(),
        accessType: "lifetime",
        status: "active",
        enrollmentSource: "purchase",
        orderId: order._id,
        addToRevenue: false,
        pricePaid,
        isWithdrawn: false,
        withdrawnAt: null,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await User.updateOne(
    { _id: student._id },
    { $addToSet: { enrolledCourses: course._id } }
  );
  await Course.updateOne(
    { _id: course._id },
    { $addToSet: { enrolledStudents: student._id } }
  );
  const enrolledCourse = await Course.findById(course._id).select("enrolledStudents");
  await Course.updateOne(
    { _id: course._id },
    { $set: { enrolledStudentsCount: enrolledCourse?.enrolledStudents?.length || 0 } }
  );

  return { order, enrollment };
}

async function seedDemoSubmission(student, course) {
  const assignment = await Assignment.findOne({ courseId: course._id }).sort({ createdAt: 1 });
  if (!assignment) {
    throw new Error(`No assignment found for demo course ${course.title}`);
  }

  return AssignmentSubmission.findOneAndUpdate(
    { submittedBy: student._id, assignmentId: assignment._id },
    {
      $set: {
        courseId: course._id,
        lessonId: assignment.lessonId,
        submissionText:
          "I applied the lesson framework to a practical example and documented the decisions, evidence, and next improvement step.",
        submittedAt: new Date(),
        scoreGiven: 88,
        feedback: "Strong application of the framework. Add one more supporting example in the next iteration.",
        gradedAt: new Date(),
        status: "graded",
        is_complete: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seedDemoLiveClass(seedUser, course) {
  const meetingId = "98765432101";

  return ZoomMeeting.findOneAndUpdate(
    { meeting_id: meetingId },
    {
      $set: {
        topic: `${course.title} — Live Q&A`,
        type: 2,
        start_time: new Date(Date.now() + 30 * 60 * 1000),
        duration: 60,
        timezone: "Asia/Kolkata",
        password: "demo123",
        agenda: "Live walkthrough, questions, and practical feedback for demo learners.",
        join_url: `https://zoom.us/j/${meetingId}`,
        start_url: `https://zoom.us/j/${meetingId}`,
        createdBy: seedUser._id,
        courseId: course._id,
        isRecurring: false,
        recurrence: undefined,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seed() {
  await mongoose.connect(mongoUri);
  const seedUser = await getSeedUser();
  const demoStudent = await getDemoStudent();

  const courses = [];
  for (const courseDefinition of courseCatalog) {
    courses.push(await upsertCourse(courseDefinition, seedUser));
  }
  const course = courses[0];
  const demoPurchase = await seedDemoPurchase(demoStudent, course);
  const demoSubmission = await seedDemoSubmission(demoStudent, course);
  const demoLiveClass = await seedDemoLiveClass(seedUser, course);

  await ForumThread.findOneAndUpdate(
    { title: "How are you planning your next learning sprint?", createdBy: seedUser._id },
    {
      $set: {
        content:
          "Share one skill you are focusing on this month and the outcome you want to achieve.",
        tags: ["learning", "community", "goals"],
        courseId: course._id,
        isApproved: true,
        Is_openSource: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await JobPosting.findOneAndUpdate(
    { title: "Build a content performance dashboard", createdBy: seedUser._id },
    {
      $set: {
        description:
          "Create a lightweight dashboard that helps a small team understand content reach, engagement, and conversion.",
        category: "Marketing & Growth",
        skillsRequired: ["Analytics", "Data Visualization", "Content Marketing"],
        experienceLevel: "intermediate",
        mode: "contract",
        budget: { min: 15000, max: 30000, currency: "INR" },
        estimatedDuration: { value: 3, unit: "weeks" },
        location: { type: "remote" },
        status: true,
        isAdminApproved: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await News.findOneAndUpdate(
    { slug: seedNews.slug },
    { $set: seedNews },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(
    JSON.stringify(
      {
        success: true,
        seededBy: seedUser.email,
        demoPurchase: {
          user: demoStudent.email,
          course: course.slug,
          paymentStatus: demoPurchase.order.payment.status,
          enrollmentStatus: demoPurchase.enrollment.status,
        },
        demoSubmission: {
          id: demoSubmission._id,
          assignmentId: demoSubmission.assignmentId,
          status: demoSubmission.status,
        },
        demoLiveClass: {
          id: demoLiveClass._id,
          meetingId: demoLiveClass.meeting_id,
          topic: demoLiveClass.topic,
          startTime: demoLiveClass.start_time,
          courseId: demoLiveClass.courseId,
        },
        courses: courses.map(({ title, slug, _id }) => ({ title, slug, id: _id })),
        forum: "How are you planning your next learning sprint?",
        gig: "Build a content performance dashboard",
        news: seedNews.slug,
      },
      null,
      2
    )
  );
}

try {
  await seed();
} finally {
  await mongoose.disconnect();
}
