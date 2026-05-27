const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// Simple hardcoded quiz bank mapping to course indexes or titles
const quizQuestions = {
  'Introduction to React and Vite': [
    {
      id: 1,
      question: 'Which command is typically used to create a new Vite project?',
      options: ['npm create vite@latest', 'npm init react-app', 'npx install vite', 'npm install create-vite'],
      answerIndex: 0
    },
    {
      id: 2,
      question: 'What is the purpose of the useState hook in React?',
      options: ['To fetch data from an API', 'To manage state variable in a functional component', 'To bind styles to a component', 'To navigate between views'],
      answerIndex: 1
    },
    {
      id: 3,
      question: 'How do you pass data down from a parent component to a child component?',
      options: ['Using state', 'Using HTML attributes', 'Using props', 'Using contexts only'],
      answerIndex: 2
    }
  ],
  'Advanced Node.js & Express APIs': [
    {
      id: 1,
      question: 'Which of the following is true about Node.js architecture?',
      options: ['It is multi-threaded by default', 'It runs blocking synchronous actions', 'It uses a single-threaded event loop with non-blocking I/O', 'It cannot handle concurrent requests'],
      answerIndex: 2
    },
    {
      id: 2,
      question: 'In Express, what is a middleware function?',
      options: ['A database migration script', 'A function that has access to request, response, and next functions', 'A frontend route switcher', 'A CSS styling compiler'],
      answerIndex: 1
    }
  ],
  'AI & Machine Learning Foundations': [
    {
      id: 1,
      question: 'Which library is most commonly used in Python for training baseline Machine Learning algorithms like Regression?',
      options: ['PyTorch', 'Django', 'Scikit-Learn', 'Flask'],
      answerIndex: 2
    },
    {
      id: 2,
      question: 'What is the key difference between regression and classification tasks?',
      options: [
        'Regression outputs continuous values; Classification outputs discrete classes',
        'Regression is unsupervised; Classification is supervised',
        'Regression is only for small datasets',
        'Classification does not use math'
      ],
      answerIndex: 0
    }
  ],
  'Deep Learning & Neural Networks': [
    {
      id: 1,
      question: 'What does CNN stand for in Deep Learning?',
      options: ['Computer Network Node', 'Convolutional Neural Network', 'Critical Neural Node', 'Computational Neuromorphic Network'],
      answerIndex: 1
    },
    {
      id: 2,
      question: 'Which activation function is most commonly used in the hidden layers of Deep Neural Networks to avoid vanishing gradients?',
      options: ['Sigmoid', 'Tanh', 'ReLU', 'Linear'],
      answerIndex: 2
    }
  ],
  'Data Science Bootcamp: Python & Pandas': [
    {
      id: 1,
      question: 'Which Pandas structure is 2-dimensional, size-mutable, and potentially heterogeneous tabular data?',
      options: ['Series', 'DataFrame', 'Panel', 'List'],
      answerIndex: 1
    },
    {
      id: 2,
      question: 'How do you read a CSV file using Pandas?',
      options: ['pandas.read_csv()', 'pandas.load_csv()', 'pandas.open()', 'pandas.parse_csv()'],
      answerIndex: 0
    }
  ],
  'SQL & Databases for Data Analytics': [
    {
      id: 1,
      question: 'Which SQL keyword is used to filter records after they have been grouped using GROUP BY?',
      options: ['WHERE', 'HAVING', 'FILTER', 'LIMIT'],
      answerIndex: 1
    },
    {
      id: 2,
      question: 'What type of join returns all records when there is a match in either left or right table records?',
      options: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'],
      answerIndex: 2
    }
  ],
  'Cybersecurity Fundamentals': [
    {
      id: 1,
      question: 'What are the three pillars of the CIA Triad?',
      options: [
        'Computer, Internet, Antivirus',
        'Confidentiality, Integrity, Availability',
        'Cryptography, Inspection, Authorization',
        'Control, Intelligence, Assets'
      ],
      answerIndex: 1
    }
  ],
  'Ethical Hacking & Penetration Testing': [
    {
      id: 1,
      question: 'Which tool is most commonly utilized for network discovery and vulnerability scanning?',
      options: ['Wireshark', 'Metasploit', 'Nmap', 'John the Ripper'],
      answerIndex: 2
    },
    {
      id: 2,
      question: 'What is Cross-Site Scripting (XSS)?',
      options: [
        'Injecting malicious SQL commands to leak databases',
        'Injecting malicious scripts into trusted websites that execute in the client browser',
        'Sending massive packets to exhaust network bandwidth',
        'Sniffing passwords on a local WiFi network'
      ],
      answerIndex: 1
    }
  ]
};

