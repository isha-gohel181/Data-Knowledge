import AssignmentSubmissionService from '../service/assignmentSubmissionService.js';
import VideoSessionRepository from '../repository/VideoSessionRepository.js';
import { getGlobalLeaderboard, getUserLeaderboard } from '../service/leaderboardService.js';
import User from '../models/user.js';
import Course from '../models/Course.js';
import CourseBundle from '../models/CourseBundle.js';
import Lesson from '../models/Lesson.js';
import VideoLesson from '../models/video.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Certificate from '../models/Certificate.js';
import Leaderboard from '../models/Leaderboard.js';
import News from '../models/News.js';
import Assignment from '../models/Assignment.js';
import ZoomMeeting from '../models/ZoomMeeting.js';

const assignmentService = new AssignmentSubmissionService();

class DashboardController {
  async getDashboard(req, res) {
    try {
      const userId = req.user?._id || req.user?.id;

      // 1. Fetch User and Core Stats
      const [user, enrollments, news, leaderboardData, certificatesCount] = await Promise.all([
        User.findById(userId).select('fullName email profilePicture role bio phone company address education skills mobileVerified emailVerified').lean(),
        CourseEnrollment.find({ userId, isWithdrawn: false })
          .populate('courseId', 'title thumbnail')
          .populate('courseBundleId', 'title thumbnail')
          .lean(),
        News.find({ status: 'active' }).sort({ publishedAt: -1 }).limit(5).select('title summary publishedAt imageUrl').lean(),
        Leaderboard.findOne({ userId }).lean(),
        Certificate.countDocuments({ user_id: userId, status: 'issued' })
      ]);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // 2. Process Enrollment Stats
      const activeCourses = enrollments
        .filter(e => e.status === 'active')
        .map(e => {
          const courseObj = e.courseId || e.courseBundleId;
          return {
            courseId: courseObj?._id || e.courseId || e.courseBundleId,
            title: courseObj?.title || 'Enrolled Course',
            thumbnail: courseObj?.thumbnail || '',
            progress: e.progressPercentage || 0,
            enrolledAt: e.enrolledAt
          };
        });

      const completedCoursesCount = enrollments.filter(
        e => e.iscompleted || e.progressPercentage === 100 || e.status === 'completed'
      ).length;

      const completedModulesCount = enrollments.reduce(
        (acc, e) => acc + (e.completedLessons?.length || 0),
        0
      );

      // 3. Fetch and Process Submissions
      let submissions = [];
      try {
        submissions = await assignmentService.getMySubmissions(userId);
      } catch (err) {
        console.error('Error fetching submissions for dashboard:', err);
      }

      const recentSubmissions = (submissions || [])
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 5)
        .map(s => ({
          id: s._id,
          assignmentTitle: s.assignmentId?.title || s.assignmentTitle || '',
          courseTitle: s.courseId?.title || s.courseTitle || '',
          status: s.status,
          submittedAt: s.submittedAt
        }));

      // 4. Fetch Pending Assignments
      const enrolledCourseIds = enrollments
        .map(e => e.courseId?._id || e.courseId)
        .filter(Boolean);

      const allAssignments = enrolledCourseIds.length > 0
        ? await Assignment.find({ courseId: { $in: enrolledCourseIds } }).limit(10).lean()
        : [];

      const submittedAssignmentIds = (submissions || []).map(
        s => s.assignmentId?._id?.toString() || s.assignmentId?.toString()
      );
      
      const upcomingAssignments = allAssignments
        .filter(a => !submittedAssignmentIds.includes(a._id.toString()))
        .slice(0, 5)
        .map(a => ({
          id: a._id,
          title: a.title,
          courseId: a.courseId
        }));

      // 5. Fetch Recent video sessions (Continue Learning)
      let sessions = [];
      try {
        sessions = await VideoSessionRepository.find({ userId });
      } catch (err) {
        console.error('Error fetching video sessions for dashboard:', err);
      }
        
      let recentSessions = (sessions || [])
        .sort((a, b) => new Date(b.updatedAt || b.startTime) - new Date(a.updatedAt || a.startTime))
        .slice(0, 5)
        .map(s => ({
          sessionId: s.sessionId,
          videoTitle: s.videoId?.title || '',
          lessonTitle: s.videoId?.lessonId?.title || s.lessonId?.title || '',
          courseId: s.videoId?.lessonId?.courseId || s.courseId,
          lastWatchedAt: s.updatedAt || s.endTime || s.startTime,
          completionPercentage: s.completionPercentage || 0
        }));

      // If no video session has been recorded yet, provide active enrolled course as continue learning
      if (recentSessions.length === 0 && activeCourses.length > 0) {
        const firstCourse = activeCourses[0];
        recentSessions = [{
          sessionId: 'default',
          videoTitle: firstCourse.title,
          lessonTitle: 'Start Course',
          courseId: firstCourse.courseId,
          lastWatchedAt: firstCourse.enrolledAt,
          completionPercentage: firstCourse.progress || 0
        }];
      }

      // 6. Top learners from leaderboard
      let topLearners = [];
      try {
        topLearners = await getGlobalLeaderboard(10);
      } catch (err) {
        console.error('Error fetching global leaderboard for dashboard:', err);
      }
      
      // 7. Get User's own Rank
      let userRank = null;
      try {
        userRank = await getUserLeaderboard(userId);
      } catch (e) {
        userRank = leaderboardData ? { ...leaderboardData, rank: 'N/A' } : null;
      }

      // 8. Fetch Upcoming / Active Live Classes
      let upcomingLiveClasses = [];
      try {
        const now = new Date();
        const orConditions = [
          { courseId: null },
          { courseId: { $exists: false } }
        ];
        if (enrolledCourseIds.length > 0) {
          orConditions.push({ courseId: { $in: enrolledCourseIds } });
        }
        upcomingLiveClasses = await ZoomMeeting.find({
          $or: orConditions,
          start_time: { $gte: new Date(now.getTime() - 2 * 60 * 60 * 1000) }
        })
          .sort({ start_time: 1 })
          .limit(3)
          .lean();
      } catch (err) {
        console.error('Error fetching live classes for dashboard:', err);
      }

      res.json({
        success: true,
        data: {
          allCoursesCount: enrollments.length,
          activeCoursesCount: activeCourses.length,
          certificatesCount: certificatesCount,
          profile: {
            ...user,
            stats: {
              enrolledCourses: enrollments.length,
              completedCourses: completedCoursesCount,
              completedModules: completedModulesCount,
              certificatesEarned: certificatesCount,
              xp: leaderboardData?.xp || 0,
              level: leaderboardData?.level || 'Beginner',
              rank: userRank?.rank || 'N/A'
            }
          },
          activeCourses,
          continueLearning: recentSessions,
          upcomingLiveClasses: (upcomingLiveClasses || []).map(m => ({
            id: m.meeting_id,
            _id: m._id,
            topic: m.topic,
            start_time: m.start_time,
            duration: m.duration,
            join_url: m.join_url,
            password: m.password,
            isRecurring: m.isRecurring
          })),
          upcomingAssignments,
          recentSubmissions,
          recentNews: news,
          topLearners: topLearners || [],
          leaderboard: userRank
        }
      });

    } catch (err) {
      console.error('Dashboard Error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new DashboardController();


