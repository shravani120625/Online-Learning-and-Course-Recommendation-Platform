import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Sliders, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

const INTERESTS_OPTIONS = [
  'Web Development',
  'Artificial Intelligence',
  'Data Science',
  'Cybersecurity',
  'React',
  'Express',
  'Node',
  'Python',
  'Machine Learning',
  'Deep Learning',
  'Pandas',
  'SQL',
  'Ethical Hacking',
  'Network Security'
];

const SKILLS_OPTIONS = [
  'JavaScript',
  'HTML',
  'CSS',
  'Python',
  'SQL',
  'Linux',
  'Git'
];

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const toggleInterest = (tag) => {
    setSelectedInterests(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleSkill = (tag) => {
    setSelectedSkills(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setFormError('');
    if (!name || !email || !password) {
      setFormError('Please fill out all credentials to proceed.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      await register(name, email, password, selectedInterests, selectedSkills);
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Registration failed. Network error.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass-card p-8 rounded-2xl shadow-2xl relative border border-white/5">
        
        <div className="space-y-2 mb-8">
          <div className="flex justify-between items-center text-xs font-mono text-slate-500 font-bold uppercase tracking-widest">
            <span>Onboarding Gateway</span>
            <span>Step {step} of 2</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Get Started
          </h1>
          <p className="text-sm text-slate-400">
            {step === 1 
              ? 'Initialize your student credentials.' 
              : 'Select your learning interests and current skills for personalized recommendations.'
            }
          </p>
        </div>

        {formError && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start space-x-2.5 text-red-300 text-sm mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-red-200">Registration Error</div>
              <div className="text-xs text-red-300/80 mt-0.5">{formError}</div>
            </div>
          </div>
        )}

        {step === 1 ? (
          /* STEP 1: CREDENTIALS */
          <form onSubmit={handleNextStep} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/40 border border-white/10 text-white pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all"
                  placeholder="Alex Stone"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/40 border border-white/10 text-white pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all"
                  placeholder="operator@nexus.net"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/40 border border-white/10 text-white pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all"
                  placeholder="Min 6 characters"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
            >
              <span>Continue Onboarding</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* STEP 2: PROFILE INTEREST TAGS */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Interests tag list */}
            <div className="space-y-3">
              <div className="flex items-center space-x-1.5 text-brand-400 font-semibold text-sm">
                <Sliders className="w-4 h-4" />
                <label className="block text-xs font-bold text-slate-350 uppercase tracking-wider">
                  Target Interests (Customize Recommendations)
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {INTERESTS_OPTIONS.map((tag) => {
                  const isSelected = selectedInterests.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleInterest(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                        isSelected 
                          ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/20' 
                          : 'bg-slate-900/40 border-slate-700/60 text-slate-400 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current skills list */}
            <div className="space-y-3">
              <div className="flex items-center space-x-1.5 text-brand-400 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <label className="block text-xs font-bold text-slate-350 uppercase tracking-wider">
                  Select Existing Skills
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {SKILLS_OPTIONS.map((tag) => {
                  const isSelected = selectedSkills.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleSkill(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                        isSelected 
                          ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/20' 
                          : 'bg-slate-900/40 border-slate-700/60 text-slate-400 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-4 pt-2">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 border border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white font-bold text-sm rounded-lg transition-all py-3"
              >
                Back
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Registering...' : 'Complete Signup'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer Link */}
        <div className="text-center border-t border-slate-900 mt-8 pt-6">
          <p className="text-xs text-slate-400">
            Already have a profile?{' '}
            <Link 
              to="/login" 
              className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
