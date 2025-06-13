import TaskItem from '@/components/ui/taskItem'
import * as taskService from '@/services/task-service'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  status?: string;
  priority?: string;
  parent_id?: number | null;
  subtasks?: Task[];
  created_at?: string;
  updated_at?: string;
}

function TasksManage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Média");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      setError(null);
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks || []);
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      setError(`Falha ao carregar tarefas: ${err.message}. Verifique se o backend está rodando e acessível em http://127.0.0.1:5000.`);
      setTasks([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await taskService.createTask({
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
        status: "Pendente" // Default status
      });
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority("Média");
      toast.success("Tarefa criada com sucesso!");
      fetchTasks();
    } catch (err: any) {
      console.error("Failed to create task:", err);
      setError(`Falha ao criar tarefa: ${err.message}`);
      toast.error(`Falha ao criar tarefa: ${err.message}`);
    }
  };

  const handleUpdateTask = async (taskId: number, taskData: Partial<Task>) => {
    try {
      await taskService.updateTask(taskId, taskData);
      toast.success("Tarefa atualizada com sucesso!");
      fetchTasks();
    } catch (err: any) {
      console.error("Failed to update task:", err);
      setError(`Falha ao atualizar tarefa: ${err.message}`);
      toast.error(`Falha ao atualizar tarefa: ${err.message}`);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
      toast.success("Tarefa excluída com sucesso!");
    } catch (err: any) {
      console.error("Failed to delete task:", err);
      setError(`Falha ao excluir tarefa: ${err.message}`);
      toast.error(`Falha ao excluir tarefa: ${err.message}`);
    }
  };

  const handleAddSubtask = async (parentId: number, subtaskTitle: string) => {
    try {
      await taskService.createTask({
        title: subtaskTitle,
        parent_id: parentId,
        description: "Nova subtarefa",
        priority: "Média", // Default priority for subtask
        status: "Pendente" // Default status for subtask
      });
      fetchTasks();
    } catch (err: any) {
      console.error("Failed to add subtask:", err);
      setError(`Falha ao adicionar subtarefa: ${err.message}`);
    }
  };

  return (
    <div className="App container mx-auto p-4 font-sans bg-gray-50 min-h-screen">
      <header className="App-header my-8 text-center">
        <h1 className="text-4xl font-bold text-gray-700">Gerenciador de Tarefas</h1>
      </header>
      <main className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleCreateTask} className="task-form mb-8 p-6 border rounded-lg bg-gray-50 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Nova Tarefa</h2>
          <div>
            <label htmlFor="newTaskTitle" className="block text-sm font-medium text-gray-700">Título</label>
            <input
              id="newTaskTitle"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Ex: Preparar relatório mensal"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="newTaskDescription" className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
            <textarea
              id="newTaskDescription"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Ex: Coletar dados de vendas e marketing..."
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-28"
            />
          </div>
          <div>
            <label htmlFor="newTaskPriority" className="block text-sm font-medium text-gray-700">Prioridade</label>
            <select
              id="newTaskPriority"
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Baixa</option>
              <option>Média</option>
              <option>Alta</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Adicionar Tarefa
          </button>
        </form>

        <h2 className="text-3xl font-semibold text-gray-700 mb-6">Minhas Tarefas</h2>
        {isLoading ? (
          <p className="text-gray-500 text-center">Carregando tarefas...</p>
        ) : tasks.length === 0 && !error ? (
          <p className="text-gray-500 text-center">Nenhuma tarefa encontrada. Que tal adicionar uma?</p>
        ) : (
          <ul className="task-list space-y-4">
            {tasks.filter(task => !task.parent_id).map(task => ( // Filtrar para mostrar apenas tarefas principais no nível raiz
              <TaskItem
                key={task.id}
                task={task}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onAddSubtask={handleAddSubtask}
              />
            ))}
          </ul>
        )}
      </main>
      <footer className="text-center mt-12 py-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Organizador de Tarefas. Desenvolvido por Manus.</p>
      </footer>
    </div>
  );
}

export default TasksManage;
