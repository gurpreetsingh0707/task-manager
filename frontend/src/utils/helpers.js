import { format, isPast } from 'date-fns';

export const formatDate = (date) => {
    if (!date) return 'No deadline';
    return format(new Date(date), 'dd MMM yyyy');
};

export const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'done') return false;
    return isPast(new Date(dueDate));
};

export const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);