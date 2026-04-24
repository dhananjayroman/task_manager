import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (token) {
      fetchTasks(token);
    }
  }, [navigate]);

  const fetchTasks = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const token = localStorage.getItem('token');
    setActionLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/tasks',
        { title: newTitle, description: newDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([response.data, ...tasks]);
      setNewTitle('');
      setNewDesc('');
    } catch (err) {
      alert('Failed to add task');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem('token');
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600 tracking-tight">TaskFlow</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 hidden sm:block">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-gray-700 hover:text-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">My Tasks</h2>
          <p className="text-gray-500 mt-2">Welcome back, {user?.name}. You have {tasks.length} tasks.</p>
        </header>

        {/* Add Task Form */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10 transition-all hover:shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Task</h3>
          <form onSubmit={handleAddTask} className="space-y-4">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
            <textarea
              placeholder="Add some details..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none h-24"
            />
            <button
              type="submit"
              disabled={actionLoading}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${actionLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 hover:shadow-blue-200 active:scale-[0.98]'}`}
            >
              {actionLoading ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        </section>

        {/* Task List */}
        <section className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-400 font-medium">Your task list is empty</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className={`group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-blue-100 hover:shadow-md ${task.status === 'Completed' ? 'opacity-75' : ''}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className={`text-lg font-bold transition-all ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {task.title}
                    </h4>
                    <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md ${task.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                      {task.status}
                    </span>
                  </div>
                  {task.description && (
                    <p className={`text-sm mt-1 leading-relaxed ${task.status === 'Completed' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => toggleStatus(task.id, task.status)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all border ${task.status === 'Completed' ? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100' : 'bg-white text-blue-600 border-blue-100 hover:bg-blue-50 hover:border-blue-200'}`}
                  >
                    {task.status === 'Completed' ? 'Reopen' : 'Complete'}
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
