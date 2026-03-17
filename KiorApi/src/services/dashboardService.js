const getDashboardSummary = async (supabase, userId) => {
    // 1. Obtener todas las tareas del usuario y sus subtareas
    // Importante: No filtramos por ID aquí, RLS ya lo hace por nosotros internamente.
    const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select(`
            id, title, priority, status, created_at, tag_id,
            subtasks (id, status)
        `);

    if (tasksError) throw tasksError;

    // 2. Obtener todas las etiquetas (con contador de uso es óptimo, pero 
    // lo calcularemos en memoria para Kiora V1 dado el volumen esperado).
    const { data: tags, error: tagsError } = await supabase
        .from('tags')
        .select('id, name');

    if (tagsError) throw tagsError;

    // --- CÁLCULO DE MÉTRICAS ---

    // a. Summary
    let totalTasks = tasks.length;
    let completedTasks = 0;
    let pendingTasks = 0;

    let totalSubtasks = 0;
    let completedSubtasks = 0;

    let urgentTasks = [];
    let todayCreated = [];

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
        // Conteo de Tasks
        if (task.status === 'Terminada') completedTasks++;
        else pendingTasks++;

        // Conteo de Subtasks
        if (task.subtasks) {
            totalSubtasks += task.subtasks.length;
            completedSubtasks += task.subtasks.filter(st => st.status === 'Terminada').length;
        }

        // Tareas Urgentes (prioridad 8 a 10, no terminadas)
        if (task.status !== 'Terminada' && task.priority >= 8) {
            urgentTasks.push({
                id: task.id,
                title: task.title,
                priority: task.priority,
                status: task.status
            });
        }

        // Creadas Hoy
        const taskDate = new Date(task.created_at);
        if (taskDate >= startOfToday) {
            todayCreated.push({
                id: task.id,
                title: task.title,
                priority: task.priority
            });
        }
    });

    // Ordenar urgentes por prioridad descendente
    urgentTasks.sort((a, b) => b.priority - a.priority);

    // b. Tags Summary
    const tagsSummaryMap = {};
    tags.forEach(tag => {
        tagsSummaryMap[tag.id] = { id: tag.id, name: tag.name, task_count: 0 };
    });

    const prioritySummary = {
        10: 0,
        8: 0,
        5: 0,
        2: 0
    };

    const pendingPrioritySummary = {
        10: 0,
        8: 0,
        5: 0,
        2: 0
    };

    tasks.forEach(task => {
        if (task.tag_id && tagsSummaryMap[task.tag_id]) {
            tagsSummaryMap[task.tag_id].task_count++;
        }
        
        if (prioritySummary[task.priority] !== undefined) {
            prioritySummary[task.priority]++;
        }

        // Nuevo: Conteo de prioridad solo para pendientes
        if (task.status !== 'Terminada' && pendingPrioritySummary[task.priority] !== undefined) {
            pendingPrioritySummary[task.priority]++;
        }
    });

    const tagsSummary = Object.values(tagsSummaryMap);

    return {
        summary: {
            total_tasks: totalTasks,
            completed_tasks: completedTasks,
            pending_tasks: pendingTasks,
            total_subtasks: totalSubtasks,
            completed_subtasks: completedSubtasks
        },
        urgent_tasks: urgentTasks,
        tags_summary: tagsSummary,
        priority_distribution: prioritySummary, 
        pending_priority_distribution: pendingPrioritySummary, // Nuevo campo para la gráfica de semicírculo
        today_created: todayCreated
    };
};

module.exports = {
    getDashboardSummary
};
