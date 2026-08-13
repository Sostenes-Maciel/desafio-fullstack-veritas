import { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

const API_URL = 'http://localhost:8080/api/tasks';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]); // Agora começa vazio!
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // 1. CARREGAR AS TAREFAS DO GO (GET)
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        // Garante que se a API retornar null, setamos um array vazio
        setTasks(data || []); 
      })
      .catch(err => console.error("Erro ao carregar tarefas:", err));
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 2. SALVAR OU EDITAR TAREFA (POST / PUT)
  const handleSaveTask = async (taskData) => {
    setIsLoading(true);
    
    try {
      if (taskData.id) {
        // EDITAR (PUT)
        const res = await fetch(`${API_URL}/${taskData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        if (res.ok) {
          setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
          showToast('Tarefa atualizada com sucesso!');
        }
      } else {
        // CRIAR NOVA (POST)
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        if (res.ok) {
          const newTask = await res.json();
          setTasks([...tasks, newTask]);
          showToast('Nova tarefa criada!');
        }
      }
    } catch (error) {
      showToast('Erro ao comunicar com o servidor', 'error');
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  // 3. DELETAR TAREFA (DELETE)
  const handleDeleteTask = async (taskId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== taskId));
        showToast('Tarefa excluída!', 'success');
      }
    } catch (error) {
      showToast('Erro ao excluir tarefa', 'error');
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  // 4. MOVER TAREFA (PUT)
  const handleMoveTask = async (taskId, currentStatus) => {
    // Acha a tarefa na lista
    const taskToMove = tasks.find(t => t.id === taskId);
    if (!taskToMove) return;

    // Define o novo status
    let newStatus = currentStatus === 'TODO' ? 'IN_PROGRESS' : 'DONE';
    const updatedTask = { ...taskToMove, status: newStatus };

    // Atualiza otimisticamente a tela para parecer instantâneo para o usuário
    setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));

    // Manda para o Go salvar no JSON
    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      if (res.ok) {
        showToast('Tarefa movida!', 'success');
      }
    } catch (error) {
      showToast('Erro ao mover tarefa', 'error');
    }
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
          <div className="bg-gray-200 p-4 rounded-lg shadow-sm min-w-[320px] max-w-[350px] flex-shrink-0 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b-2 border-gray-300 pb-2">A Fazer ({todoTasks.length})</h2>
            <div className="flex flex-col gap-3 overflow-y-auto pr-1">
              {todoTasks.map(task => (
                <TaskCard key={task.id} task={task} onMove={handleMoveTask} onEdit={handleEditTask} />
              ))}
            </div>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg shadow-sm min-w-[320px] max-w-[350px] flex-shrink-0 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b-2 border-blue-300 pb-2">Em Progresso ({inProgressTasks.length})</h2>
            <div className="flex flex-col gap-3 overflow-y-auto pr-1">
              {inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} onMove={handleMoveTask} onEdit={handleEditTask} />
              ))}
            </div>
          </div>
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

      {isModalOpen && (
        <TaskModal
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