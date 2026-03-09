import React, { useState } from 'react';
import DashboardCard from '../../../../common/components/cards/DashboardCard';
import { useTasksByDate } from '../../hooks/useTasksByDate';
import { Icon } from '@iconify/react';
import styles from './CalendarCard.module.css';
import TaskCard from '../../../../common/components/cards/TaskCard';

const CalendarCard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Fetching tasks for the specific day
    const { tasks: agendaTasks, isLoading } = useTasksByDate(selectedDate);

    // Obtener 7 días de la semana que contiene la fecha seleccionada (empezando en Domingo)
    const getWeekDays = (date) => {
        const start = new Date(date);
        const day = start.getDay();
        // Empezar en Domingo (0)
        const diff = start.getDate() - day;
        start.setDate(diff);

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    };

    const weekDays = getWeekDays(selectedDate);

    // Formato "Marzo 2026" completo
    const monthYear = new Intl.DateTimeFormat('es-ES', {
        month: 'long',
        year: 'numeric'
    }).format(selectedDate);

    const dayLabelsShort = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

    const handlePrevWeek = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 7);
        setSelectedDate(d);
    };

    const handleNextWeek = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 7);
        setSelectedDate(d);
    };

    return (
        <DashboardCard title="Calendario" className={styles.container}>
            {/* Navigación de Semana */}
            <div className={styles.monthNavigator}>
                <button onClick={handlePrevWeek} className={styles.navBtn}>
                    <Icon icon="solar:alt-arrow-left-linear" />
                </button>
                <div className={styles.monthTitle}>
                    {monthYear}
                </div>
                <button onClick={handleNextWeek} className={styles.navBtn}>
                    <Icon icon="solar:alt-arrow-right-linear" />
                </button>
            </div>

            {/* Header de la semana (Fijo, 7 días) */}
            <div className={styles.daysHeader}>
                {weekDays.map((date, idx) => {
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    const today = new Date();
                    const isToday = date.toDateString() === today.toDateString();

                    const dateAtMidnight = new Date(date);
                    dateAtMidnight.setHours(0, 0, 0, 0);
                    const todayAtMidnight = new Date(today);
                    todayAtMidnight.setHours(0, 0, 0, 0);
                    const isPast = dateAtMidnight < todayAtMidnight;

                    return (
                        <div
                            key={idx}
                            className={`${styles.dayHeaderItem} ${isSelected ? styles.activeDay : ''} ${isToday ? styles.today : ''} ${isPast ? styles.past : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            <span className={styles.dayLabel}>{dayLabelsShort[idx]}</span>
                            <div className={styles.dayCircle}>
                                <span className={styles.dayNum}>{date.getDate()}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Agenda List */}
            <div className={styles.agendaContent}>
                {isLoading ? (
                    <div className={styles.emptyAgenda}>
                        <p>Cargando tareas...</p>
                    </div>
                ) : agendaTasks.length > 0 ? (
                    agendaTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))
                ) : (
                    <div className={styles.emptyAgenda}>
                        <Icon icon="solar:calendar-minimalistic-linear" width={48} />
                        <p>No hay tareas programadas</p>
                    </div>
                )}
            </div>
        </DashboardCard>
    );
};

export default CalendarCard;
