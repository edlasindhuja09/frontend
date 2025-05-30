import { useState, useEffect } from 'react';
import { DifficultyType, ExamData, ExamSyllabusSection, ExamResource, ExamFAQ } from '../../pages/exams/types.ts';
import ExamCard from '../../components/exams/ExamCard.tsx';





const AlertBox: React.FC<{ message: string; type: 'success' | 'error' | 'question'; onConfirm?: (answer: boolean) => void }> = ({ message, type, onConfirm }) => {
    const baseStyle = 'px-4 py-3 rounded-lg shadow-md mb-4 w-full max-w-md mx-auto';
    const typeStyles = {
        success: 'bg-green-100 text-green-700 border border-green-400 mt-8 fixed top-12 left-1/2 transform -translate-x-1/2 z-50',
        error: 'bg-red-100 text-red-700 border border-red-400 mt-8 fixed top-12 left-1/2 transform -translate-x-1/2 z-50',
        question: 'bg-yellow-100 text-yellow-800 border border-yellow-500 mt-8 fixed top-12 left-1/2 transform -translate-x-1/2 z-50'
    };

    return (
        <div className={`${baseStyle} ${typeStyles[type]}`}>
            <p className="font-medium mb-2">{message}</p>
            {type === 'question' && onConfirm && (
                <div className="flex gap-4 justify-center">
                    <button onClick={() => onConfirm(true)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Yes</button>
                    <button onClick={() => onConfirm(false)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">No</button>
                </div>
            )}
        </div>
    );
};

const ExamManagement: React.FC = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [exams, setExams] = useState<ExamData[]>([]);
    const [currentExamId, setCurrentExamId] = useState<string | null>(null);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'question'; onConfirm?: (answer: boolean) => void } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ExamData>({
        id: '',
        title: '',
        subject: '',
        description: '',
        date: '',
        registrationDeadline: '',
        duration: '',
        difficulty: 'Easy',
        eligibility: '',
        fee: '',
        location: '',
        image: '',
        syllabus: [],
        resources: [],
        faqs: [],
        status: 'active',
        featured: false
    });

    useEffect(() => {
        fetchExams();
    }, []);
    
    const showAlert = (message: string, type: 'success' | 'error' | 'question', onConfirm?: (answer: boolean) => void) => {
        setAlert({ message, type, onConfirm });
        if (type !== 'question') {
            setTimeout(() => {
                setAlert(null);
            }, 3000);
        }
    };

    const fetchExams = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api/exams`);
            if (!response.ok) {
                throw new Error('Failed to fetch exams');
            }
            const data = await response.json();
            setExams(data);
        } catch (err) {
            console.error('Error fetching exams:', err);
            showAlert('Error fetching exams', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    image: reader.result as string
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddSyllabus = () => {
        setFormData({
            ...formData,
            syllabus: [...formData.syllabus, { title: '', topics: [] }]
        });
    };

    const handleAddResource = () => {
        setFormData({
            ...formData,
            resources: [...formData.resources, { title: '', items: [] }]
        });
    };

    const handleAddFAQ = () => {
        setFormData({
            ...formData,
            faqs: [...formData.faqs, { question: '', answer: '' }]
        });
    };

    const handleStatusToggle = async (examId: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${backendUrl}/api/exams/${examId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            const data = await response.json();
            
            // Optimistically update the local state
            setExams(prevExams =>
                prevExams.map(exam =>
                    exam.id === examId ? { ...exam, status: data.exam.status } : exam
                )
            );
        } catch (err) {
            console.error('Error updating status:', err);
            showAlert('Error updating status. Please try again.', 'error');
            // Revert by refetching the exams
            fetchExams();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveExam = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${backendUrl}/api/exams/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create exam');
            }

            const data = await response.json();
            
            showAlert('Exam created successfully!', 'success');
            
            // Refresh the exams list to include the new exam
            await fetchExams();
            setShowForm(false);
        } catch (err) {
            console.error('Error while saving the exam:', err);
            showAlert(err.message || 'Something went wrong. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteExam = async (examId: string) => {
        showAlert('Are you sure you want to delete this exam?', 'question', async (confirm) => {
            setAlert(null);
            if (confirm) {
                try {
                    setIsLoading(true);
                    const response = await fetch(`${backendUrl}/api/exams/${examId}`, { 
                        method: 'DELETE' 
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to delete exam');
                    }

                    // Optimistically update the local state
                    setExams(prev => prev.filter(exam => exam.id !== examId));
                    showAlert('Exam deleted successfully!', 'success');
                } catch (err) {
                    console.error('Delete error:', err);
                    showAlert(err.message || 'Something went wrong. Please try again.', 'error');
                    // Revert by refetching the exams
                    fetchExams();
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    const handleEditExam = (examId: string) => {
        const examToEdit = exams.find(exam => exam.id === examId);
        if (examToEdit) {
            setFormData(examToEdit);
            setCurrentExamId(examId);
            setIsEditing(true);
            setShowForm(true);
        }
    };

    const handleUpdateExam = async () => {
        if (!currentExamId) return;

        try {
            setIsLoading(true);
            const response = await fetch(`${backendUrl}/api/exams/${currentExamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update exam');
            }

            showAlert('Exam updated successfully!', 'success');
            
            // Refresh the exams list to get the updated data
            await fetchExams();
            setShowForm(false);
            setIsEditing(false);
            setCurrentExamId(null);
        } catch (err) {
            console.error('Update error:', err);
            showAlert(err.message || 'Failed to update exam', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveOrUpdateExam = () => {
        if (isEditing) {
            handleUpdateExam();
        } else {
            handleSaveExam();
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-50 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-8 md:py-12 lg:ml-[50px] lg:mr-[50px]">
            <h2 className="text-2xl font-bold text-education-dark mt-4">Exam Management</h2>
            {alert && <AlertBox {...alert} />}
            
            {/* Loading indicator */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p className="text-lg font-medium">Processing...</p>
                    </div>
                </div>
            )}

            {/* Exams List */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Active Exams</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {exams
                        .filter(exam => exam.status === 'active')
                        .map(exam => (
                            <ExamCard
                                key={`active-${exam.id}`}
                                {...exam}
                                isAdmin={true}
                                onEdit={handleEditExam}
                                onDelete={handleDeleteExam}
                                onStatusToggle={handleStatusToggle}
                            />
                        ))}
                </div>
            </div>
            
            {/* Inactive Exams Section */}
            <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">Inactive Exams</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {exams
                        .filter(exam => exam.status === 'inactive')
                        .map(exam => (
                            <ExamCard
                                key={`inactive-${exam.id}`}
                                {...exam}
                                isAdmin={true}
                                onEdit={handleEditExam}
                                onDelete={handleDeleteExam}
                                onStatusToggle={handleStatusToggle}
                            />
                        ))}
                </div>
            </div>

            {/* Floating Add Exam Button */}
            <button
                onClick={() => {
                    setShowForm(true);
                    setIsEditing(false);
                    setFormData({
                        id: '',
                        title: '',
                        subject: '',
                        description: '',
                        date: '',
                        registrationDeadline: '',
                        duration: '',
                        difficulty: 'Easy',
                        eligibility: '',
                        fee: '',
                        location: '',
                        image: '',
                        syllabus: [],
                        resources: [],
                        faqs: [],
                        status: 'active',
                        featured: false
                    });
                }}
                className="fixed bottom-6 right-6 md:top-20 md:right-6 bg-education-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 z-10 flex items-center"
                style={{ height: window.innerWidth >= 1024 ? '50px' : 'auto' }}
            >
                <span className="mr-1">+</span>
                <span className="hidden sm:inline">Add Exam</span>
            </button>

            {/* Modal Overlay */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center z-10">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{isEditing ? 'Edit Exam' : 'Create New Exam'}</h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 sm:p-6 space-y-6">
                            <form className="space-y-6">
                                {/* Basic Information Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title*</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleFormChange}
                                            placeholder="e.g., Final Mathematics Exam"
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject*</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleFormChange}
                                            placeholder="e.g., Mathematics"
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleFormChange}
                                            placeholder="Brief description about the exam..."
                                            rows={3}
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date*</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleFormChange}
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline*</label>
                                        <input
                                            type="date"
                                            name="registrationDeadline"
                                            value={formData.registrationDeadline}
                                            onChange={handleFormChange}
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration*</label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleFormChange}
                                            placeholder="e.g., 3 hours"
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level*</label>
                                        <select
                                            name="difficulty"
                                            value={formData.difficulty}
                                            onChange={handleFormChange}
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
                                        <input
                                            type="text"
                                            name="eligibility"
                                            value={formData.eligibility}
                                            onChange={handleFormChange}
                                            placeholder="e.g., Grade 10 and above"
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fee</label>
                                        <input
                                            type="text"
                                            name="fee"
                                            value={formData.fee}
                                            onChange={handleFormChange}
                                            placeholder="e.g., $50 or Free"
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleFormChange}
                                            placeholder="e.g., Online or Physical address"
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Image</label>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-lg file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-indigo-50 file:text-indigo-700
                                                hover:file:bg-indigo-100"
                                            />
                                            {formData.image && (
                                                <div className="mt-2 sm:mt-0 w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                                                    <img 
                                                        src={formData.image || "/placeholder.svg"} 
                                                        alt="Exam preview" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Syllabus Section */}
                                <div className="border-t border-gray-200 pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Syllabus</h3>
                                        <button
                                            type="button"
                                            onClick={handleAddSyllabus}
                                            className="flex items-center text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition"
                                        >
                                            <span>+ Add Section</span>
                                        </button>
                                    </div>
                                    {formData.syllabus.map((section, idx) => (
                                        <div key={`syllabus-${idx}`} className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 mb-3">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., Algebra"
                                                        value={section.title}
                                                        onChange={(e) => {
                                                            const updated = [...formData.syllabus];
                                                            updated[idx].title = e.target.value;
                                                            setFormData({ ...formData, syllabus: updated });
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Topics (comma separated)</label>
                                                    <textarea
                                                        placeholder="e.g., Linear equations, Quadratic equations"
                                                        value={section.topics.join(", ")}
                                                        onChange={(e) => {
                                                            const updated = [...formData.syllabus];
                                                            updated[idx].topics = e.target.value.split(",").map(t => t.trim());
                                                            setFormData({ ...formData, syllabus: updated });
                                                        }}
                                                        rows={2}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...formData.syllabus];
                                                    updated.splice(idx, 1);
                                                    setFormData({ ...formData, syllabus: updated });
                                                }}
                                                className="text-sm text-red-600 hover:text-red-800 flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove Section
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Resources Section */}
                                <div className="border-t border-gray-200 pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Resources</h3>
                                        <button
                                            type="button"
                                            onClick={handleAddResource}
                                            className="flex items-center text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition"
                                        >
                                            <span>+ Add Resource</span>
                                        </button>
                                    </div>
                                    {formData.resources.map((resource, idx) => (
                                        <div key={`resource-${idx}`} className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 mb-3">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., Recommended Books"
                                                        value={resource.title}
                                                        onChange={(e) => {
                                                            const updated = [...formData.resources];
                                                            updated[idx].title = e.target.value;
                                                            setFormData({ ...formData, resources: updated });
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Items (comma separated)</label>
                                                    <textarea
                                                        placeholder="e.g., Book A by Author X, Book B by Author Y"
                                                        value={resource.items.join(", ")}
                                                        onChange={(e) => {
                                                            const updated = [...formData.resources];
                                                            updated[idx].items = e.target.value.split(",").map(i => i.trim());
                                                            setFormData({ ...formData, resources: updated });
                                                        }}
                                                        rows={2}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...formData.resources];
                                                    updated.splice(idx, 1);
                                                    setFormData({ ...formData, resources: updated });
                                                }}
                                                className="text-sm text-red-600 hover:text-red-800 flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove Resource
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* FAQs Section */}
                                <div className="border-t border-gray-200 pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">FAQs</h3>
                                        <button
                                            type="button"
                                            onClick={handleAddFAQ}
                                            className="flex items-center text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition"
                                        >
                                            <span>+ Add FAQ</span>
                                        </button>
                                    </div>
                                    {formData.faqs.map((faq, idx) => (
                                        <div key={`faq-${idx}`} className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., What should I bring to the exam?"
                                                        value={faq.question}
                                                        onChange={(e) => {
                                                            const updated = [...formData.faqs];
                                                            updated[idx].question = e.target.value;
                                                            setFormData({ ...formData, faqs: updated });
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                                                    <textarea
                                                        placeholder="e.g., You should bring your student ID and calculator."
                                                        value={faq.answer}
                                                        onChange={(e) => {
                                                            const updated = [...formData.faqs];
                                                            updated[idx].answer = e.target.value;
                                                            setFormData({ ...formData, faqs: updated });
                                                        }}
                                                        rows={2}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...formData.faqs];
                                                    updated.splice(idx, 1);
                                                    setFormData({ ...formData, faqs: updated });
                                                }}
                                                className="text-sm text-red-600 hover:text-red-800 flex items-center mt-2"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove FAQ
                                            </button>
                                        </div>
                                    ))}
                                    <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Exam</label>
  <div className="flex items-center space-x-4">
    <label className="inline-flex items-center">
      <input
        type="radio"
        name="featured"
        checked={formData.featured === true}
        onChange={() => setFormData({...formData, featured: true})}
        className="form-radio h-4 w-4 text-indigo-600"
      />
      <span className="ml-2">Yes</span>
    </label>
    <label className="inline-flex items-center">
      <input
        type="radio"
        name="featured"
        checked={formData.featured === false}
        onChange={() => setFormData({...formData, featured: false})}
        className="form-radio h-4 w-4 text-indigo-600"
      />
      <span className="ml-2">No</span>
    </label>
  </div>
</div>
                                    
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveOrUpdateExam}
                                        className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                                    >
                                        Save Exam
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamManagement;