import { useToast } from '@/hooks/use-toast'
import { Task } from '@/pages/tasksManage'
import { useState } from 'react'

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
      const { toast } = useToast();
      toast({
        title: "Erro ao atualizar tarefa",
        description: "Ocorreu um erro ao tentar atualizar a tarefa.",
        variant: "destructive",
      });
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

export default TaskItem;