// Default quiz for dynamically created courses
const fallbackQuiz = [
  {
    id: 1,
    question: 'What is the primary rule of engineering design?',
    options: ['Make it fast', 'Keep it simple and functional', 'Over-complicate details', 'Avoid testing'],
    answerIndex: 1
  }
];

// Enroll user in a course
exports.enrollCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let enrollment = await Enrollment.findOne({ userId, courseId });
    if (enrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    enrollment = new Enrollment({
      userId,
      courseId,
      status: 'Active',
      completedLessons: [],
      quizScore: 0,
      quizPassed: false
    });

    await enrollment.save();

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user's enrollments
exports.getUserEnrollments = async (req, res) => {
  const userId = req.user.id;

  try {
    const enrollments = await Enrollment.find({ userId })
      .populate('courseId', 'title subtitle thumbnailUrl category level skills lessons')
      .exec();
    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get specific enrollment details (with progress stats)
exports.getEnrollmentDetails = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollment = await Enrollment.findOne({ userId, courseId });
    
    res.json({
      course,
      enrollment: enrollment || null // null means not enrolled yet
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark lesson as completed / incompleted
exports.updateLessonProgress = async (req, res) => {
  const userId = req.user.id;
  const { courseId, lessonId, completed } = req.body;

  try {
    let enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found' });
    }

    const completedSet = new Set(enrollment.completedLessons);
    if (completed) {
      completedSet.add(lessonId);
    } else {
      completedSet.delete(lessonId);
    }

    enrollment.completedLessons = Array.from(completedSet);
    enrollment.lastAccessedAt = Date.now();

    await enrollment.save();
    res.json({ message: 'Progress updated', completedLessons: enrollment.completedLessons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get quiz questions for a course
exports.getQuiz = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Attempt to match course title
    const quiz = quizQuestions[course.title] || fallbackQuiz;
    
    // Return quiz questions without correct answers (for security)
    const sanitizedQuiz = quiz.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }));

    res.json(sanitizedQuiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Grade quiz submission and update user skills
exports.submitQuiz = async (req, res) => {
  const userId = req.user.id;
  const { courseId, answers } = req.body; // answers is { [questionId]: optionIndex }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found' });
    }

    const quiz = quizQuestions[course.title] || fallbackQuiz;
    let scoreCount = 0;
    
    quiz.forEach(q => {
      const selectedIndex = answers[q.id];
      if (selectedIndex !== undefined && selectedIndex === q.answerIndex) {
        scoreCount++;
      }
    });

    const percentage = Math.round((scoreCount / quiz.length) * 100);
    const passed = percentage >= 60; // 60% passing grade

    enrollment.quizScore = percentage;
    enrollment.quizPassed = passed;
    
    if (passed) {
      enrollment.status = 'Completed';
      enrollment.completedAt = Date.now();
      
      // Upgrade user profile with course skills!
      const user = await User.findById(userId);
      if (user) {
        const currentSkills = new Set(user.skills);
        course.skills.forEach(skill => currentSkills.add(skill));
        user.skills = Array.from(currentSkills);
        await user.save();
      }
    }

    await enrollment.save();

    res.json({
      message: passed ? 'Congratulations! You passed the quiz.' : 'Quiz failed. Please try again.',
      score: percentage,
      passed,
      skillsEarned: passed ? course.skills : []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
