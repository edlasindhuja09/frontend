import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Calendar, User, Tag, MessageSquare, ArrowLeft, Paperclip } from 'lucide-react';

interface Comment {
    _id: string;
    text: string;
    authorId: string;
    authorName: string;
    authorType: 'admin' | 'sales';
    createdAt: string;
}

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
    comments: Comment[];
    schoolId?: string;
    schoolName?: string;
}

interface TaskDetailProps {
    userType: 'admin' | 'sales';
    userId: string;
    userName: string;
}

const TaskDetailPage: React.FC<TaskDetailProps> = ({ userType, userId, userName }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [status, setStatus] = useState<'completed' | 'in-progress' | 'pending'>('pending');

    // In TaskDetailPage.tsx, modify the useEffect:
useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const fetchTask = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`);
            const data = await response.json();
            setTask(data);
            setStatus(data.status);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching task:', error);
            setLoading(false);
        }
    };

    fetchTask();
    
    // Poll for updates every 5 seconds
    intervalId = setInterval(fetchTask, 5000);
    
    return () => clearInterval(intervalId);
}, [id]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !task) return;

        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${task._id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: newComment,
                    authorId: userId,
                    authorName: userName,
                    authorType: userType
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            const updatedTask = await response.json();
            setTask(updatedTask);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as 'completed' | 'in-progress' | 'pending';
        setStatus(newStatus);

        if (!task) return;

        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
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
            setTask(updatedTask);
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    if (loading) {
        return <div className="p-4">Loading task details...</div>;
    }

    if (!task) {
        return <div className="p-4">Task not found</div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
                <ArrowLeft size={18} />
                <span>Back to Tasks</span>
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{task.title}</h1>
                    <div className="flex gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(task.priority)}`}>
                            <Tag size={14} />
                            <span className="capitalize">{task.priority}</span>
                        </span>
                        {userType === 'sales' ? (
                            <select
                                value={status}
                                onChange={handleStatusChange}
                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(status)} border-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        ) : (
                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(task.status)}`}>
                                <CheckCircle size={14} />
                                <span className="capitalize">{task.status.replace('-', ' ')}</span>
                            </span>
                        )}
                    </div>
                </div>

                {task.schoolName && (
                    <div className="mb-4">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                            {task.schoolName}
                        </span>
                    </div>
                )}

                <p className="text-gray-600 dark:text-gray-300 mb-6">{task.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-500 dark:text-gray-400" />
                        <span>Assigned by {task.assignedBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-500 dark:text-gray-400" />
                        <span>Assigned to {task.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                        <span>Assigned: {formatDate(task.assignedDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-500 dark:text-gray-400" />
                        <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                </div>

                {task.attachments && task.attachments.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attachments:</h3>
                        <div className="flex flex-wrap gap-2">
                            {task.attachments.map((attachment, index) => (
                                <a
                                    key={index}
                                    href={`http://localhost:5000${attachment.url}`}
                                    download={attachment.name}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                >
                                    <Paperclip size={16} />
                                    <span className="text-sm">{attachment.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Comments</h2>

                <div className="space-y-4 mb-6">
                    {task.comments.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No comments yet</p>
                    ) : (
                        task.comments.map((comment) => (
                            <div
                                key={comment._id}
                                className={`p-4 rounded-lg ${comment.authorType === userType ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-gray-50 dark:bg-gray-700'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-medium text-gray-800 dark:text-gray-200">
                                        {comment.authorName} <span className="text-xs text-gray-500 dark:text-gray-400">({comment.authorType})</span>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDateTime(comment.createdAt)}
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={handleAddComment} className="mt-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Type your comment here..."
                        rows={3}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Post Comment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskDetailPage;