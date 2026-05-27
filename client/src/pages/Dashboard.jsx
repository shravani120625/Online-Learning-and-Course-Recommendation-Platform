import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Compass, ShieldCheck, Zap, Layers, Sparkles, BookMarked, Award } from 'lucide-react';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [skillGapRecs, setSkillGapRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch enrollments
        const enrollResponse = await fetch('/api/enrollments/my', { headers });
        let enrollData = [];
        if (enrollResponse.ok) {
          enrollData = await enrollResponse.json();
          setEnrollments(enrollData);
        }

        // Fetch user recommendations
        const recoResponse = await fetch('/api/recommendations/user', { headers });
        if (recoResponse.ok) {
          const recoData = await recoResponse.json();
          setRecommendations(recoData);
        }

        // Fetch skill gap recommendations
        const skillResponse = await fetch('/api/recommendations/skillgap', { headers });
        if (skillResponse.ok) {
          const skillData = await skillResponse.json();
          setSkillGapRecs(skillData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center font-sans text-brand-400">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent mx-auto"></div>
          <div className="text-sm font-semibold text-slate-350 tracking-wider">Syncing dashboard profiles...</div>
        </div>
      </div>
    );
  }

  const completedCoursesCount = enrollments.filter(e => e.status === 'Completed').length;
  const inProgressCount = enrollments.filter(e => e.status === 'Active').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 shadow-lg shadow-black/10">
        <div>
          <span className="text-[10px] font-mono text-brand-400 font-bold uppercase tracking-widest">User Pipeline Node Connected</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Welcome back, <span className="text-brand-300">{user?.name}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 font-medium">
            Interests: {user?.interests?.join(', ') || 'None selected'}
          </p>
        </div>
        <div className="flex space-x-6 bg-slate-900/40 p-4 rounded-xl border border-white/5 font-sans">
          <div className="text-center px-4">
            <div className="text-2xl font-extrabold text-brand-300">{enrollments.length}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Courses</div>
          </div>
          <div className="border-l border-white/5"></div>
          <div className="text-center px-4">
            <div className="text-2xl font-extrabold text-emerald-400">{completedCoursesCount}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Completed</div>
          </div>
          <div className="border-l border-white/5"></div>
          <div className="text-center px-4">
            <div className="text-2xl font-extrabold text-violet-400">{inProgressCount}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">In Progress</div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Enrolled Courses & Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Learning Pipeline */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <BookMarked className="w-5 h-5 text-brand-400" />
              <h2 className="font-sans font-bold text-lg text-white tracking-tight">Active Courses</h2>
            </div>

            {enrollments.length === 0 ? (
              <div className="glass-panel p-10 rounded-2xl text-center text-slate-400 space-y-4 shadow-inner">
                <Compass className="w-12 h-12 text-slate-650 mx-auto" />
                <p className="text-sm font-medium">You are not actively enrolled in any courses.</p>
                <Link 
                  to="/catalog" 
                  className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-md shadow-brand-600/20"
                >
                  Browse Course Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map((item) => {
                  const course = item.courseId;
                  if (!course) return null;
                  
                  const totalLessons = course.lessons?.length || 0;
                  const completedLessonsCount = item.completedLessons?.length || 0;
                  const completionPercentage = totalLessons > 0 
                    ? Math.round((completedLessonsCount / totalLessons) * 100) 
                    : 0;

                  // Circular Progress Specs
                  const radius = 24;
                  const circumference = 2 * Math.PI * radius;
                  const strokeOffset = circumference - (completionPercentage / 100) * circumference;

                  return (
                    <div key={item._id} className="glass-card p-6 rounded-2xl flex flex-col justify-between h-56 shadow-md border border-white/5">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-brand-300 bg-brand-500/10 border border-brand-500/25 px-2 py-0.5 rounded-full uppercase">
                            {course.category}
                          </span>
                          <h3 className="font-bold text-lg text-white mt-3 line-clamp-1">
                            {course.title}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium">
                            {course.instructor}
                          </p>
                        </div>

                        {/* Radial Circle */}
                        <div className="relative h-14 w-14 flex-shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle 
                              cx="28" cy="28" r={radius} 
                              className="stroke-slate-800 fill-none" 
                              strokeWidth="3.5"
                            />
                            <circle 
                              cx="28" cy="28" r={radius} 
                              className={`fill-none transition-all duration-550 ${
                                completionPercentage === 100 ? 'stroke-emerald-450' : 'stroke-brand-500'
                              }`} 
                              strokeWidth="3.5"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeOffset}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-[10px] font-bold text-slate-100">
                            {completionPercentage}%
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 flex items-center justify-between mt-4">
                        <div className="text-xs text-slate-400 font-medium">
                          Completed: <span className="text-slate-150 font-bold">{completedLessonsCount}/{totalLessons}</span> modules
                        </div>
                        <button 
                          onClick={() => navigate(`/learn/${course._id}`)}
                          className={`font-semibold text-xs py-2 px-4 rounded-lg border ${
                            completionPercentage === 100 
                              ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10' 
                              : 'border-brand-500/40 text-brand-300 hover:bg-brand-500/10'
                          } transition-all`}
                        >
                          {completionPercentage === 100 ? 'Review Lectures' : 'Resume Lectures'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Neural Recommendations */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-450" />
                <h2 className="font-sans font-bold text-lg text-white tracking-tight">Personalized Recommendations</h2>
              </div>
              <span className="text-[10px] font-mono bg-brand-500/10 border border-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-bold">
                Smart Match Engine
              </span>
            </div>

            {recommendations.length === 0 ? (
              <div className="glass-panel p-6 rounded-2xl text-center text-slate-500 font-medium text-sm shadow-inner">
                No personalized recommendations. Please update your profile interests tags.
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((reco) => (
                  <div key={reco.course._id} className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/5 shadow-md">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-[10px] text-brand-300 font-bold bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-full">
                          {reco.matchPercentage}% Match
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {reco.course.category} • {reco.course.level}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-white">
                        {reco.course.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-sans italic">
                        Why recommended: {reco.matchReason}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                      <div className="flex gap-1.5">
                        {reco.course.skills.slice(0, 2).map((skill, sIdx) => (
                          <span key={sIdx} className="text-[10px] bg-slate-900 border border-white/5 text-slate-400 px-2.5 py-0.5 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <Link 
                        to={`/course/${reco.course._id}`}
                        className="font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white rounded-lg py-2 px-4 shadow-md shadow-brand-600/15 transition-all"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Skill Diagnostics & Remedial paths */}
        <div className="space-y-8">
          
          {/* Skill Diagnostics */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-lg border border-white/5">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <Award className="w-5 h-5 text-brand-400" />
              <h2 className="font-sans font-bold text-sm tracking-widest text-white uppercase">Skill Diagnostics</h2>
            </div>
            
            <div className="space-y-3">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Acquired Skills ({user?.skills?.length || 0})</div>
              
              {(!user?.skills || user.skills.length === 0) ? (
                <div className="text-xs text-slate-500 border border-dashed border-slate-800 p-4 rounded-xl text-center">
                  No skills logged yet. Complete quizzes to earn skill credentials.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="text-xs font-semibold bg-brand-500/10 border border-brand-500/25 text-brand-300 px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-md shadow-brand-500/5 animate-pulse"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-lg border border-white/5">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <Layers className="w-5 h-5 text-brand-400" />
              <h2 className="font-sans font-bold text-sm tracking-widest text-white uppercase">Skill Gap Remedial</h2>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Missing competencies identified from your path and targeted remedy courses:
            </p>

            {skillGapRecs.length === 0 ? (
              <div className="text-xs text-slate-500 text-center border border-dashed border-slate-800 p-4 rounded-xl">
                All skill matrices matching your target tags are fully satisfied.
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                {skillGapRecs.map((gapItem, idx) => (
                  <div key={gapItem.course._id} className="border border-white/5 bg-slate-900/30 p-4 rounded-xl space-y-2.5">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-xs text-slate-200 line-clamp-1 flex-1">
                        {gapItem.course.title}
                      </h4>
                      <span className="text-[9px] bg-brand-500/15 border border-brand-500/30 text-brand-300 px-2 py-0.5 rounded-full font-bold ml-2">
                        Remedy
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Teaches Missing:</div>
                      <div className="flex flex-wrap gap-1">
                        {gapItem.gapsFilled.slice(0, 3).map((gapSkill, gIdx) => (
                          <span key={gIdx} className="text-[9px] text-brand-300 border border-brand-500/20 px-2 py-0.5 rounded bg-brand-500/5">
                            {gapSkill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <Link 
                        to={`/course/${gapItem.course._id}`}
                        className="inline-block text-xs font-semibold text-brand-400 hover:text-brand-350 transition-colors"
                      >
                        Enroll Pathway &gt;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
