import { Route, Routes } from 'react-router-dom'

import TasksManage from './pages/tasksManage'
import Sidebar from './components/ui/sidebar/sidebar'
import { FaPlus, FaTasks } from 'react-icons/fa'
import CreateTask from './pages/create-taks'

interface SidebarItem {
  name: string
  icon: JSX.Element
  path: string
  subitems?: {
    name: string
    path: string
    expanded: boolean
  }[]
}

export default function AppRoutes() {
  const items: SidebarItem[] = [
    { name: 'Tarefas IA', icon: <FaTasks />, path: '/' },
    { name: 'Cadastro', icon: <FaPlus />, path: '/create-task'},
    { name: 'Tarefas', icon: <FaTasks />, path: '/tasks' },
  ]

  return (
    <Routes>
      <Route element={<Sidebar items={items} />} >
        <Route path="/" element={<TasksManage />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/tasks" element={<TasksManage />} />
      </Route>
    </Routes>
  )
}
