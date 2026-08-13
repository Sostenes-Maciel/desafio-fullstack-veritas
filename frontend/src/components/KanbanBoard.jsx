import { useState } from 'react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

const initialTasks = [
  { id: 1, title: 'Criar API em Go', description: 'Construir o CRUD', status: 'TODO' },
  { id: 2, title: 'Testar Tailwind', description: 'Ajustar layout', status: 'IN_PROGRESS' },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  // Novos estados para Feedback Visual
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  // Função para mostrar o Toast por 3 segundos
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveTask = (taskData) => {
    setIsLoading(true); // Começa a carregar
    
    // Simulando o tempo de ida ao Backend (Go)
    setTimeout(() => {
      if (taskData.id) {
        setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
        showToast('Tarefa atualizada com sucesso!');
      } else {
        const newTask = { ...taskData, id: Date.now() };
        setTasks([...tasks, newTask]);
        showToast('Nova tarefa criada!');
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 800); // 800ms de atraso fake
  };

  const handleDeleteTask = (taskId) => {
    setIsLoading(true);
    setTimeout(() => {
      setTasks(tasks.filter(t => t.id !== taskId));
      showToast('Tarefa excluída!', 'success');
      setIsLoading(false);
      setIsModalOpen(false);
    }, 800);
  };

  const handleMoveTask = (taskId, currentStatus) => {
    // Para mover, não abrimos modal, então o feedback é imediato
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        let newStatus = currentStatus === 'TODO' ? 'IN_PROGRESS' : 'DONE';
        return { ...task, status: newStatus };
      }
      return task;
    }));
    showToast('Tarefa movida!', 'success');
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const todoTasks = tasks.filter(task => task.status === 'TODO');
  const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(task => task.status === 'DONE');

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      
      {/* COMPONENTE DE TOAST (Aviso flutuante) */}
      {toast && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 text-white font-medium transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Mini Kanban - Veritas</h1>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Nova Tarefa
          </button>
        </header>

        <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-140px)]">
          {/* A Fazer */}
          <div className="bg-gray-200 p-4 rounded-lg shadow-sm min-w-[320px] max-w-[350px] flex-shrink-0 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b-2 border-gray-300 pb-2">A Fazer ({todoTasks.length})</h2>
            <div className="flex flex-col gap-3 overflow-y-auto pr-1">
              {todoTasks.map(task => (
                <TaskCard key={task.id} task={task} onMove={handleMoveTask} onEdit={handleEditTask} />
              ))}
            </div>
          </div>
          {/* Em Progresso */}
          <div className="bg-gray-200 p-4 rounded-lg shadow-sm min-w-[320px] max-w-[350px] flex-shrink-0 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b-2 border-blue-300 pb-2">Em Progresso ({inProgressTasks.length})</h2>
            <div className="flex flex-col gap-3 overflow-y-auto pr-1">
              {inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} onMove={handleMoveTask} onEdit={handleEditTask} />
              ))}
            </div>
          </div>
          {/* Concluídas */}
          <div className="bg-gray-200 p-4 rounded-lg shadow-sm min-w-[320px] max-w-[350px] flex-shrink-0 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b-2 border-green-300 pb-2">Concluídas ({doneTasks.length})</h2>
            <div className="flex flex-col gap-3 overflow-y-auto pr-1">
              {doneTasks.map(task => (
                <TaskCard key={task.id} task={task} onMove={handleMoveTask} onEdit={handleEditTask} />
              ))}
            </div>
          </div>
        </div>
      </div>

;      {isModalOpen && (
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        taskToEdit={taskToEdit}
        isLoading={isLoading} 
      />
      )}
    </div>
  );
}