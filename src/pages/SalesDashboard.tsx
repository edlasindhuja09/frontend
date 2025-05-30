import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Calendar, User, Tag, Paperclip } from 'lucide-react';

interface Task {
    _id: string;
    title: string;
    description: string;
    assignedBy: string;
    assignedTo: string;
    assignedDate: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    status: 'completed' | 'in-progress' | 'pending';
    attachments?: {
        name: string;
        url: string;
        type: string;
    }[];
    schoolId?: string;
    schoolName?: string;
}

interface SalesUser {
    _id: string;
    name: string;
    email: string;
    phoneNo: string;
    userType: string;
}

interface SalesDashboardProps {
    userId?: string;  // Made optional
}

const SalesDashboard: React.FC<SalesDashboardProps> = ({ userId: propUserId }) => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string>(propUserId || localStorage.getItem('userId') || '');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
    const [salesUser, setSalesUser] = useState<SalesUser | null>(null);
    const [userName, setUserName] = useState('');
    const [userLoading, setUserLoading] = useState<boolean>(true);

    useEffect(() => {
        const name = localStorage.getItem('userName');
        const storedUserId = localStorage.getItem('userId');
        
        if (name) {
            setUserName(name);
        }
        
        if (!propUserId && storedUserId) {
            setUserId(storedUserId);
        }
    }, [propUserId]);

    useEffect(() => {
        if (userId) {
            fetchSalesUser();
            fetchTasks();
        }
    }, [userId]);

    const fetchSalesUser = async () => {
        if (!userId) {
            console.error('Cannot fetch user - no ID available');
            return;
        }

        try {
            setUserLoading(true);
            const response = await fetch(`http://localhost:5000/api/users/${userId}`);
            
            if (!response.ok) {
                throw new Error(response.status === 404 
                    ? 'User not found' 
                    : `Failed to fetch user data: ${response.statusText}`);
            }

            const data = await response.json();
            setSalesUser(data);
        } catch (error) {
            console.error('Error fetching sales user:', error);
        } finally {
            setUserLoading(false);
        }
    };

    const fetchTasks = async () => {
        if (!userId) {
            console.error('Cannot fetch tasks - no user ID available');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/tasks?assignedTo=${userId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskStatusChange = async (taskId: string, newStatus: Task['status']) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update task status');
            }

            const updatedTask = await response.json();
            setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'medium':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf': return '📄';
            case 'doc': case 'docx': return '📝';
            case 'xls': case 'xlsx': return '📊';
            case 'csv': return '🗃️';
            case 'zip': case 'rar': return '🗄️';
            case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️';
            default: return '📎';
        }
    };

    const handleDownloadAttachment = async (url: string, filename: string) => {
        try {
            if (url.startsWith('/uploads/')) {
                const response = await fetch(`http://localhost:5000${url}`);
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(downloadUrl);
            } else {
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const filteredTasks = tasks.filter((task) => filter === 'all' || task.status === filter);

    // Loading and error states
    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-red-600">User not authenticated</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-8 md:py-12">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                        Welcome, {userName || 'User'}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {salesUser?.email ? `(${salesUser.email})` : 'Here are your current tasks'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                        Sales Dashboard
                    </span>
                </div>
            </div>

            {/* Tasks Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Tasks</h2>
                    <div className="flex gap-2">
                        {['all', 'pending', 'in-progress', 'completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as typeof filter)}
                                className={`px-3 py-1 rounded-full text-sm transition ${filter === f
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No tasks assigned to you.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTasks.map((task) => (
                            <div
                                key={task._id}
                                className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800"
                            >
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-1">{task.title}</h3>
                                        {task.schoolName && (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2 dark:bg-blue-900 dark:text-blue-200">
                                                {task.schoolName}
                                            </span>
                                        )}
                                        <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(task.priority)}`}>
                                            <Tag size={14} />
                                            <span className="capitalize">{task.priority}</span>
                                        </span>
                                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(task.status)}`}>
                                            <CheckCircle size={14} />
                                            <span className="capitalize">{task.status.replace('-', ' ')}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-gray-500 dark:text-gray-400" />
                                        <span>Assigned by {task.assignedBy}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                                        <span>{formatDate(task.assignedDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gray-500 dark:text-gray-400" />
                                        <span>Due: {formatDate(task.dueDate)}</span>
                                    </div>
                                </div>

                                {task.attachments && task.attachments.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attachments:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {task.attachments.map((attachment, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleDownloadAttachment(attachment.url, attachment.name)}
                                                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
                                                >
                                                    <span>{getFileIcon(attachment.type)}</span>
                                                    <span className="text-sm">{attachment.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="w-full">
                                        <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-300">Update Status</label>
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleTaskStatusChange(task._id, e.target.value as Task['status'])}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesDashboard;