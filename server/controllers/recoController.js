const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// Get personalized recommendations for user
exports.getUserRecommendations = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's current enrollments
    const userEnrollments = await Enrollment.find({ userId });
    const enrolledCourseIds = userEnrollments.map(e => e.courseId.toString());

    // 1. Get similar users and their enrollments (Collaborative Filtering)
    let coEnrollmentCounts = {};
    if (enrolledCourseIds.length > 0) {
      // Find other users enrolled in any of current user's courses
      const similarEnrollments = await Enrollment.find({
        courseId: { $in: enrolledCourseIds },
        userId: { $ne: userId }
      });
      
      const similarUserIds = similarEnrollments.map(e => e.userId);

      if (similarUserIds.length > 0) {
        // Find other courses these similar users are enrolled in
        const peerEnrollments = await Enrollment.find({
          userId: { $in: similarUserIds },
          courseId: { $notin: enrolledCourseIds } // Not enrolled by current user
        });

        peerEnrollments.forEach(e => {
          const cid = e.courseId.toString();
          coEnrollmentCounts[cid] = (coEnrollmentCounts[cid] || 0) + 1;
        });
      }
    }

    // 2. Fetch all courses the user is NOT enrolled in
    const candidateCourses = await Course.find({
      _id: { $nin: enrolledCourseIds }
    });

    // 3. Score candidates based on Interests, Skill-Gaps, and Peers
    const userInterestsLower = (user.interests || []).map(i => i.toLowerCase());
    const userSkillsLower = (user.skills || []).map(s => s.toLowerCase());

    const recommendedList = candidateCourses.map(course => {
      const courseIdStr = course._id.toString();

      // Interest tag matching
      const courseTagsLower = (course.tags || []).map(t => t.toLowerCase());
      const commonInterests = courseTagsLower.filter(t => userInterestsLower.includes(t));
      const interestScore = commonInterests.length * 3.0; // 3 points per interest match

      // Skill-gap coverages (prioritize courses that teach skills the user does not have)
      const courseSkillsLower = (course.skills || []).map(s => s.toLowerCase());
      const missingSkills = course.skills.filter((_, idx) => !userSkillsLower.includes(courseSkillsLower[idx]));
      const skillGapScore = missingSkills.length * 2.5; // 2.5 points per new skill taught

      // Peer collaborative score
      const peerCount = coEnrollmentCounts[courseIdStr] || 0;
      const collaborativeScore = peerCount * 4.0; // 4 points per peer co-enrollment

      const totalScore = interestScore + skillGapScore + collaborativeScore;

      // Determine main reason for recommendation
      let matchReason = 'Expand your skills';
      if (collaborativeScore > interestScore && collaborativeScore > skillGapScore) {
        matchReason = 'Popular among peers with similar learning tracks';
      } else if (interestScore >= skillGapScore && interestScore > 0) {
        matchReason = `Matches your interest in ${commonInterests[0]}`;
      } else if (missingSkills.length > 0) {
        matchReason = `Fills skill gaps: ${missingSkills.slice(0, 2).join(', ')}`;
      }

      // Calculate confidence percentage (min 40%, capped at 99%)
      const matchPercentage = Math.min(99, Math.max(40, 40 + Math.round(totalScore * 5)));

      return {
        course,
        matchPercentage,
        matchReason,
        scores: {
          interestScore,
          skillGapScore,
          collaborativeScore,
          totalScore
        }
      };
    });

    // Sort by recommendation score descending
    recommendedList.sort((a, b) => b.scores.totalScore - a.scores.totalScore);

    res.json(recommendedList.slice(0, 5)); // Return top 5 recommendations
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recommendations of courses similar to a given course
exports.getSimilarCourses = async (req, res) => {
  const { courseId } = req.params;

  try {
    const targetCourse = await Course.findById(courseId);
    if (!targetCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Fetch other courses in the same category or with matching tags
    const targetTags = targetCourse.tags.map(t => t.toLowerCase());
    const candidates = await Course.find({ _id: { $ne: courseId } });

    const scored = candidates.map(course => {
      const candidateTags = course.tags.map(t => t.toLowerCase());
      const overlappingTags = candidateTags.filter(t => targetTags.includes(t));
      
      let score = overlappingTags.length * 2;
      
      if (course.category === targetCourse.category) {
        score += 5; // Strong boost for same category
      }

      return { course, score };
    });

    scored.sort((a, b) => b.score - a.score);

    res.json(scored.slice(0, 3).map(s => s.course));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Identify skill gaps and recommend specific remedial courses
exports.getSkillGapRecommendations = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all enrolled course IDs to exclude them
    const userEnrollments = await Enrollment.find({ userId });
    const enrolledCourseIds = userEnrollments.map(e => e.courseId.toString());

    // Determine missing interest skills
    // Let's build a map of user interest tag to expected skills
    // We can assume user interests represent desired skills. For skills they don't have, we recommend courses that offer them.
    const userSkillsLower = (user.skills || []).map(s => s.toLowerCase());
    
    // Find courses teaching skills that user lacks, matching user interests
    const courses = await Course.find({
      _id: { $nin: enrolledCourseIds }
    });

    const gapRecommendations = [];

    courses.forEach(course => {
      const courseSkillsLower = course.skills.map(s => s.toLowerCase());
      const gapsFilled = course.skills.filter((_, idx) => !userSkillsLower.includes(courseSkillsLower[idx]));

      // If it teaches something they don't know, it's a candidate
      if (gapsFilled.length > 0) {
        // Calculate overlap with user interests
        const interestOverlap = course.tags.filter(t => 
          user.interests.some(i => i.toLowerCase() === t.toLowerCase())
        );

        // If it overlaps with user's interests, it's a high priority gap filler!
        if (interestOverlap.length > 0 || course.category === 'Web Development' || course.category === 'Artificial Intelligence') {
          gapRecommendations.push({
            course,
            gapsFilled,
            priority: gapsFilled.length * 1.5 + interestOverlap.length * 2.0
          });
        }
      }
    });

    gapRecommendations.sort((a, b) => b.priority - a.priority);

    res.json(gapRecommendations.slice(0, 3));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
