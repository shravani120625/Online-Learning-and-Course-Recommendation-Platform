import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Clock, User, Compass, HelpCircle, CheckCircle } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [similarCourses, setSimilarCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        let response;
        if (token) {
          response = await fetch(`/api/enrollments/course/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } else {
          response = await fetch(`/api/courses/${id}`);
        }

        if (response.ok) {
          const data = await response.json();
          if (token) {
            setCourse(data.course);
            setEnrollment(data.enrollment);
          } else {
            setCourse(data);
            setEnrollment(null);
          }
        }

        // Fetch similar courses
        const similarRes = await fetch(`/api/recommendations/similar/${id}`);
        if (similarRes.ok) {
          const similarData = await similarRes.json();
          setSimilarCourses(similarData);
        }
      } catch (err) {
        console.error('Error loading course details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, token]);

  const handleEnroll = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setIsEnrolling(true);
    try {
      const response = await fetch('/api/enrollments/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: id })
      });

      if (response.ok) {
        const data = await response.json();
        setEnrollment(data.enrollment);
        navigate(`/learn/${id}`);
      }
    } catch (err) {
      console.error('Enrollment error:', err);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center font-sans text-brand-400">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent mx-auto"></div>
          <div className="text-xs uppercase tracking-wider">Syncing course pathways...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans text-slate-500">
        The specified course is not found in registry.
      </div>
    );
  }

  const durationSum = course.lessons?.reduce((acc, l) => acc + l.duration, 0) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Main Course Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Descriptions & Syllabus */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-brand-450 font-bold uppercase tracking-widest">Registry Database Node</span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-lg font-semibold text-brand-350">
              {course.subtitle}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-sans py-3 border-y border-white/5">
              <div className="flex items-center space-x-1.5">
                <User className="w-4 h-4 text-brand-400" />
                <span>Instructor: <span className="text-slate-100 font-bold">{course.instructor}</span></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-brand-400" />
                <span>Syllabus: <span className="text-slate-100 font-bold">{course.lessons?.length || 0} modules</span></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-brand-400" />
                <span>Length: <span className="text-slate-100 font-bold">{durationSum} mins</span></span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 shadow-md">
            <h3 className="font-sans font-bold text-sm text-brand-300 tracking-wider uppercase">
              Course Overview
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
              {course.description}
            </p>
          </div>

          {/* Course lessons list */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-lg text-white tracking-tight uppercase">
              Curriculum Units
            </h3>
            <div className="border border-white/5 divide-y divide-white/5 rounded-2xl overflow-hidden shadow-md">
              {course.lessons?.map((lesson, idx) => (
                <div key={lesson._id} className="p-4 bg-slate-900/10 flex justify-between items-center text-sm">
                  <div className="space-y-1">
                    <div className="text-[10px] text-brand-400 font-mono font-bold uppercase">
                      Unit 0{idx + 1}
                    </div>
                    <div className="font-bold text-slate-200">
                      {lesson.title}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-bold">
                    {lesson.duration} MINS
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Actions Panel */}
        <div className="space-y-8">
          
          {/* Connection Board */}
          <div className="glass-panel p-6 rounded-2xl text-center space-y-6 border border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[10px] font-mono border-b border-l border-white/5 text-slate-500 px-3 py-1">
              Enroll Portal
            </div>

            <div className="space-y-2.5 pt-4">
              <Compass className="w-10 h-10 text-brand-400 mx-auto animate-pulse" />
              <div className="font-sans font-bold text-base tracking-wide text-white uppercase">
                {enrollment ? 'Connected to Path' : 'Pathway Synchronization'}
              </div>
              <p className="text-xs text-slate-500">
                {enrollment 
                  ? `Completed lessons: ${enrollment.completedLessons?.length || 0} / ${course.lessons?.length || 0}`
                  : 'Enroll in this course to save your progress and receive custom recommendations.'
                }
              </p>
            </div>

            <div>
              {enrollment ? (
                <Link 
                  to={`/learn/${course._id}`}
                  className="w-full inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold text-center text-xs py-3 rounded-lg shadow-md shadow-brand-600/15 transition-all"
                >
                  Go to Classroom Portal &gt;
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 rounded-lg shadow-lg shadow-brand-600/20 hover:scale-[1.01] transition-all"
                >
                  {isEnrolling ? 'Loading sync...' : 'Enroll in Course'}
                </button>
              )}
            </div>

            <div className="border-t border-white/5 pt-4 text-left font-mono text-[10px] text-slate-500 space-y-1">
              <div>&gt; Category: {course.category}</div>
              <div>&gt; Difficulty: {course.level}</div>
            </div>
          </div>

          {/* Target Skills */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-white/5 shadow-md">
            <h4 className="font-sans font-bold text-xs text-brand-300 tracking-wider uppercase">
              Target Skills Acquired
            </h4>
            <div className="space-y-3">
              {course.skills?.map((skill, sIdx) => (
                <div key={sIdx} className="flex items-center space-x-2.5 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Similar Courses Drawer */}
      {similarCourses.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-white/5">
          <h3 className="text-xl font-bold text-white tracking-tight">
            Similar Learning Pathways
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarCourses.map((simCourse) => (
              <div key={simCourse._id} className="glass-card p-5 rounded-2xl flex flex-col justify-between h-44 shadow-md border border-white/5">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-brand-300 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-full">
                    {simCourse.category}
                  </span>
                  <h4 className="font-bold text-sm text-white line-clamp-1 mt-2">
                    {simCourse.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {simCourse.subtitle}
                  </p>
                </div>
                <div className="text-right mt-2">
                  <Link 
                    to={`/course/${simCourse._id}`}
                    className="text-xs font-bold text-brand-400 hover:text-brand-300"
                  >
                    View Course &gt;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
