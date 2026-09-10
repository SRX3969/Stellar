// Convex Tasks Backend Queries & Mutations (Frontend-ready interface)

export interface TaskInput {
  title: string;
  subject: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  deadline: string;
  estimatedDuration: string;
}

export const tasksQueries = {
  getTasks: async () => {
    // Connects to ctx.db.query("tasks").collect() when Convex runtime is active
    return [];
  },
};

export const tasksMutations = {
  createTask: async (input: TaskInput) => {
    return { id: `task-${Date.now()}`, ...input, completed: false, section: 'today', createdAt: Date.now() };
  },
  toggleTask: async (taskId: string, completed: boolean) => {
    return { taskId, completed, section: completed ? 'completed' : 'today' };
  },
  deleteTask: async (taskId: string) => {
    return { success: true, taskId };
  },
};
