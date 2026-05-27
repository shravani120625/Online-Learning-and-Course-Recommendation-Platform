import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Compass, BookOpen, Clock } from 'lucide-react';

const CATEGORIES = ['All', 'Web Development', 'Artificial Intelligence', 'Data Science', 'Cybersecurity'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const Catalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        let url = '/api/courses?';
        const params = [];
        
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (category !== 'All') params.push(`category=${encodeURIComponent(category)}`);
        if (level !== 'All') params.push(`level=${encodeURIComponent(level)}`);
        
        url += params.join('&');
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCourses();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [search, category, level]);

  const getLevelColor = (lvl) => {
    switch (lvl) {
      case 'Beginner': return 'text-sky-400 border-sky-500/20 bg-sky-500/5';
      case 'Intermediate': return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'Advanced': return 'text-rose-450 border-rose-500/20 bg-rose-500/5';
      default: return 'text-slate-400 border-slate-700 bg-slate-900';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header Banner */}
      <div className="space-y-2 border-b border-white/5 pb-6">
        <div className="flex items-center space-x-2 text-brand-400 font-mono text-xs tracking-wider uppercase">
          <Compass className="w-4 h-4" />
          <span>Browse Catalog Channels</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Learning Catalog
        </h1>
        <p className="text-sm text-slate-400">
          Search, query, and synchronize curriculum nodes directly.
        </p>
      </div>

      {/* Filters HUD */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
        
        {/* Search */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Search courses or keywords
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/40 border border-white/10 text-white pl-11 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all"
              placeholder="React, Python, Machine Learning, Pentesting..."
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Category Sector
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-500 text-sm appearance-none cursor-pointer"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
            ))}
          </select>
        </div>

        {/* Level Filter */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Clearance Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-500 text-sm appearance-none cursor-pointer"
          >
            {LEVELS.map(lvl => (
              <option key={lvl} value={lvl} className="bg-slate-900">{lvl}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-brand-400">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent mx-auto"></div>
            <div className="text-xs uppercase tracking-wider pt-2">Querying database pathways...</div>
          </div>
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center text-slate-500 font-sans text-sm border border-white/5">
          No courses matched your query parameters. Try widening filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="glass-card p-6 rounded-2xl flex flex-col justify-between h-[360px] shadow-md border border-white/5">
              
              <div className="space-y-3.5">
                {/* Meta headers */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-300 bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 rounded-full uppercase">
                    {course.category}
                  </span>
                  <span className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-full uppercase ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="font-sans font-bold text-lg text-white leading-snug line-clamp-2">
                  {course.title}
                </h3>
                
                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {course.description}
                </p>
              </div>

              {/* Bottom course sections */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                
                {/* Duration & Units */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                  <div className="flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{course.lessons?.length || 0} units</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {course.lessons?.reduce((acc, l) => acc + l.duration, 0) || 0} mins
                    </span>
                  </div>
                </div>

                {/* Tag Skills list */}
                <div className="flex flex-wrap gap-1.5 h-[22px] overflow-hidden">
                  {course.skills?.slice(0, 3).map((skill, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="text-[10px] bg-slate-900/60 border border-white/5 text-slate-400 px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {course.skills?.length > 3 && (
                    <span className="text-[10px] text-slate-500 px-1 font-semibold">+more</span>
                  )}
                </div>

                {/* Action button */}
                <Link 
                  to={`/course/${course._id}`}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-center py-2.5 rounded-lg shadow-md shadow-brand-600/10 transition-all text-xs flex items-center justify-center"
                >
                  View Details & Syllabus
                </Link>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
