import styles from './styles/create-task.module.scss'
import { useState, useEffect } from 'react'
import { createTask, TaskData } from '@/services/task-service'
import { toast } from 'react-toastify'
import { getUsers } from '@/services/user-service'

function CreateTask() {
  const [users, setUsers] = useState<{ id: number; email: string; username: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data)
      })
      .catch((err) => {
        console.error('Error fetching users:', err)
        toast.error('Erro ao buscar usuários')
      })

  }, [])

  const handleSubmit = () => {
    const form = document.querySelector('form')
    if (!form) return

    const formData = new FormData(form)
    const taskData: TaskData = {
      title: formData.get('task-name') as string,
      description: formData.get('task-description') as string,
      priority: formData.get('task-priority') as string,
      due_date: formData.get('task-deadline') as string,
      responsible: formData.get('task-responsible') as string,
      responsible_id: users.find(user => user.username === formData.get('task-responsible'))?.id || 0,
    }

    if (!taskData.title || !taskData.due_date || !taskData.responsible_id) {
      toast.error('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    setLoading(true)
    const requestToast = toast.loading('Criando tarefa...')

    createTask(taskData)
      .then(() => {
        setSuccess(true)
        form.reset()
        toast.update(requestToast, {
          render: 'Tarefa criada com sucesso!',
          type: 'success',
          isLoading: false,
        })
      })
      .catch((err) => {
        toast.update(requestToast, {
          render: 'Erro ao criar tarefa. Tente novamente.',
          type: 'error',
          isLoading: false,
        })
        console.error('Error creating task:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <section className={styles['form-container']}>
      <form className={styles['form']}>
        <h1 className={styles['title']}>Criar Tarefa</h1>
        <div className={styles['input-group']}>
          <label htmlFor="task-name">Nome da Tarefa</label>
          <input type="text" id="task-name" name="task-name" required />
        </div>

        <div className={styles['multi-input-group']}>
          <div className={styles['input-group']}>
            <label htmlFor="task-deadline">Prazo</label>
            <input type="date" id="task-deadline" name="task-deadline" required />
          </div>
          <div className={styles['input-group']}>
            <label htmlFor="task-priority">Prioridade</label>
            <select id="task-priority" name="task-priority" required>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>
        </div>
        <div className={styles['input-group']}>
          <label htmlFor="task-responsible">Responsável</label>
          <select id="task-responsible" name="task-responsible">
            <option value="">Selecione um usuário</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>
        <div className={styles['input-group']}>
          <label htmlFor="task-description">Descrição</label>
          <textarea id="task-description" name="task-description"></textarea>
        </div>
        <button type="submit" className={styles['submit-button']}
          onClick={handleSubmit}
          disabled={loading || success}
        >Criar</button>
      </form>
    </section>
  )
}

export default CreateTask
