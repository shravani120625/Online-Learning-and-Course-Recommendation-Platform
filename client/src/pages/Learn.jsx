import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, CheckSquare, Square, ChevronRight, Award, Play, ArrowLeft } from 'lucide-react';

const Learn = () => {
  const { courseId } = useParams();
  const { token, updateUserLocal } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  
  // Quiz states
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassroom = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/enrollments/course/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setCourse(data.course);
          setEnrollment(data.enrollment);
          
          if (!data.enrollment) {
            navigate(`/course/${courseId}`);
            return;
          }

          const lessons = data.course.lessons || [];
          const completedSet = new Set(data.enrollment.completedLessons || []);
          const firstIncomplete = lessons.find(l => !completedSet.has(l._id));
          
          setActiveLesson(firstIncomplete || lessons[0] || null);
        }
      } catch (err) {
        console.error('Error fetching classroom:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [courseId, token, navigate]);

  const handleLessonSelect = (lesson) => {
    setActiveLesson(lesson);
    setShowQuiz(false);
    setQuizResult(null);
  };

  const handleToggleProgress = async (lessonId) => {
    if (!enrollment || isUpdatingProgress) return;
    
    setIsUpdatingProgress(true);
    const isCompleted = enrollment.completedLessons.includes(lessonId);
    
    try {
      const response = await fetch('/api/enrollments/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          completed: !isCompleted
        })
      });

      if (response.ok) {
        const data = await response.json();
        setEnrollment(prev => ({
          ...prev,
          completedLessons: data.completedLessons
        }));
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const handleStartQuiz = async () => {
    try {
      const response = await fetch(`/api/enrollments/quiz/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setQuizQuestions(data);
        setQuizAnswers({});
        setQuizResult(null);
        setShowQuiz(true);
      }
    } catch (err) {
      console.error('Error loading quiz:', err);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    if (isSubmittingQuiz) return;

    setIsSubmittingQuiz(true);
    try {
      const response = await fetch('/api/enrollments/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId,
          answers: quizAnswers
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQuizResult(data);
        
        if (data.passed) {
          setEnrollment(prev => ({
            ...prev,
            status: 'Completed',
            quizPassed: true,
            quizScore: data.score
          }));

          const profileResponse = await fetch('/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            updateUserLocal(profileData);
          }
        }
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center font-sans text-brand-400">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent mx-auto"></div>
          <div className="text-xs uppercase tracking-wider">Synchronizing course nodes...</div>
        </div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans text-slate-500">
        Connection lost. Please synchronize connection.
      </div>
    );
  }

  const allLessonsCompleted = course.lessons?.every(l => 
    enrollment.completedLessons.includes(l._id)
  ) || false;

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col lg:flex-row bg-[#080c18]">

      {/* Sidebar navigation */}
      <aside className="w-full lg:w-80 bg-slate-900/30 border-r border-white/5 flex flex-col">
        
        {/* Course Syllabus header */}
        <div className="p-5 border-b border-white/5 space-y-3 bg-slate-950/20">
          <Link to="/" className="text-xs text-brand-400 hover:text-brand-300 flex items-center space-x-1 font-semibold transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h2 className="font-sans font-bold text-sm text-slate-200 leading-snug line-clamp-2 pt-1">
            {course.title}
          </h2>
          <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand-500 h-full transition-all duration-300"
              style={{ 
                width: `${Math.round((enrollment.completedLessons.length / course.lessons.length) * 100)}%` 
              }}
            ></div>
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between font-bold">
            <span>Modules Completed: {enrollment.completedLessons.length}/{course.lessons.length}</span>
            <span>{Math.round((enrollment.completedLessons.length / course.lessons.length) * 100)}%</span>
          </div>
        </div>

        {/* Lessons List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {course.lessons?.map((lesson, idx) => {
            const isCompleted = enrollment.completedLessons.includes(lesson._id);
            const isActive = activeLesson?._id === lesson._id && !showQuiz;

            return (
              <button
                key={lesson._id}
                onClick={() => handleLessonSelect(lesson)}
                className={`w-full p-4 text-left flex items-start space-x-3 transition-colors duration-150 ${
                  isActive 
                    ? 'bg-brand-500/10 border-l-2 border-brand-500' 
                    : 'hover:bg-slate-900/10 border-l-2 border-transparent'
                }`}
              >
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleProgress(lesson._id);
                  }}
                  className={`mt-0.5 flex-shrink-0 cursor-pointer transition-colors ${
                    isCompleted ? 'text-emerald-400' : 'text-slate-500 hover:text-brand-400'
                  }`}
                >
                  {isCompleted ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                </span>

                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-mono font-bold uppercase">
                    Module 0{idx + 1}
                  </div>
                  <div className={`text-xs font-semibold ${isActive ? 'text-brand-300 font-bold' : 'text-slate-350'}`}>
                    {lesson.title}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">
                    {lesson.duration} mins
                  </div>
                </div>
              </button>
            );
          })}

          {/* Quiz Button */}
          <button
            onClick={handleStartQuiz}
            disabled={!allLessonsCompleted && !enrollment.quizPassed}
            className={`w-full p-4 text-left flex items-start space-x-3 transition-colors ${
              showQuiz 
                ? 'bg-brand-500/15 border-l-2 border-brand-500' 
                : 'hover:bg-slate-900/10 border-l-2 border-transparent'
            } ${(!allLessonsCompleted && !enrollment.quizPassed) ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span className={`mt-0.5 ${enrollment.quizPassed ? 'text-emerald-400' : 'text-brand-400'}`}>
              <Award className="w-4 h-4" />
            </span>
            <div className="space-y-1 font-sans">
              <div className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Exam Node</div>
              <div className={`text-xs font-semibold ${showQuiz ? 'text-brand-300 font-bold' : 'text-slate-350'}`}>
                Final Assessment
              </div>
              <div className="text-[10px] text-slate-500 font-bold">
                {enrollment.quizPassed ? 'Status: Certified' : 'Status: Locked'}
              </div>
            </div>
          </button>
        </div>

      </aside>

      {/* Main Learning Frame */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto lg:h-[calc(100vh-64px)]">
        
        {!showQuiz && activeLesson ? (
          /* CLASSROOM UNIT VIEW */
          <div className="space-y-6 max-w-4xl">
            
            {/* Elegant glass video container */}
            <div className="video-container shadow-xl shadow-black/25 border border-white/5 rounded-2xl overflow-hidden">
              {activeLesson.videoUrl ? (
                <iframe 
                  src={activeLesson.videoUrl} 
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                /* Static placeholder */
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-4 space-y-3">
                  <Play className="w-14 h-14 text-slate-700 hover:text-brand-450 transition-colors cursor-pointer" />
                  <p className="text-xs text-slate-500 font-medium font-sans">Lecture stream placeholder. Click play to decrypt.</p>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4 gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {activeLesson.title}
                </h1>
                <p className="text-xs text-slate-500 font-semibold uppercase">
                  Lesson details • {activeLesson.duration} minutes
                </p>
              </div>

              <button
                onClick={() => handleToggleProgress(activeLesson._id)}
                className={`font-semibold text-xs py-2.5 px-5 rounded-lg border transition-all ${
                  enrollment.completedLessons.includes(activeLesson._id)
                    ? 'border-emerald-500/40 text-emerald-450 bg-emerald-500/5'
                    : 'border-brand-500/40 text-brand-300 hover:bg-brand-500/10'
                }`}
              >
                {enrollment.completedLessons.includes(activeLesson._id) ? (
                  <span className="flex items-center space-x-1.5">
                    <CheckSquare className="w-4 h-4" />
                    <span>Unit Completed</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1.5">
                    <Square className="w-4 h-4" />
                    <span>Mark Complete</span>
                  </span>
                )}
              </button>
            </div>

            {/* Text description details panel */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3 shadow-md">
              <div className="text-xs font-semibold text-brand-350 uppercase tracking-wider">Lecture content & exercises</div>
              <p className="text-sm text-slate-350 leading-relaxed whitespace-pre-line font-sans">
                {activeLesson.content}
              </p>
            </div>

          </div>
        ) : showQuiz ? (
          /* QUIZ EXAM SUBMISSION VIEW */
          <div className="max-w-2xl space-y-6">
            
            <div className="space-y-1.5">
              <span className="text-xs text-brand-400 font-bold uppercase tracking-wider">Exam Matrix Gateway</span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Final Assessment
              </h1>
              <p className="text-xs text-slate-400">
                Synchronize your curriculum skills. Complete the test scoring at least 60%.
              </p>
            </div>

            {/* Passed Status */}
            {enrollment.quizPassed && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl text-emerald-300 text-sm shadow-md">
                <div className="font-bold flex items-center space-x-1.5 text-emerald-250">
                  <CheckSquare className="w-5 h-5 animate-pulse" />
                  <span>Module Certified</span>
                </div>
                <p className="text-xs mt-2 text-slate-300">
                  Congratulations. You achieved a score of <span className="font-bold text-emerald-400">{enrollment.quizScore}%</span> on this track. Acquired skills have been appended to your profile tags.
                </p>
              </div>
            )}

            {/* Submit grades status banner */}
            {quizResult && !enrollment.quizPassed && (
              <div className={`p-5 rounded-2xl border ${
                quizResult.passed 
                  ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' 
                  : 'border-red-500/25 bg-red-500/10 text-red-300'
              } text-sm`}>
                <div className="font-bold uppercase tracking-wide">
                  {quizResult.passed ? 'Test Passed' : 'Test Failed'}
                </div>
                <div className="text-xs mt-1 text-slate-300">
                  Score obtained: <span className="font-bold">{quizResult.score}%</span> (Minimum required: 60%)
                </div>
                {quizResult.passed && quizResult.skillsEarned.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Earned Badges:</div>
                    <div className="flex flex-wrap gap-1">
                      {quizResult.skillsEarned.map((sk, sIdx) => (
                        <span key={sIdx} className="text-[9px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quiz Form */}
            {!enrollment.quizPassed && (
              <form onSubmit={handleSubmitQuiz} className="space-y-6">
                {quizQuestions.map((q, qIdx) => (
                  <div key={q.id} className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 shadow-md">
                    <div className="text-xs text-brand-400 font-mono font-bold uppercase">
                      Question 0{qIdx + 1}
                    </div>
                    <div className="font-bold text-slate-100 text-sm">
                      {q.question}
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      {q.options.map((opt, oIdx) => {
                        const isChecked = quizAnswers[q.id] === oIdx;
                        return (
                          <label 
                            key={oIdx}
                            onClick={() => handleSelectOption(q.id, oIdx)}
                            className={`flex items-center space-x-3 p-3 border rounded-xl text-xs font-medium cursor-pointer transition-all ${
                              isChecked 
                                ? 'bg-brand-500/10 border-brand-500 text-brand-300 shadow-md shadow-brand-500/5' 
                                : 'bg-slate-900/30 border-white/5 text-slate-450 hover:border-slate-700 hover:text-white'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name={`question-${q.id}`} 
                              checked={isChecked}
                              readOnly
                              className="sr-only"
                            />
                            <span className="h-4.5 w-4.5 rounded-full border border-brand-500/30 flex items-center justify-center font-bold">
                              {isChecked && <span className="h-2 w-2 rounded-full bg-brand-500"></span>}
                            </span>
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={isSubmittingQuiz || quizQuestions.length === 0}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center space-x-2"
                >
                  <span>{isSubmittingQuiz ? 'Evaluating answers...' : 'Submit Answers'}</span>
                </button>
              </form>
            )}

          </div>
        ) : (
          <div className="h-full flex items-center justify-center font-sans text-slate-500">
            Select a syllabus unit from the sidebar directory to load lecture materials.
          </div>
        )}

      </main>
    </div>
  );
};

export default Learn;
