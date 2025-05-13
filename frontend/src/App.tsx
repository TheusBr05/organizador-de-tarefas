// Arquivo: /home/ubuntu/organizador_atividades/frontend/organizador_atividades_frontend_react_tailwind/src/App.tsx
import React, { useState, useEffect, useCallback } from "react";
import * as taskService from "./services/taskService";
// A importação do App.css pode ser removida se o Tailwind for configurado para resetar/aplicar estilos base globalmente
// import "./App.css";

// Definindo tipos básicos para Task e TaskItemProps para conformidade com TypeScript
interface Task {
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

interface TaskItemProps {
  task: Task;
  onUpdateTask: (taskId: number, taskData: Partial<Task>) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
  onAddSubtask: (parentId: number, subtaskTitle: string) => Promise<void>;
  level?: number; // Para indentação de subtarefas
}

function TaskItem({ task, onUpdateTask, onDeleteTask, onAddSubtask, level = 0 }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || "");
  const [editedStatus, setEditedStatus] = useState(task.status || "Pendente");
  const [editedPriority, setEditedPriority] = useState(task.priority || "Média");

  const handleUpdate = async () => {
    try {
      await onUpdateTask(task.id, {
        title: editedTitle,
        description: editedDescription,
        status: editedStatus,
        priority: editedPriority
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task", error);
      // Adicionar feedback para o usuário aqui, se necessário
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "concluída": return "bg-green-100 border-green-500";
      case "em andamento": return "bg-blue-100 border-blue-500";
      case "pendente": return "bg-yellow-100 border-yellow-500";
      default: return "bg-gray-100 border-gray-400";
    }
  };

  const getPriorityClasses = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "alta": return "border-l-4 border-red-500";
      case "média": return "border-l-4 border-yellow-500";
      case "baixa": return "border-l-4 border-green-500";
      default: return "border-l-4 border-gray-300";
    }
  };

  return (
    <li
      className={`task-item mb-4 p-4 border rounded-lg shadow-sm ${getStatusColor(task.status)} ${getPriorityClasses(task.priority)}`}
      style={{ marginLeft: `${level * 20}px` }}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Título da Tarefa"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 h-24"
            placeholder="Descrição"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`status-${task.id}`} className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id={`status-${task.id}`}
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value)}
                className="mt-1 block w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Pendente</option>
                <option>Em Andamento</option>
                <option>Concluída</option>
              </select>
            </div>
            <div>
              <label htmlFor={`priority-${task.id}`} className="block text-sm font-medium text-gray-700">Prioridade</label>
              <select
                id={`priority-${task.id}`}
                value={editedPriority}
                onChange={(e) => setEditedPriority(e.target.value)}
                className="mt-1 block w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Salvar</button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
          {task.description && <p className="text-gray-600">{task.description}</p>}
          <div className="text-sm text-gray-500">
            <span>Status: <span className="font-medium">{task.status || "N/A"}</span></span> |
            <span> Prioridade: <span className="font-medium">{task.priority || "N/A"}</span></span>
            {task.due_date && <span> | Prazo: <span className="font-medium">{new Date(task.due_date).toLocaleDateString()}</span></span>}
          </div>
          <div className="flex space-x-2 mt-3">
            <button onClick={() => setIsEditing(true)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">Editar</button>
            <button onClick={() => onDeleteTask(task.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Excluir</button>
            <button onClick={() => onAddSubtask(task.id, `Subtarefa de ${task.title}`)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">+ Subtarefa</button>
          </div>
        </div>
      )}
      {task.subtasks && task.subtasks.length > 0 && (
        <ul className="subtask-list mt-3 pl-4 border-l-2 border-gray-300">
          {task.subtasks.map(subtask => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
              onAddSubtask={onAddSubtask}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function App() {
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
      fetchTasks();
    } catch (err: any) {
      console.error("Failed to create task:", err);
      setError(`Falha ao criar tarefa: ${err.message}`);
    }
  };

  const handleUpdateTask = async (taskId: number, taskData: Partial<Task>) => {
    try {
      await taskService.updateTask(taskId, taskData);
      fetchTasks();
    } catch (err: any) {
      console.error("Failed to update task:", err);
      setError(`Falha ao atualizar tarefa: ${err.message}`);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
    } catch (err: any) {
      console.error("Failed to delete task:", err);
      setError(`Falha ao excluir tarefa: ${err.message}`);
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

export default App;

