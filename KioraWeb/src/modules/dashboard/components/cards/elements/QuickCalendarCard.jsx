import React, { useState } from 'react';
import DashboardCard from '../../../../../common/components/cards/DashboardCard';
import styles from './QuickCalendarCard.module.css';
import { Icon } from '@iconify/react';

const QuickCalendarCard = ({ tasks = [], focusedTask = null }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthYear = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
    }).format(currentDate);

    const handlePrevMonth = () => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() - 1);
        setCurrentDate(d);
    };

    const handleNextMonth = () => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() + 1);
        setCurrentDate(d);
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        // Adjust so Monday is 0, Sunday is 6
        const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];

        // Previous month filler days
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                isCurrentMonth: false,
                isToday: false
            });
        }

        const today = new Date();

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = 
                today.getDate() === i && 
                today.getMonth() === month && 
                today.getFullYear() === year;

            days.push({
                day: i,
                isCurrentMonth: true,
                isToday
            });
        }

        // Next month filler days (to complete the grid)
        const remainingCells = 42 - days.length; // 6 rows * 7 columns
        for (let i = 1; i <= remainingCells; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                isToday: false,
                hasPendingTasks: false
            });
        }
        
        const todayAtMidnight = new Date();
        todayAtMidnight.setHours(0, 0, 0, 0);

        let dueAtMidnight = null;
        if (focusedTask) {
            const dateStr = focusedTask.due_date || focusedTask.expiration_date || focusedTask.publish_date;
            if (dateStr) {
                // Parse correctly avoiding timezone shifts by taking string portion or using pure local
                const d = new Date(dateStr);
                dueAtMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                dueAtMidnight.setHours(0, 0, 0, 0);
            }
        }

        // Check for timeline
        return days.map(d => {
            if (!d.isCurrentMonth) {
                return { ...d, isTimelineStart: false, isTimelineEnd: false, inTimeline: false };
            }
            
            const cellDate = new Date(year, month, d.day);
            cellDate.setHours(0, 0, 0, 0);

            let isTimelineStart = false;
            let isTimelineEnd = false;
            let inTimeline = false;

            if (dueAtMidnight && cellDate >= todayAtMidnight && cellDate <= dueAtMidnight) {
                if (cellDate.getTime() === todayAtMidnight.getTime()) {
                    isTimelineStart = true;
                }
                if (cellDate.getTime() === dueAtMidnight.getTime()) {
                    isTimelineEnd = true;
                }
                if (cellDate > todayAtMidnight && cellDate < dueAtMidnight) {
                    inTimeline = true;
                }
            }

            return { ...d, isTimelineStart, isTimelineEnd, inTimeline };
        });
    };

    const calendarDays = getDaysInMonth(currentDate);
    const dayLabels = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

    return (
        <DashboardCard className={styles.container}>
            <div className={styles.header}>
                <button onClick={handlePrevMonth} className={styles.navBtn}>
                    <Icon icon="solar:alt-arrow-left-linear" />
                </button>
                <div className={styles.monthTitle}>
                    {monthYear}
                </div>
                <button onClick={handleNextMonth} className={styles.navBtn}>
                    <Icon icon="solar:alt-arrow-right-linear" />
                </button>
            </div>

            <div className={styles.calendarGrid}>
                {dayLabels.map((lbl, idx) => (
                    <div key={idx} className={styles.dayLabel}>
                        {lbl}
                    </div>
                ))}

                {calendarDays.map((dateObj, idx) => {
                    const isOtherMonth = !dateObj.isCurrentMonth;
                    const { isTimelineStart, isTimelineEnd, inTimeline } = dateObj;
                    const timelineClass = inTimeline ? styles.inTimeline : '';
                    const startClass = isTimelineStart ? styles.timelineStart : '';
                    const endClass = isTimelineEnd ? styles.timelineEnd : '';
                    const nodeClass = (isTimelineStart || isTimelineEnd) ? styles.timelineNode : '';
                    const singleDayClass = (isTimelineStart && isTimelineEnd) ? styles.singleTimelineNode : '';

                    return (
                        <div 
                            key={idx} 
                            className={`${styles.dayCell} ${isOtherMonth ? styles.otherMonth : ''} ${dateObj.isToday ? styles.today : ''} ${timelineClass} ${startClass} ${endClass} ${nodeClass} ${singleDayClass}`}
                        >
                            <span className={styles.dayNum}>{dateObj.day}</span>
                        </div>
                    );
                })}
            </div>
        </DashboardCard>
    );
};

export default QuickCalendarCard;
