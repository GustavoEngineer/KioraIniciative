import React, { useState } from 'react';
import { Typography } from '../../../common/components/typography/typography';
import { useTasksByDate } from '../hooks/useTasksByDate';
import { Icon } from '@iconify/react';
import styles from './CalendarCard.module.css';

const CalendarCard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showMiniCalendar, setShowMiniCalendar] = useState(false);

    // Fetching tasks for the specific day from the backend
    const { tasks: agendaTasks, isLoading } = useTasksByDate(selectedDate);

    // Obtener días de la semana actual
    const getWeekDays = (date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Empezar Lunes
        start.setDate(diff);

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    };

    const weekDays = getWeekDays(selectedDate);
    const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(selectedDate) + ' ' + selectedDate.getFullYear();

    // Capitalizar para el mini calendario u otros usos si es necesario, 
    // pero el CSS se encargará del estilo principal.

    // Helpers para el mini calendario
    const miniToday = new Date();
    const miniMonth = selectedDate.getMonth();
    const miniYear = selectedDate.getFullYear();
    const daysInMonth = new Date(miniYear, miniMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(miniYear, miniMonth, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

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
        <div className={styles.container}>
            {/* Header simplificado: Mes + Icono */}
            <div className={styles.topNav}>
                <div className={styles.monthHeader}>
                    <Typography variant="dashboard-title" className={styles.monthName}>{monthName}</Typography>
                </div>
                <div className={styles.iconActions}>
                    <button
                        className={`${styles.iconBtn} ${showMiniCalendar ? styles.activeIcon : ''}`}
                        onClick={() => setShowMiniCalendar(!showMiniCalendar)}
                    >
                        <Icon icon="solar:calendar-mark-bold-duotone" width={24} />
                    </button>
                    {showMiniCalendar && (
                        <div className={styles.miniCalendarPopover}>
                            <div className={styles.miniMonthGrid}>
                                {dayNames.map((name, idx) => (
                                    <div key={`name-${idx}`} className={styles.miniDayName}>{name}</div>
                                ))}
                                {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className={styles.miniEmptyDay} />
                                ))}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const date = new Date(miniYear, miniMonth, day);
                                    const isSelected = date.toDateString() === selectedDate.toDateString();
                                    const isToday = date.toDateString() === miniToday.toDateString();
                                    return (
                                        <div
                                            key={day}
                                            className={`${styles.miniDay} ${isSelected ? styles.miniSelected : ''} ${isToday ? styles.miniToday : ''}`}
                                            onClick={() => {
                                                setSelectedDate(date);
                                                setShowMiniCalendar(false);
                                            }}
                                        >
                                            {day}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Selector de días tipo header de la imagen */}
            <div className={styles.daysHeader}>
                {weekDays.map((date, idx) => {
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date).toUpperCase();
                    return (
                        <div
                            key={idx}
                            className={`${styles.dayHeaderItem} ${isSelected ? styles.activeDay : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            <span className={styles.dayLabel}>{dayName}</span>
                            <span className={styles.dayNum}>{date.getDate()}</span>
                        </div>
                    );
                })}
            </div>

            {/* Lista de Agenda al estilo de las columnas de la imagen */}
            <div className={styles.agendaContent}>
                {isLoading ? (
                    <div className={styles.emptyAgenda}>
                        <p>Cargando tareas...</p>
                    </div>
                ) : agendaTasks.length > 0 ? (
                    agendaTasks.map((task) => (
                        <div key={task.id} className={styles.agendaItem}>
                            <div className={styles.eventTime}>
                                {task.due_date ? new Date(task.due_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'Todo el día'}
                            </div>
                            <h3 className={styles.eventTitle}>{task.title}</h3>
                            {task.description && (
                                <p className={styles.eventDescription}>{task.description}</p>
                            )}
                            <div className={styles.eventMetadata}>
                                <Icon icon="solar:map-point-linear" width={12} />
                                <span>{task.tags?.name || 'Kiora Workspace'}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyAgenda}>
                        <Icon icon="solar:calendar-minimalistic-linear" width={48} />
                        <p>No hay tareas programadas para este día</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarCard;
