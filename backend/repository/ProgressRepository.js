import LessonProgress from '../models/LessonProgress.js';
import mongoose from 'mongoose';
import CourseEnrollment from '../models/CourseEnrollment.js'

class ProgressRepository {
  async findByUserAndLesson(userId, lessonId) {
    try {
      return await LessonProgress.findOne({ userId, lessonId })
        .populate('userId', 'email username')
        .populate('lessonId', 'title duration')
        .populate('courseId', 'title');
    } catch (error) {
      throw new Error(`Failed to find progress: ${error.message}`);
    }
  }

  async createProgress(progressData) {
    try {
      const progress = new LessonProgress(progressData);
      return await progress.save();
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error - progress already exists, update instead
        return await this.updateProgress(progressData.userId, progressData.lessonId, progressData);
      }
      throw new Error(`Failed to create progress: ${error.message}`);
    }
  }

  async updateProgress(userId, lessonId, courseId, updateData) {
    try {
      const progress = await LessonProgress.findOneAndUpdate(
        { userId, lessonId, courseId },
        { 
          ...updateData,
          lastUpdatedAt: new Date()
        },
        { 
          new: true, 
          upsert: true,
          runValidators: true
        }
      );

      // Update CourseEnrollment with lastVideoPlayed and recalculate overall course progress
      if (courseId) {
        try {
          const Course = (await import('../models/Course.js')).default;
          const courseDoc = await Course.findById(courseId).select('modules').populate({
            path: 'modules',
            select: 'lessons',
            populate: { path: 'lessons', select: '_id type' }
          }).lean();

          if (courseDoc && courseDoc.modules) {
            let allLessonIds = [];
            for (const m of courseDoc.modules) {
              if (m.lessons) {
                for (const l of m.lessons) {
                  allLessonIds.push(l._id.toString());
                }
              }
            }

            const totalLessons = allLessonIds.length;
            if (totalLessons > 0) {
              const allProgressDocs = await LessonProgress.find({
                userId,
                courseId
              }).select('lessonId progressPercentage completed').lean();

              const progressMap = new Map();
              allProgressDocs.forEach(p => {
                if (p.lessonId) progressMap.set(p.lessonId.toString(), p);
              });

              let sumProgress = 0;
              let completedLessonIds = [];
              for (const lid of allLessonIds) {
                const lp = progressMap.get(lid);
                if (lp) {
                  sumProgress += (lp.progressPercentage || 0);
                  if (lp.completed || lp.progressPercentage >= 80) {
                    completedLessonIds.push(new mongoose.Types.ObjectId(lid));
                  }
                }
              }

              const courseOverallProgress = Math.min(100, Math.round(sumProgress / totalLessons));
              const isCompleted = courseOverallProgress >= 100 || (completedLessonIds.length >= totalLessons && totalLessons > 0);

              await CourseEnrollment.findOneAndUpdate(
                { userId, courseId },
                {
                  $set: {
                    lastVideoPlayed: lessonId,
                    progressPercentage: courseOverallProgress,
                    iscompleted: isCompleted,
                    ...(isCompleted && { completedAt: new Date(), status: 'completed' })
                  },
                  ...(completedLessonIds.length > 0 && {
                    $addToSet: {
                      completedLessons: { $each: completedLessonIds }
                    }
                  })
                },
                { new: true }
              );
            }
          }
        } catch (enrollErr) {
          console.error('Error updating course enrollment progress:', enrollErr.message);
        }
      }

      return progress;
    } catch (error) {
      throw new Error(`Failed to update progress: ${error.message}`);
    }
  }

  async markCompleted(userId, lessonId, completionData = {}) {
    try {
      return await LessonProgress.findOneAndUpdate(
        { userId, lessonId },
        {
          completed: true,
          completedAt: new Date(),
          completionPercentage: completionData.completionPercentage || 100,
          ...(completionData.watchTime && { 
            watchTime: completionData.watchTime 
          }),
          lastUpdatedAt: new Date()
        },
        { 
          new: true, 
          upsert: true,
          runValidators: true
        }
      );
    } catch (error) {
      throw new Error(`Failed to mark as completed: ${error.message}`);
    }
  }

  async getCourseProgress(userId, courseId) {
  try {
    const progress = await LessonProgress.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          courseId: new mongoose.Types.ObjectId(courseId)
        }
      },
      // JOIN with lessons
      {
        $lookup: {
          from: 'lessons', // your Lesson collection name in lowercase plural
          localField: 'lessonId',
          foreignField: '_id',
          as: 'lesson'
        }
      },
      {
        $unwind: {
          path: '$lesson',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$courseId',
          totalLessons: { $sum: 1 },
          completedLessons: {
            $sum: {
              $cond: [{ $eq: ['$completed', true] }, 1, 0]
            }
          },
          totalWatchTime: { $sum: '$watchTime' },
          averageProgress: { $avg: '$progressPercentage' },
          lessons: {
            $push: {
              lessonId: '$lessonId',
              progressPercentage: '$progressPercentage',
              completed: '$completed',
              watchTime: '$watchTime',
              lastPosition: '$lastPosition',
              lessonTitle: '$lesson.title',
              lessonType: '$lesson.type',
              moduleId: '$lesson.moduleId'
            }
          }
        }
      },
      {
        $addFields: {
          courseCompletionPercentage: {
            $cond: [
              { $eq: ['$totalLessons', 0] },
              0,
              {
                $multiply: [
                  { $divide: ['$completedLessons', '$totalLessons'] },
                  100
                ]
              }
            ]
          }
        }
      }
    ]);

    return progress[0] || {
      totalLessons: 0,
      completedLessons: 0,
      totalWatchTime: 0,
      averageProgress: 0,
      courseCompletionPercentage: 0,
      lessons: []
    };
  } catch (error) {
    console.error('Error in getCourseProgress:', error);
    throw new Error(`Failed to get course progress: ${error.message}`);
  }
}


  async getUserProgress(userId, options = {}) {
    try {
      const { page = 1, limit = 50, courseId, completed } = options;
      const skip = (page - 1) * limit;

      const query = { userId };
      if (courseId) query.courseId = courseId;
      if (completed !== undefined) query.completed = completed;

      const [progress, total] = await Promise.all([
        LessonProgress.find(query)
          .populate('courseId', 'title thumbnail')
          .populate('lessonId', 'title duration order')
          .sort({ lastUpdatedAt: -1 })
          .skip(skip)
          .limit(limit),
        LessonProgress.countDocuments(query)
      ]);

      return {
        progress,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to get user progress: ${error.message}`);
    }
  }

  async getProgressBySession(sessionId) {
    try {
      return await LessonProgress.findOne({ sessionId })
        .populate('userId', 'email username')
        .populate('lessonId', 'title duration')
        .populate('courseId', 'title');
    } catch (error) {
      throw new Error(`Failed to find progress by session: ${error.message}`);
    }
  }

  async getRecentProgress(userId, limit = 10) {
    try {
      return await LessonProgress.find({ userId })
        .populate('courseId', 'title thumbnail')
        .populate('lessonId', 'title duration')
        .sort({ lastUpdatedAt: -1 })
        .limit(limit);
    } catch (error) {
      throw new Error(`Failed to get recent progress: ${error.message}`);
    }
  }

  async deleteProgress(userId, lessonId) {
    try {
      return await LessonProgress.findOneAndDelete({ userId, lessonId });
    } catch (error) {
      throw new Error(`Failed to delete progress: ${error.message}`);
    }
  }

  async getProgressStats(userId) {
    try {
      const stats = await LessonProgress.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalLessons: { $sum: 1 },
            completedLessons: { 
              $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
            },
            totalWatchTime: { $sum: '$watchTime' },
            averageProgress: { $avg: '$progressPercentage' },
            coursesInProgress: { $addToSet: '$courseId' }
          }
        },
        {
          $addFields: {
            totalCourses: { $size: '$coursesInProgress' },
            overallCompletionRate: {
              $cond: [
                { $eq: ['$totalLessons', 0] },
                0,
                {
                  $multiply: [
                    { $divide: ['$completedLessons', '$totalLessons'] },
                    100
                  ]
                }
              ]
            }
          }
        }
      ]);

      return stats[0] || {
        totalLessons: 0,
        completedLessons: 0,
        totalWatchTime: 0,
        averageProgress: 0,
        totalCourses: 0,
        overallCompletionRate: 0
      };
    } catch (error) {
      throw new Error(`Failed to get progress stats: ${error.message}`);
    }
  }
}

export default new ProgressRepository();
