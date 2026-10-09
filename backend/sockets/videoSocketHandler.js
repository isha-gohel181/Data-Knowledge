import { updateLessonProgressDirect } from '../controllers/ProgressController.js';

// Store last update time per user to throttle updates
const progressCache = new Map();

const videoSocketHandler = (socket) => {
  socket.on('video-progress', async (data) => {
    const { videoId, userId, currentTime, duration, courseId, lessonId } = data || {};
    const effectiveUserId = userId || socket.user?._id?.toString();
    const targetLessonId = lessonId || videoId;

    if (!targetLessonId || !effectiveUserId || currentTime === undefined) {
      return socket.emit('error', { message: 'Invalid progress data' });
    }

    // Throttle updates per user/lesson - allow every 2 seconds
    const cacheKey = `${effectiveUserId}-${targetLessonId}`;
    const lastUpdate = progressCache.get(cacheKey) || 0;
    const now = Date.now();

    if (now - lastUpdate < 2000) {
      return;
    }

    progressCache.set(cacheKey, now);

    try {
      // Calculate progress percentage
      const progressPercentage = duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0;
      const isCompleted = progressPercentage >= 80;

      const updateData = {
        watchTime: currentTime,
        currentPosition: currentTime,
        lastPosition: currentTime,
        progressPercentage: progressPercentage,
        sessionId: socket.id,
        videoDuration: duration,
        ...(isCompleted && { completed: true, completionPercentage: 100 })
      };

      const update = await updateLessonProgressDirect(
        effectiveUserId, 
        targetLessonId, 
        courseId, 
        updateData
      );

      socket.emit('progress-updated', {
        success: true,
        lessonId: targetLessonId,
        courseId,
        progressPercentage,
        completed: isCompleted,
        currentTime,
        data: update,
      });
    } catch (err) {
      console.error('Socket DB update error:', err?.message);
      socket.emit('error', { message: 'Failed to update progress' });
    }
  });

  // Handle video completion
  socket.on('video-complete', async (data) => {
    const { videoId, userId, duration, courseId, lessonId } = data || {};
    const effectiveUserId = userId || socket.user?._id?.toString();
    const targetLessonId = lessonId || videoId;

    if (!targetLessonId || !effectiveUserId) {
      return socket.emit('error', { message: 'Invalid completion data' });
    }

    try {
      const completionData = {
        watchTime: duration || 0,
        currentPosition: duration || 0,
        lastPosition: duration || 0,
        progressPercentage: 100,
        completed: true,
        completionPercentage: 100,
        sessionId: socket.id,
        videoDuration: duration
      };

      const update = await updateLessonProgressDirect(
        effectiveUserId, 
        targetLessonId, 
        courseId, 
        completionData
      );

      const cacheKey = `${effectiveUserId}-${targetLessonId}`;
      progressCache.delete(cacheKey);

      socket.emit('video-completed', {
        success: true,
        lessonId: targetLessonId,
        courseId,
        data: update,
      });

      socket.emit('progress-updated', {
        success: true,
        lessonId: targetLessonId,
        courseId,
        progressPercentage: 100,
        completed: true,
        data: update,
      });
    } catch (err) {
      console.error('Socket completion error:', err?.message);
      socket.emit('error', { message: 'Failed to mark video as complete' });
    }
  });

  // Handle video pause/resume for more granular tracking
  socket.on('video-pause', async (data) => {
    const { videoId, userId, currentTime, courseId, lessonId } = data || {};
    const effectiveUserId = userId || socket.user?._id?.toString();
    const targetLessonId = lessonId || videoId;
    
    try {
      if (!targetLessonId || !effectiveUserId) return;
      const updateData = {
        lastPosition: currentTime,
        sessionId: socket.id
      };

      await updateLessonProgressDirect(effectiveUserId, targetLessonId, courseId, updateData);
      socket.emit('video-paused', { success: true });
    } catch (err) {
      console.error('Socket pause error:', err?.message);
    }
  });

  socket.on('video-resume', async (data) => {
    const { videoId, userId, currentTime, courseId, lessonId } = data || {};
    const effectiveUserId = userId || socket.user?._id?.toString();
    const targetLessonId = lessonId || videoId;
    
    try {
      if (!targetLessonId || !effectiveUserId) return;
      const updateData = {
        lastPosition: currentTime,
        sessionId: socket.id
      };

      await updateLessonProgressDirect(effectiveUserId, targetLessonId, courseId, updateData);
      socket.emit('video-resumed', { success: true });
    } catch (err) {
      console.error('Socket resume error:', err?.message);
    }
  });

  socket.on('video-seek', async (data) => {
    const { videoId, userId, currentTime, courseId, lessonId } = data || {};
    const effectiveUserId = userId || socket.user?._id?.toString();
    const targetLessonId = lessonId || videoId;
    
    try {
      if (!targetLessonId || !effectiveUserId) return;
      const updateData = {
        lastPosition: currentTime,
        sessionId: socket.id
      };

      await updateLessonProgressDirect(effectiveUserId, targetLessonId, courseId, updateData);
      socket.emit('video-seeked', { success: true });
    } catch (err) {
      console.error('Socket seek error:', err?.message);
    }
  });

  // Clean up cache when socket disconnects
  socket.on('disconnect', () => {
    const now = Date.now();
    progressCache.forEach((timestamp, key) => {
      if (now - timestamp > 3600000) {
        progressCache.delete(key);
      }
    });
  });

  socket.on('connect', () => {});

  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
};

export default videoSocketHandler;