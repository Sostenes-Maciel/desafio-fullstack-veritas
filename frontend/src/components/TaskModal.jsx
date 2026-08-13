import { useState } from 'react';

// Removemos o isOpen e o useEffect
export default function TaskModal({ onClose, onSave, onDelete, taskToEdit, isLoading }) {
  
  // Agora o estado já nasce com o valor correto logo de cara!
  const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : '');
  const [description, setDescription] = useState(taskToEdit ? taskToEdit.description : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("O título da tarefa é obrigatório!");
      return;
    }
    onSave({ 
      ...taskToEdit, 
      title, 
      description, 
      status: taskToEdit ? taskToEdit.status : 'TODO' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500 disabled:bg-gray-100"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500 resize-none h-24 disabled:bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              {taskToEdit && (
                <button 
                  type="button" 
                  onClick={() => onDelete(taskToEdit.id)}
                  disabled={isLoading}
                  className="px-4 py-2 text-red-600 bg-red-50 rounded hover:bg-red-100 transition disabled:opacity-50"
                >
                  {isLoading ? 'Deletando...' : 'Deletar'}
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}