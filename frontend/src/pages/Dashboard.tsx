import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface DashboardStats {
  applications: number;
  tasks: number;
  completed: number;
  pending: number;
  resumesScanned?: number;
  averageScore?: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'submitted';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

interface Application {
  id: string;
  position: string;
  company: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

interface ResumeAnalysis {
  id: string;
  fileName: string;
  score: number;
  suggestions: string[];
  keywords: string[];
  missingSkills: string[];
  analyzedDate: string;
  status: 'analyzing' | 'completed' | 'failed';
  userId?: string;
  userName?: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'applications' | 'profile' | 'resume-ats' | 'ats-management'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  // Sample data - replace with actual API calls
  const [stats, setStats] = useState<DashboardStats>({
    applications: 8,
    tasks: 12,
    completed: 7,
    pending: 5,
    resumesScanned: user?.role === 'ADMIN' ? 45 : 3,
    averageScore: user?.role === 'ADMIN' ? 78 : 82
  });

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete React Tutorial',
      description: 'Build a todo app using React and TypeScript',
      status: 'in-progress',
      dueDate: '2024-03-15',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Database Design Project',
      description: 'Design and implement a user management system',
      status: 'pending',
      dueDate: '2024-03-20',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'API Integration',
      description: 'Integrate third-party APIs into the project',
      status: 'completed',
      dueDate: '2024-03-10',
      priority: 'high'
    }
  ]);

  const [applications] = useState<Application[]>([
    {
      id: '1',
      position: 'Frontend Developer',
      company: 'TechCorp',
      status: 'pending',
      appliedDate: '2024-03-01'
    },
    {
      id: '2',
      position: 'Full Stack Intern',
      company: 'StartupXYZ',
      status: 'approved',
      appliedDate: '2024-02-28'
    }
  ]);

  const [resumeAnalyses, setResumeAnalyses] = useState<ResumeAnalysis[]>([
    {
      id: '1',
      fileName: 'John_Doe_Resume.pdf',
      score: 82,
      suggestions: [
        'Add more technical skills',
        'Include quantifiable achievements',
        'Optimize for ATS keywords'
      ],
      keywords: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
      missingSkills: ['Docker', 'AWS', 'TypeScript'],
      analyzedDate: '2024-03-10',
      status: 'completed',
      userId: user?.role === 'ADMIN' ? 'user123' : undefined,
      userName: user?.role === 'ADMIN' ? 'John Doe' : undefined
    },
    {
      id: '2',
      fileName: 'Updated_Resume.pdf',
      score: 75,
      suggestions: [
        'Improve work experience descriptions',
        'Add more relevant keywords',
        'Format consistency needed'
      ],
      keywords: ['Python', 'Django', 'PostgreSQL'],
      missingSkills: ['React', 'Machine Learning', 'Cloud Computing'],
      analyzedDate: '2024-03-08',
      status: 'completed',
      userId: user?.role === 'ADMIN' ? 'user456' : undefined,
      userName: user?.role === 'ADMIN' ? 'Jane Smith' : undefined
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      // Simulate real-time stats updates
      setStats(prev => ({
        ...prev,
        resumesScanned: prev.resumesScanned! + Math.floor(Math.random() * 3),
        averageScore: Math.max(60, Math.min(95, prev.averageScore! + (Math.random() - 0.5) * 5))
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'approved': return 'bg-green-100 text-green-800';
      case 'in-progress': case 'pending': case 'analyzing': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    
    // Simulate analysis process
    const newAnalysis: ResumeAnalysis = {
      id: Date.now().toString(),
      fileName: file.name,
      score: 0,
      suggestions: [],
      keywords: [],
      missingSkills: [],
      analyzedDate: new Date().toISOString(),
      status: 'analyzing'
    };

    setResumeAnalyses(prev => [newAnalysis, ...prev]);

    // Simulate processing time
    setTimeout(() => {
      setResumeAnalyses(prev => prev.map(analysis => 
        analysis.id === newAnalysis.id 
          ? {
              ...analysis,
              score: Math.floor(Math.random() * 40) + 60, // 60-100
              suggestions: [
                'Optimize for ATS keywords',
                'Add more quantifiable achievements',
                'Improve technical skills section',
                'Enhance work experience descriptions'
              ].slice(0, Math.floor(Math.random() * 3) + 2),
              keywords: ['React', 'JavaScript', 'Python', 'SQL'].slice(0, Math.floor(Math.random() * 3) + 2),
              missingSkills: ['Docker', 'AWS', 'Machine Learning'].slice(0, Math.floor(Math.random() * 2) + 1),
              status: 'completed'
            }
          : analysis
      ));
      setIsAnalyzing(false);
    }, 3000);
  };

  const redirectToATSChecker = () => {
    
    window.open('https://resumind-jet.vercel.app/', '_blank');
  };

  if (!user) return null;

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'tasks', label: 'Tasks & Projects', icon: '📋' },
    { id: 'applications', label: 'Applications', icon: '📄' },
    user.role === 'INTERN' ? { id: 'resume-ats', label: 'Resume ATS Checker', icon: '🎯' } : null,
    user.role === 'ADMIN' ? { id: 'ats-management', label: 'ATS Management', icon: '⚙️' } : null,
    { id: 'profile', label: 'Profile', icon: '👤' }
  ].filter(Boolean) as Array<{ id: string; label: string; icon: string; }>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-thistle-400">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white p-2 rounded-lg shadow-lg text-puce-400"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Logo */}
          <div className="flex items-center justify-center h-20 border-b border-dark_moss_green-200">
            <h1 className="text-2xl font-bold text-cinnabar-400">InternKaksha</h1>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-dark_moss_green-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-puce-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {getInitials(user.name)}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-puce-100">{user.role}</p>
                {user.internshipRole && (
                  <p className="text-xs text-gray-500">{user.internshipRole}</p>
                )}
              </div>
            </div>
          </div>

          {/* Real-time toggle */}
          <div className="px-4 py-2 border-b border-dark_moss_green-200">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={realTimeUpdates}
                onChange={(e) => setRealTimeUpdates(e.target.checked)}
                className="mr-2 rounded"
              />
              Real-time Updates
              <span className={`ml-2 w-2 h-2 rounded-full ${realTimeUpdates ? 'bg-green-400' : 'bg-gray-400'}`} />
            </label>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <div className="px-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeTab === item.id
                      ? 'bg-puce-400 text-white'
                      : 'text-gray-600 hover:bg-cambridge_blue-50 hover:text-puce-400'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="px-4 mt-6 pt-6 border-t border-dark_moss_green-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                <span className="mr-3">🚪</span>
                Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-dark_moss_green-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-cinnabar-400 capitalize">
                  {activeTab === 'overview' ? `Welcome back, ${user.name.split(' ')[0]}!` : 
                   activeTab === 'resume-ats' ? 'Resume ATS Checker' :
                   activeTab === 'ats-management' ? 'ATS Management Dashboard' :
                   activeTab}
                </h2>
                <p className="text-sm text-puce-100 mt-1">
                  {activeTab === 'overview' && "Here's your internship progress"}
                  {activeTab === 'tasks' && "Manage your tasks and projects"}
                  {activeTab === 'applications' && "Track your applications"}
                  {activeTab === 'resume-ats' && "Optimize your resume for ATS systems"}
                  {activeTab === 'ats-management' && "Monitor all resume analyses and user progress"}
                  {activeTab === 'profile' && "Update your information"}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {realTimeUpdates && (
                  <div className="flex items-center text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    Live
                  </div>
                )}
                <button className="relative p-2 text-puce-400 hover:bg-cambridge_blue-50 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5-5 5h5zm0 0v-12" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-cinnabar-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Applications', value: stats.applications, icon: '📄', color: 'puce' },
                    { label: 'Total Tasks', value: stats.tasks, icon: '📋', color: 'cinnabar' },
                    { label: 'Completed', value: stats.completed, icon: '✅', color: 'cambridge_blue' },
                    { label: user.role === 'ADMIN' ? 'Resumes Scanned' : 'Resume Score', 
                      value: user.role === 'ADMIN' ? stats.resumesScanned : stats.averageScore, 
                      icon: '🎯', color: 'apricot' }
                  ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-xl p-6 border border-dark_moss_green-200 transform transition duration-200 hover:scale-105">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-puce-100">{stat.label}</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {stat.value}{user.role === 'INTERN' && index === 3 ? '%' : ''}
                          </p>
                        </div>
                        <div className="text-3xl">{stat.icon}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Tasks */}
                  <div className="bg-white rounded-xl shadow-xl p-6 border border-dark_moss_green-200">
                    <h3 className="text-lg font-semibold text-cinnabar-400 mb-4">Recent Tasks</h3>
                    <div className="space-y-4">
                      {tasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-cambridge_blue-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{task.title}</p>
                            <p className="text-sm text-puce-100">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resume Analysis Summary */}
                  <div className="bg-white rounded-xl shadow-xl p-6 border border-dark_moss_green-200">
                    <h3 className="text-lg font-semibold text-cinnabar-400 mb-4">
                      {user.role === 'ADMIN' ? 'Recent Resume Analyses' : 'Your Resume Analysis'}
                    </h3>
                    <div className="space-y-4">
                      {resumeAnalyses.slice(0, 3).map((analysis) => (
                        <div key={analysis.id} className="flex items-center justify-between p-3 bg-cambridge_blue-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{analysis.fileName}</p>
                            {user.role === 'ADMIN' && analysis.userName && (
                              <p className="text-sm text-puce-100">{analysis.userName}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(analysis.analyzedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(analysis.score)}`}>
                              {analysis.score}%
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                              {analysis.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resume-ats' && user.role === 'INTERN' && (
              <div className="space-y-6">
                {/* Quick Access to External ATS Checker */}
                <div className="bg-gradient-to-r from-puce-400 to-cinnabar-400 rounded-xl shadow-xl p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">Professional ATS Checker</h3>
                  <p className="mb-4">Get detailed analysis from our advanced ATS checking tool</p>
                  <button
                    onClick={redirectToATSChecker}
                    className="bg-white text-puce-400 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                  >
                    Open ATS Checker Tool →
                  </button>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-xl shadow-xl p-6 border border-dark_moss_green-200">
                  <h3 className="text-lg font-semibold text-cinnabar-400 mb-4">Quick Resume Analysis</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-upload"
                      disabled={isAnalyzing}
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <div className="text-6xl mb-4">📄</div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        {isAnalyzing ? 'Analyzing Resume...' : 'Upload Your Resume'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Supported formats: PDF, DOC, DOCX
                      </p>
                      {isAnalyzing && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-puce-400 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Analysis History */}
                <div className="bg-white rounded-xl shadow-xl p-6 border border-dark_moss_green-200">
                  <h3 className="text-lg font-semibold text-cinnabar-400 mb-4">Analysis History</h3>
                  <div className="space-y-4">
                    {resumeAnalyses.map((analysis) => (
                      <div key={analysis.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{analysis.fileName}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.score)}`}>
                              Score: {analysis.score}%
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                              {analysis.status}
                            </span>
                          </div>
                        </div>
                        
                        {analysis.status === 'completed' && (
                          <>
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Suggestions:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {analysis.suggestions.map((suggestion, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-puce-400 mr-2">•</span>
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-gray-700 mb-1">Found Keywords:</p>
                                <div className="flex flex-wrap gap-1">
                                  {analysis.keywords.map((keyword, idx) => (
                                    <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="font-medium text-gray-700 mb-1">Missing Skills:</p>
                                <div className="flex flex-wrap gap-1">
                                  {analysis.missingSkills.map((skill, idx) => (
                                    <span key={idx} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-3">
                          Analyzed: {new Date(analysis.analyzedDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ats-management' && user.role === 'ADMIN' && (
              <div className="space-y-6">
                {/* ATS Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Analyses', value: stats.resumesScanned, icon: '📊', change: '+12%' },
                    { label: 'Average Score', value: `${Math.round(stats.averageScore!)}%`, icon: '🎯', change: '+5%' },
                    { label: 'Active Users', value: 23, icon: '👥', change: '+8%' },
                    { label: 'This Week', value: 15, icon: '📅', change: '+25%' }
                  ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-xl p-6 border border-dark_moss_green-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-puce-100">{stat.label}</p>
                        <span className="text-2xl">{stat.icon}</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-green-600 mt-1">{stat.change} from last week</p>
                    </div>
                  ))}
                </div>

                {/* All Resume Analyses */}
                <div className="bg-white rounded-xl shadow-xl p-6 border border-dark_moss_green-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-cinnabar-400">All Resume Analyses</h3>
                    <div className="flex items-center space-x-4">
                      <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                        <option>All Status</option>
                        <option>Completed</option>
                        <option>Analyzing</option>
                        <option>Failed</option>
                      </select>
                      <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                        <option>All Users</option>
                        <option>High Scores (80+)</option>
                        <option>Low Scores (60-)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {resumeAnalyses.map((analysis) => (
                          <tr key={analysis.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-puce-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {analysis.userName ? getInitials(analysis.userName) : 'U'}
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {analysis.userName || 'Anonymous User'}
                                  </p>
                                  <p className="text-xs text-gray-500">{analysis.userId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{analysis.fileName}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.score)}`}>
                                  {analysis.score}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                                {analysis.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {new Date(analysis.analyzedDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                              <button className="text-puce-400 hover:text-cinnabar-400 mr-3">
                                View Details
                              </button>
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                Download
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Analytics Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-xl p-6 border border-dark_moss_green-200">
                    <h3 className="text-lg font-semibold text-cinnabar-400 mb-4">Score Distribution</h3>
                    <div className="space-y-3">
                      {[
                        { range: '90-100%', count: 5, color: 'bg-green-500' },
                        { range: '80-89%', count: 12, color: 'bg-blue-500' },
                        { range: '70-79%', count: 18, color: 'bg-yellow-500' },
                        { range: '60-69%', count: 8, color: 'bg-orange-500' },
                        { range: '0-59%', count: 2, color: 'bg-red-500' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-24 text-sm text-gray-600">{item.range}</div>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div 
                                className={`h-4 rounded-full ${item.color}`}
                                style={{ width: `${(item.count / 45) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-8 text-sm text-gray-600">{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-xl p-6 border border-dark_moss_green-200">
                    <h3 className="text-lg font-semibold text-cinnabar-400 mb-4">Common Issues</h3>
                    <div className="space-y-4">
                      {[
                        { issue: 'Missing technical keywords', frequency: 78, impact: 'High' },
                        { issue: 'Poor formatting for ATS', frequency: 65, impact: 'High' },
                        { issue: 'Lack of quantifiable achievements', frequency: 52, impact: 'Medium' },
                        { issue: 'Inconsistent date formats', frequency: 34, impact: 'Low' },
                        { issue: 'Missing contact information', frequency: 23, impact: 'High' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.issue}</p>
                            <p className="text-sm text-gray-500">{item.frequency}% of resumes</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.impact === 'High' ? 'bg-red-100 text-red-800' :
                            item.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.impact}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Real-time Activity Feed */}
                <div className="bg-white rounded-xl shadow-xl p-6 border border-dark_moss_green-200">
                  <h3 className="text-lg font-semibold text-cinnabar-400 mb-4">Real-time Activity</h3>
                  <div className="space-y-3">
                    {[
                      { user: 'John Doe', action: 'uploaded resume', time: '2 min ago', type: 'upload' },
                      { user: 'Jane Smith', action: 'completed analysis', score: 85, time: '5 min ago', type: 'completed' },
                      { user: 'Mike Johnson', action: 'started analysis', time: '8 min ago', type: 'started' },
                      { user: 'Sarah Wilson', action: 'downloaded report', time: '12 min ago', type: 'download' },
                      { user: 'Tom Brown', action: 'uploaded resume', time: '15 min ago', type: 'upload' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'upload' ? 'bg-blue-400' :
                          activity.type === 'completed' ? 'bg-green-400' :
                          activity.type === 'started' ? 'bg-yellow-400' :
                          'bg-gray-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                            {activity.score && <span className="text-puce-400"> (Score: {activity.score}%)</span>}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-cinnabar-400">Tasks & Projects</h3>
                  <button className="px-4 py-2 bg-puce-400 text-white rounded-lg hover:bg-cinnabar-200 transition duration-200">
                    + New Task
                  </button>
                </div>
                <div className="grid gap-6">
                  {tasks.map((task) => (
                    <div key={task.id} className="bg-white rounded-xl shadow-xl p-6 border border-dark_moss_green-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{task.title}</h4>
                          <p className="text-puce-100 mt-2">{task.description}</p>
                          <div className="flex items-center mt-4 space-x-4">
                            <span className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority} priority
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-cinnabar-400">My Applications</h3>
                  <button className="px-4 py-2 bg-puce-400 text-white rounded-lg hover:bg-cinnabar-200 transition duration-200">
                    + New Application
                  </button>
                </div>
                <div className="grid gap-6">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-white rounded-xl shadow-xl p-6 border border-dark_moss_green-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{app.position}</h4>
                          <p className="text-puce-100 text-lg">{app.company}</p>
                          <p className="text-sm text-gray-500 mt-2">Applied on: {new Date(app.appliedDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-xl p-8 border border-dark_moss_green-200">
                  <h3 className="text-xl font-semibold text-cinnabar-400 mb-6">Profile Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-20 h-20 bg-puce-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {getInitials(user.name)}
                      </div>
                      <div className="ml-6">
                        <h4 className="text-xl font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-puce-100">{user.email}</p>
                        <p className="text-gray-500">{user.role}</p>
                      </div>
                    </div>
                    
                    {user.role === 'INTERN' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-dark_moss_green-200">
                        <div>
                          <label className="block text-sm font-medium text-puce-100 mb-1">Internship Role</label>
                          <p className="text-gray-900">{user.internshipRole || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-puce-100 mb-1">Department</label>
                          <p className="text-gray-900">{user.department || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-puce-100 mb-1">Duration</label>
                          <p className="text-gray-900">{user.duration || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-puce-100 mb-1">Start Date</label>
                          <p className="text-gray-900">{user.startDate ? new Date(user.startDate).toLocaleDateString() : 'Not specified'}</p>
                        </div>
                      </div>
                    )}
                    
                    <button className="mt-6 px-6 py-3 bg-puce-400 text-white rounded-lg hover:bg-cinnabar-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-puce-300 transform transition duration-200 hover:scale-105">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard; 
// py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
//                           <th className="px-4