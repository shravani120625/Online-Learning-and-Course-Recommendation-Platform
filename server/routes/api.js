const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Controllers
const authController = require('../controllers/authController');
const courseController = require('../controllers/courseController');
const enrollmentController = require('../controllers/enrollmentController');
const recoController = require('../controllers/recoController');

// --- AUTH ROUTINGS ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', auth, authController.getProfile);

// --- COURSE ROUTINGS ---
router.get('/courses/seed', courseController.seedCourses);
router.get('/courses', courseController.getCourses);
router.get('/courses/:id', courseController.getCourseById);
router.post('/courses', auth, courseController.createCourse);

// --- ENROLLMENT ROUTINGS ---
router.post('/enrollments/enroll', auth, enrollmentController.enrollCourse);
router.get('/enrollments/my', auth, enrollmentController.getUserEnrollments);
router.get('/enrollments/course/:courseId', auth, enrollmentController.getEnrollmentDetails);
router.post('/enrollments/progress', auth, enrollmentController.updateLessonProgress);
router.get('/enrollments/quiz/:courseId', auth, enrollmentController.getQuiz);
router.post('/enrollments/quiz', auth, enrollmentController.submitQuiz);

// --- RECOMMENDATION ROUTINGS ---
router.get('/recommendations/user', auth, recoController.getUserRecommendations);
router.get('/recommendations/similar/:courseId', recoController.getSimilarCourses);
router.get('/recommendations/skillgap', auth, recoController.getSkillGapRecommendations);

module.exports = router;
