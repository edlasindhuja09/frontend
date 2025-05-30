export interface Task {
    id: string;
    title: string;
    description: string;
    assignedBy: string;
    assignedTo: string;
    assignedToName?: string; // For display purposes
    assignedDate: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in-progress' | 'completed';
    attachment?: File | null;
    attachmentName?: string;
    attachmentUrl?: string; // URL from server
}

export interface User {
    id: string;
    name: string;
    email: string;
    userType: 'student' | 'school' | 'admin' | 'sales';
}