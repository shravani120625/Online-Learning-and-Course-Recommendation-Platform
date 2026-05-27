const Course = require('../models/Course');

const defaultCourses = [
  {
    title: 'Introduction to React and Vite',
    subtitle: 'Build modern user interfaces with React and fast tooling',
    description: 'Learn the fundamentals of React including components, state, props, hooks, and build-tools using Vite. A perfect starting point for frontend developers.',
    category: 'Web Development',
    level: 'Beginner',
    instructor: 'Prof. Sarah Jenkins',
    skills: ['React', 'JavaScript', 'Frontend', 'CSS'],
    tags: ['React', 'Frontend', 'Vite', 'JS', 'CSS', 'UI'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop',
    lessons: [
      {
        title: 'Getting Started with React & Vite',
        content: 'Welcome to React! In this lesson we will configure our Node environment, initialize a React application using Vite, and understand the basic folder layout.\n\n### Practical Exercises:\n1. Install Node.js\n2. Run `npm create vite@latest`\n3. Start the dev server using `npm run dev` and explore `App.jsx`',
        videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
        duration: 12
      },
      {
        title: 'JSX and Component Architecture',
        content: 'React uses JavaScript XML (JSX) to easily write HTML in React. Learn how components render UI and nest within one another.\n\n### Key Concepts:\n- React Components are JavaScript functions returning JSX.\n- JSX must return a single root element.\n- Nested components allow reusable UI components.',
        videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0',
        duration: 15
      },
      {
        title: 'Working with Props and State',
        content: 'Props allow you to pass data to components, while state acts as local component memory. Master `useState` hook to build dynamic responsive pages.\n\n### Code Snippet:\n```javascript\nconst [count, setCount] = useState(0);\nreturn <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;\n```',
        videoUrl: 'https://www.youtube.com/embed/LDB4uaJ87Us',
        duration: 20
      }
    ]
  },
  {
    title: 'Advanced Node.js & Express APIs',
    subtitle: 'Design and build enterprise-grade secure REST APIs',
    description: 'Dive deep into Node.js architecture, event loops, middleware development, routing, security hardening, database integration, and JWT authentication.',
    category: 'Web Development',
    level: 'Advanced',
    instructor: 'Alex Mercer',
    skills: ['Node.js', 'Express', 'Backend', 'APIs'],
    tags: ['Node', 'Express', 'Backend', 'API', 'REST', 'JWT'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=600&auto=format&fit=crop',
    lessons: [
      {
        title: 'Node.js Architecture & Event Loop',
        content: 'Understand how Node.js handles asynchronous operations using its event loop, thread pools, and non-blocking I/O operations.\n\n### Discussion:\n- Single-threaded execution\n- Asynchronous callbacks\n- V8 JavaScript Engine and libuv runtime',
        videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4',
        duration: 18
      },
      {
        title: 'Designing Custom Express Middleware',
        content: 'Middleware functions are functions that have access to the request, response, and next functions. Learn request logging, error-handling, and auth validation.',
        videoUrl: 'https://www.youtube.com/embed/lY6icfhap2o',
        duration: 22
      }
    ]
  },
  {
    title: 'AI & Machine Learning Foundations',
    subtitle: 'Learn Python, Regression, Clustering, and Scikit-Learn',
    description: 'Get started with Artificial Intelligence. Understand core statistical concepts, data cleaning, mathematical foundations, and train ML algorithms with Python.',
    category: 'Artificial Intelligence',
    level: 'Beginner',
    instructor: 'Dr. Evelyn Foster',
    skills: ['Python', 'Machine Learning', 'Data Analysis'],
    tags: ['AI', 'Python', 'ML', 'Data', 'Scikit-Learn', 'Math'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=600&auto=format&fit=crop',
    lessons: [
      {
        title: 'Introduction to Artificial Intelligence',
        content: 'What is Artificial Intelligence, Machine Learning, and Deep Learning? Understand the differences, history, and modern applications of ML systems.',
        videoUrl: 'https://www.youtube.com/embed/JMUxmLguRI8',
        duration: 10
      },
      {
        title: 'Regression and Classification Models',
        content: 'Learn about Linear Regression, Logistic Regression, and Decision Trees. Learn how to train models and evaluate them using MSE and Accuracy metrics.',
        videoUrl: 'https://www.youtube.com/embed/cK73JHHI-iQ',
        duration: 25
      }
    ]
  },
  {
    title: 'Deep Learning & Neural Networks',
    subtitle: 'Build computer vision models using PyTorch',
    description: 'Dive deep into neural network architectures, backpropagation, feedforward loops, convolutional neural networks (CNNs) for image detection, and transfer learning.',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    instructor: 'Dr. Evelyn Foster',
    skills: ['Python', 'Deep Learning', 'PyTorch', 'Computer Vision'],
    tags: ['AI', 'Deep Learning', 'Neural Networks', 'PyTorch', 'CNN', 'Vision'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
    lessons: [
      {
        title: 'Neural Network Architectures',
        content: 'Explore how layers, neurons, activation functions (ReLU, Sigmoid, Softmax), and loss functions construct artificial networks.',
        videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
        duration: 30
      },
      {
        title: 'Convolutional Neural Networks (CNNs)',
        content: 'Understand image processing filters, pooling, striding, and convolutional layers. Implement an image classifier using PyTorch.',
        videoUrl: 'https://www.youtube.com/embed/YRhxdVk_sIs',
        duration: 35
      }
    ]
  },
  {
    title: 'Data Science Bootcamp: Python & Pandas',
    subtitle: 'From zero coding to cleaning and analysis',
    description: 'Perfect course to master Python fundamentals, Pandas library, data wrangling, handling missing values, and plotting beautiful charts with Seaborn.',
    category: 'Data Science',
    level: 'Beginner',
    instructor: 'Marcus Aurelius',
    skills: ['Python', 'Pandas', 'Data Analysis', 'SQL'],
    tags: ['Data Science', 'Data', 'Python', 'Pandas', 'Visualization', 'Seaborn'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    lessons: [
      {
        title: 'Python for Data Analysis Fundamentals',
        content: 'Learn essential Python syntax: lists, dictionaries, functions, map-filter functions, and list comprehensions to deal with massive data datasets.',
        videoUrl: 'https://www.youtube.com/embed/r-uOLxNyf8A',
        duration: 15
      },
      {
        title: 'Mastering Pandas DataFrames',
        content: 'How to read CSVs, filter rows, group records, perform aggregations, handle null/missing values, and merge datasets with high performance.',
        videoUrl: 'https://www.youtube.com/embed/vmEHCJofhsg',
        duration: 25
      }
    ]
  },
  {
    title: 'SQL & Databases for Data Analytics',
    subtitle: 'Master complex queries, joins, and database designs',
    description: 'Learn SQL inside-out. Master complex JOINS, Window Functions, Subqueries, CTEs, and relational database schemas to serve analytical insights.',
    category: 'Data Science',
    level: 'Intermediate',
    instructor: 'Marcus Aurelius',
    skills: ['SQL', 'Databases', 'Data Analysis'],
    tags: ['Data Science', 'SQL', 'Databases', 'PostgreSQL', 'MySQL', 'Analytics'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop',
    lessons: [
      {
        title: 'Mastering SQL JOINS and Subqueries',
        content: 'Understand how to query multiple tables. Learn INNER, LEFT, RIGHT, and FULL outer joins, as well as correlated subqueries and CTE expressions.',
        videoUrl: 'https://www.youtube.com/embed/9yeEl15MCwM',
        duration: 20
      }
    ]
  },
  {
    title: 'Cybersecurity Fundamentals',
    subtitle: 'Protect networks, systems, and secure devices',
    description: 'Understand the basic concepts of cybersecurity: cryptography, CIA triad, firewalls, network scanning, VPNs, and securing personal devices.',
    category: 'Cybersecurity',
    level: 'Beginner',
    instructor: 'Robert C. Martin',
    skills: ['Network Security', 'Linux', 'Security'],
    tags: ['Cybersecurity', 'Security', 'Linux', 'Network', 'Crypto', 'Defense'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
    lessons: [
      {
        title: 'The CIA Triad & Basic Cryptography',
        content: 'Understand Confidentiality, Integrity, and Availability. Learn the difference between symmetric and asymmetric encryption, hashing, and signatures.',
        videoUrl: 'https://www.youtube.com/embed/U3cCo0yVf0c',
        duration: 15
      }
    ]
  },
  {
    title: 'Ethical Hacking & Penetration Testing',
    subtitle: 'Learn exploit research, scanning, and secure systems',
    description: 'Advanced course on pentesting. Work with Kali Linux, Metasploit, Nmap, Wireshark, SQL Injection, Cross-Site Scripting (XSS), and privilege escalation.',
    category: 'Cybersecurity',
    level: 'Advanced',
    instructor: 'Robert C. Martin',
    skills: ['Penetration Testing', 'Linux', 'Ethical Hacking', 'Security'],
    tags: ['Cybersecurity', 'Security', 'Hacking', 'Linux', 'Kali', 'Nmap', 'Exploit'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
    lessons: [
      {
        title: 'Information Gathering & Port Scanning with Nmap',
        content: 'Learn how to map network footprints. Discover active hosts, open ports, OS detection, and vulnerability scripting utilizing Nmap.',
        videoUrl: 'https://www.youtube.com/embed/4t76B8_Aupk',
        duration: 20
      },
      {
        title: 'OWASP Top 10 Web Vulnerabilities',
        content: 'Study SQL injection, Cross-Site Scripting (XSS), CSRF, broken access control, and how developers write secure code to mitigate them.',
        videoUrl: 'https://www.youtube.com/embed/mK9k2tS9cZg',
        duration: 28
      }
    ]
  }
];

exports.autoSeed = async () => {
  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      await Course.insertMany(defaultCourses);
      console.log('Database successfully seeded with default courses.');
    }
  } catch (err) {
    console.error('Error auto-seeding courses:', err);
  }
};

exports.seedCourses = async (req, res) => {
  try {
    await Course.deleteMany({});
    const courses = await Course.insertMany(defaultCourses);
    res.status(201).json({ message: 'Courses seeded successfully', count: courses.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error seeding database' });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (level) {
      query.level = level;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const courses = await Course.find(query);
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.createCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const course = await newCourse.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
