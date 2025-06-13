// Arquivo: /home/ubuntu/organizador_atividades/frontend/organizador_atividades_frontend_react_tailwind/src/services/taskService.js

const API_BASE_URL = "https://organizador-de-tarefas-backend.onrender.com/api"; // URL base da API do backend Flask

// Função para buscar todas as tarefas principais (com suas subtarefas)
export const getTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Função para criar uma nova tarefa (principal ou subtarefa)
export interface TaskData {
  title: string;
  description?: string;
  priority?: string;
  parent_id?: number;
  status?: string;
  due_date?: string;
  responsible?: string;
  responsible_id?: number;
}

export const createTask = async (taskData: TaskData) => {
  let url = `${API_BASE_URL}/tasks`;
  // O backend espera parent_id no corpo da requisição para criar subtarefas, não na URL

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to parse error JSON" }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Função para atualizar uma tarefa existente
export const updateTask = async (taskId: number, taskData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to parse error JSON" }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    throw error;
  }
};

// Função para deletar uma tarefa
export const deleteTask = async (taskId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to parse error JSON" }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
};

