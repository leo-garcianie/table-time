import { useState, useMemo } from 'react';
import { generateCalendarDays } from '../utils/helpers';

export const useCalendar = (initialDate = new Date()) => {
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const calendarDays = useMemo(() => {
        return generateCalendarDays(year, month);
    }, [year, month]);

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    };

    const isToday = (date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const isCurrentMonth = (date) => {
        return date.getMonth() === month;
    };

    const isSelected = (date) => {
        if (!selectedDate) return false;
        return (
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
        );
    };

    return {
        currentDate,
        selectedDate,
        calendarDays,
        year,
        month,
        goToNextMonth,
        goToPreviousMonth,
        goToToday,
        setSelectedDate,
        isToday,
        isCurrentMonth,
        isSelected,
    };
};
