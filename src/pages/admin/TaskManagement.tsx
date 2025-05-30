import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Calendar, User, Tag, Plus, X, Edit, Trash2, Paperclip } from 'lucide-react';

interface Task {
    _id: string; // Changed from 'id' to '_id' to match MongoDB
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

interface SalesMember {
    _id: string;
    name: string;
    email: string;
}

interface TasksProps {
    userType: 'admin' | 'sales' | 'student' | 'school';
}

const TaskManagement: React.FC<TasksProps> = ({ userType }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [salesTeamMembers, setSalesTeamMembers] = useState<SalesMember[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [newTask, setNewTask] = useState<Omit<Task, '_id'>>({
        title: '',
        description: '',
        assignedBy: userType === 'admin' ? 'Admin' : '',
        assignedTo: '',
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        priority: 'medium',
        status: 'pending',
        attachments: []
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    useEffect(() => {
        fetchTasks();
        fetchSalesMembers();
    }, []);

   const fetchTasks = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/tasks`);
        const data = await response.json();
        setTasks(data);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

    const fetchSalesMembers = async () => {
        try {
            const response = await fetch(`${backendUrl}/admin/users?userType=sales`);
            const data = await response.json();
            if (Array.isArray(data.users)) {
                setSalesTeamMembers(data.users);
            } else {
                console.error('Expected an array of users but got:', data);
                setSalesTeamMembers([]);
            }
        } catch (err) {
            console.error('Failed to fetch sales members:', err);
            setSalesTeamMembers([]);
        }
    };
    
     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (editingTask) {
            setEditingTask({ ...editingTask, [name]: value });
        } else {
            setNewTask((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(files);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate required fields
        if (!newTask.assignedTo) {
            alert('Please select a team member to assign the task to');
            return;
        }

        const formData = new FormData();
        formData.append('title', newTask.title);
        formData.append('description', newTask.description);
        formData.append('assignedBy', newTask.assignedBy);
        formData.append('assignedTo', newTask.assignedTo);
        formData.append('assignedDate', newTask.assignedDate);
        formData.append('dueDate', newTask.dueDate);
        formData.append('priority', newTask.priority);
        formData.append('status', newTask.status);
        
        selectedFiles.forEach(file => {
            formData.append('attachments', file);
        });

        try {
            const response = await fetch(`${backendUrl}/api/tasks`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add task');
            }

            const addedTask = await response.json();
            setTasks([...tasks, addedTask]);
            setShowAddForm(false);
            setSelectedFiles([]);
            resetForm();
        } catch (error) {
            console.error('Error adding task:', error);
            alert(`Error adding task: ${error.message}`);
        }
    };

    const handleUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTask || !editingTask._id) return;

        const formData = new FormData();
        formData.append('title', editingTask.title);
        formData.append('description', editingTask.description);
        formData.append('assignedBy', editingTask.assignedBy);
        formData.append('assignedTo', editingTask.assignedTo);
        formData.append('assignedDate', editingTask.assignedDate);
        formData.append('dueDate', editingTask.dueDate);
        formData.append('priority', editingTask.priority);
        formData.append('status', editingTask.status);
        
        selectedFiles.forEach(file => {
            formData.append('attachments', file);
        });

        try {
            const response = await fetch(`${backendUrl}/api/tasks/${editingTask._id}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update task');
            }

            const updatedTask = await response.json();
            setTasks(tasks.map(task => task._id === editingTask._id ? updatedTask : task));
            setEditingTask(null);
            setSelectedFiles([]);
            resetForm();
        } catch (error) {
            console.error('Error updating task:', error);
            alert(`Error updating task: ${error.message}`);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!taskId) {
            console.error('No task ID provided for deletion');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Error deleting task. Please try again.');
        }
    };

    const handleRemoveAttachment = (taskId: string, attachmentIndex: number) => {
        setTasks(tasks.map(task => {
            if (task._id === taskId) {
                const updatedAttachments = [...(task.attachments || [])];
                updatedAttachments.splice(attachmentIndex, 1);
                return { ...task, attachments: updatedAttachments };
            }
            return task;
        }));
    };

    const handleTaskStatusChange = async (taskId: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as Task['status'];
        
        try {
            const response = await fetch(`${backendUrl}/api/tasks/${taskId}`, {
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

    const handleDownloadAttachment = async (url: string, filename: string) => {
        try {
            if (url.startsWith('/uploads/')) {
                const response = await fetch(`${backendUrl}${url}`);
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

    const resetForm = () => {
        setNewTask({
            title: '',
            description: '',
            assignedBy: userType === 'admin' ? 'Admin' : '',
            assignedTo: '',
            assignedDate: new Date().toISOString().split('T')[0],
            dueDate: '',
            priority: 'medium',
            status: 'pending',
            attachments: []
        });
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
            case 'pdf':
            return '📄';
            case 'doc':
            case 'docx':
            return '📝';
            case 'xls':
            case 'xlsx':
            return '📊';
            case 'csv':
            return '🗃️';
            case 'zip':
            case 'rar':
            return '🗄️';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            return '🖼️';
            default:
            return '📎';
        }
    };

    const filteredTasks = tasks.filter((task) => filter === 'all' || task.status === filter);


    return (
        <div className="relative min-h-screen bg-gray-50 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-8 md:py-12 lg:ml-[50px] lg:mr-[50px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Task Management</h1>
                {userType === 'admin' && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        <Plus size={18} />
                        <span>Add New Task</span>
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-2">
                {['all', 'pending', 'in-progress', 'completed'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as typeof filter)}
                        className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-sm md:text-base transition ${filter === f
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Add/Edit Task Modal */}
            {(showAddForm || editingTask) && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
                        onClick={() => {
                            setShowAddForm(false);
                            setEditingTask(null);
                            setSelectedFiles([]);
                        }}
                    ></div>

                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg mx-4 my-20 relative max-h-[calc(100vh-10rem)] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                marginTop: '5rem',
                                marginBottom: '2rem',
                                maxHeight: 'calc(100vh - 7rem)'
                            }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    {editingTask ? 'Edit Task' : 'Add New Task'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingTask(null);
                                        setSelectedFiles([]);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="space-y-4">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="title">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={editingTask ? editingTask.title : newTask.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={editingTask ? editingTask.description : newTask.description}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="assignedBy">
                                        Assigned By
                                    </label>
                                    <input
                                        type="text"
                                        id="assignedBy"
                                        name="assignedBy"
                                        value={editingTask ? editingTask.assignedBy : newTask.assignedBy}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="assignedTo">
                                        Assigned To
                                    </label>
                                    <select
                                        id="assignedTo"
                                        name="assignedTo"
                                        value={
                                            editingTask
                                                ? salesTeamMembers.find((member) => member._id === editingTask.assignedTo)?.name || editingTask.assignedTo
                                                : salesTeamMembers.find((member) => member._id === newTask.assignedTo)?.name || newTask.assignedTo
                                        }
                                        onChange={(e) => {
                                            const selectedName = e.target.value;
                                            const selectedMember = salesTeamMembers.find((member) => member.name === selectedName);
                                            const selectedId = selectedMember ? selectedMember._id : '';
                                            if (editingTask) {
                                                setEditingTask({ ...editingTask, assignedTo: selectedId });
                                            } else {
                                                setNewTask((prev) => ({ ...prev, assignedTo: selectedId }));
                                            }
                                        }}
                                        required
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select a sales member</option>
                                        {salesTeamMembers.map((member) => (
                                            <option key={member._id} value={member.name}>
                                                {member.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="assignedDate">
                                            Assigned Date
                                        </label>
                                        <input
                                            type="date"
                                            id="assignedDate"
                                            name="assignedDate"
                                            value={editingTask ? editingTask.assignedDate : newTask.assignedDate}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="dueDate">
                                            Due Date
                                        </label>
                                        <input
                                            type="date"
                                            id="dueDate"
                                            name="dueDate"
                                            value={editingTask ? editingTask.dueDate : newTask.dueDate}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="priority">
                                            Priority
                                        </label>
                                        <select
                                            id="priority"
                                            name="priority"
                                            value={editingTask ? editingTask.priority : newTask.priority}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </div>

                                    {userType === 'sales' && (
                                        <div>
                                            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="status">
                                                Status
                                            </label>
                                            <select
                                                id="status"
                                                name="status"
                                                value={editingTask ? editingTask.status : newTask.status}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                                        Attachments
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            multiple
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            <Paperclip size={16} />
                                            <span>Add Files</span>
                                        </button>
                                        {selectedFiles.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Selected files:</p>
                                                <ul className="space-y-1">
                                                    {selectedFiles.map((file, index) => (
                                                        <li key={index} className="flex items-center gap-2 text-sm">
                                                            <span>{getFileIcon(file.type.split('/')[1] || 'file')}</span>
                                                            <span className="truncate">{file.name}</span>
                                                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {editingTask?.attachments && editingTask.attachments.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current attachments:</p>
                                                <ul className="space-y-1">
                                                    {editingTask.attachments.map((attachment, index) => (
                                                        <li key={index} className="flex items-center justify-between gap-2 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <span>{getFileIcon(attachment.type)}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDownloadAttachment(attachment.url, attachment.name)}
                                                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                                                >
                                                                    {attachment.name}
                                                                </button>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveAttachment(editingTask._id, index)}
                                                                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setEditingTask(null);
                                            setSelectedFiles([]);
                                        }}
                                        className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                                    >
                                        {editingTask ? 'Update Task' : 'Add Task'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}

            {/* Tasks List */}
            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No tasks found matching your criteria.</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
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
                                    <User size={16} className="text-gray-500 dark:text-gray-400" />
                                    <span>
                                        Assigned to {
                                            salesTeamMembers.find(member => member._id === task.assignedTo)?.name || 'Unknown'
                                        }
                                    </span>
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
                                {userType === 'sales' && (
                                    <div className="w-full md:w-auto">
                                        <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-300">Update Status</label>
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleTaskStatusChange(task._id, e)}
                                            className="w-full md:w-auto border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                )}

                                {userType === 'admin' && (
                                    <div className="flex gap-2 ml-auto">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingTask(task);
                                                setSelectedFiles([]);
                                            }}
                                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition dark:hover:bg-blue-900 dark:text-blue-400"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTask(task._id);
                                            }}
                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition dark:hover:bg-red-900 dark:text-red-400"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskManagement;


