export const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export const formatDateWeek = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
};

export const formatDateForAPI = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
};

export const isDateInPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
};

export const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || days.length < 42) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return days;
};

export const getTableTypeColor = (type) => {
    const colors = {
        Window: "bg-[#B2FAE8] text-[#13A08D]",
        Center: "bg-[#FFF0CF] text-[#D2A661]",
        Terrace: "bg-[#FEE3ED] text-[#CE5984]",
        Private: "bg-[#DEDBFC] text-[#8378F0]",
        Bar: "bg-[#B3DFFF] text-[#52A9E6]",
        Family: "bg-[#C7FAB2] text-[#53B52B]",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePhone = (phone) => {
    const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return re.test(phone);
};

// Function to get week number of the year
const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return (
        1 +
        Math.round(
            ((d.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
            7,
        )
    );
};

// Function to get week start date
const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const weekStart = new Date(d.setDate(diff));
    return weekStart;
};

// Function to aggregate daily data into weekly data
export const aggregateWeeklyData = (dailyData) => {
    const weeklyMap = new Map();

    dailyData.forEach((item) => {
        const weekStart = getWeekStart(item.date);
        const weekKey = weekStart.toISOString().split("T")[0];
        const weekNumber = getWeekNumber(item.date);
        const year = new Date(item.date).getFullYear();

        if (weeklyMap.has(weekKey)) {
            weeklyMap.set(weekKey, {
                ...weeklyMap.get(weekKey),
                count: weeklyMap.get(weekKey).count + item.count,
            });
        } else {
            weeklyMap.set(weekKey, {
                date: weekKey,
                count: item.count,
                formattedDate: `Week ${weekNumber}, ${year}`,
                weekStart: weekStart,
            });
        }
    });

    return Array.from(weeklyMap.values()).sort(
        (a, b) => new Date(a.date) - new Date(b.date),
    );
};