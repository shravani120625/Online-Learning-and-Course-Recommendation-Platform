# EduSphere | Course Recommendation Platform (MERN Stack)

EduSphere is a full-stack learning management platform designed with a high-fidelity **Cyberpunk Neon aesthetic**. It is built on the **MERN Stack** (React.js, Node.js/Express, MongoDB/Mongoose, JWT) and features an integrated recommendation engine that computes interests tag overlap, identifies student skill gaps, and suggests courses enrolled by similar peers.

---

## 📖 Project Overview & Problem Statement

MOOCs, corporate training platforms, and universities frequently struggle with course completion rates, which often drop below 10%. Learners get overwhelmed by massive course directories and are left uncertain about what course to take next.

EduSphere solves this problem by combining an interactive LMS with a custom multi-factor recommendation engine. By analyzing student interest tags selected on registration, acquired skills, and peer enrollment statistics, the system:
1. Suggests personalized course recommendations (Neural Reco Matrix).
2. Performs real-time **Skill-Gap Analysis** comparing student skills against pathway goals.
3. Showcases syllabus completion percentages using SVG circular progress indicators.
4. Allows students to complete quizzes and instantly unlock glowing skill badges, adding them to their profile in real-time.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React.js 18 (Vite SPA), React Router v6, Tailwind CSS, Lucide Icons
- **Backend API**: Node.js, Express, Mongoose, JWT (JSON Web Tokens), bcryptjs
- **Database**: MongoDB (Local or Atlas)
- **Theme**: Cyberpunk Neon (custom glows, scanlines, Orbitron, and Outfit typography)

```text
       ┌───────────────────────────────┐
       │     React.js Client (:3000)   │
       └──────────────┬────────────────┘
                      │
                      │ API proxy / HTTP
                      ▼
       ┌───────────────────────────────┐
       │     Express.js API (:5000)    │
       └──────────────┬────────────────┘
                      │
                      ▼
       ┌───────────────────────────────┐
       │     MongoDB Database (:27017) │
       └───────────────────────────────┘
```

---

## 📂 Folder Structure

```text
online-course-tracking/
│
├── client/                     # Vite + React.js Frontend Client (Port 3000)
│   ├── src/
│   │   ├── components/         # Shared navbar and route protection widgets
│   │   ├── context/            # AuthContext (JWT management & session sync)
│   │   ├── pages/              # Cyberpunk views: Login, Register, Dashboard HUD, Catalog, Syllabus, Classroom
│   │   └── index.css           # Global custom neon glow classes & scanline styles
│   │
│   ├── tailwind.config.js      # Custom theme colors and matrix shadows
│   └── vite.config.js          # Port 5173 config and proxy targeting port 5000
│
├── server/                     # Node.js + Express API Backend (Port 5000)
│   ├── config/                 # DB connector file
│   ├── controllers/            # Auth, course catalogs, enrollments progress, and reco algorithms
│   ├── middleware/             # JWT session guards
│   ├── models/                 # Mongoose schemas for User, Course, Enrollment, Progress
│   ├── routes/                 # Express API routes
│   └── server.js               # Entry point, boots listeners & seeds default courses
│
├── package.json                # Root coordinator for running concurrently
└── README.md                   # Project documentation
```

---

## 🔌 API Reference Endpoints

### 🔐 Express API (`:5000/api`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Register student, save password hash, and log interests/skills | No |
| **POST** | `/auth/login` | Validate email/password and return JWT token | No |
| **GET** | `/auth/profile` | Retrieve student profile details & progress logs | Yes |
| **GET** | `/courses` | Search courses or filter by category & level | Yes |
| **GET** | `/courses/:id` | Fetch specific course description and lessons | Yes |
| **POST** | `/enrollments/enroll` | Enroll student in a target path | Yes |
| **GET** | `/enrollments/my` | Get all enrollments for logged-in student | Yes |
| **GET** | `/enrollments/course/:courseId` | Fetch syllabus details with user specific progress | Yes |
| **POST** | `/enrollments/progress` | Mark lesson as completed or active | Yes |
| **GET** | `/enrollments/quiz/:courseId` | Retrieve exam MCQ question list for a course | Yes |
| **POST** | `/enrollments/quiz` | Grade quiz, update status, and add skills to user | Yes |
| **GET** | `/recommendations/user` | Fetch personalized neural recommendation list | Yes |
| **GET** | `/recommendations/similar/:courseId` | Get similar courses by tags and category | No |
| **GET** | `/recommendations/skillgap` | Get remedial courses that address student skill gaps | Yes |

---

## 🤖 Smart Recommendation Logic

The recommendation engine is built in native JavaScript inside Mongoose controllers:
1. **Interest Tag Overlap**: Cross-references user selected interests against course tags. Points are added for matching keywords.
2. **Skill-Gap Coverage**: Evaluates course syllabus objectives. Priority weight is given to courses offering skills the student lacks in their profile.
3. **Peer Collaborative Filtering**: Scans MongoDB enrollments to identify courses taken by other users with overlapping enrollment histories (co-occurrence tracking).
4. **Weighted Confidence score**: Integrates interests, gaps, and peer counts to output a personalized Match % (e.g. `95% MATCH`) and detailed matching logic reasons.

---

## 🛠️ Run & Install Guide (Zero Config)

Ensure you have a local instance of MongoDB running (default port `27017`).

### 1. Install Workspace Dependencies
Run the install command from the root workspace:
```bash
npm run install-all
```
*(This installs root devDependencies, server node modules, and client packages).*

### 2. Startup Server and Client Concurrently
Launch the concurrent developer scripts:
```bash
npm run dev
```
- **React Client** runs on: `http://localhost:3000`
- **Express Backend API** runs on: `http://localhost:5000` (auto-seeds 8 courses into MongoDB on first boot).

---

## 📈 Learning Outcomes

- Crafted a unified MERN stack configuration running Express and Vite React concurrently.
- Implemented state persistence and route guards with JWT token authorization headers.
- Coded multi-factor recommendation calculations mapping interest tags, skill gaps, and peer co-occurrence directly in Mongoose.
- Developed glowing, responsive cyberpunk dashboard widgets with custom SVG progress arcs and terminal-styled assessment consoles.

## Author 

SHRAVANI HANDE

LinkedIn Link : https://www.linkedin.com/in/shravani-hande-a443ab331?utm_source=share_via&utm_content=profile&utm_medium=member_android

Github Link : https://github.com/shravani120625/Online-Learning-and-Course-Recommendation-Platform.git
