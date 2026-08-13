export default function TaskCard({ task, onMove, onEdit }) {
  // Define o texto do botão de fallback
  const getNextStatusText = () => {
    if (task.status === 'TODO') return 'Mover para Em Progresso';
    if (task.status === 'IN_PROGRESS') return 'Mover para Concluída';
    return null;
  };

  // Define qual será o status de destino se o usuário clicar no botão em vez de arrastar
  const getNextStatus = () => {
    if (task.status === 'TODO') return 'IN_PROGRESS';
    if (task.status === 'IN_PROGRESS') return 'DONE';
    return null;
  };

  return (
    <div 
      // 1. Torna o cartão arrastável
      draggable
      // 2. Salva o ID da tarefa na transferência de dados do navegador
      onDragStart={(e) => e.dataTransfer.setData('taskId', task.id.toString())}
      // 3. Muda o cursor para indicar que pode ser agarrado
      className="bg-white p-4 rounded shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col gap-2 cursor-grab active:cursor-grabbing"
    >
      <h3 className="font-semibold text-gray-800">{task.title}</h3>
      
      {task.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-100">
        
        {/* Mantemos o botão para acessibilidade (pessoas que não usam mouse) */}
        {getNextStatusText() && (
          <button 
            onClick={() => onMove(task.id, getNextStatus())}
            className="w-full text-xs font-medium bg-green-50 text-green-700 py-1.5 rounded border border-green-200 hover:bg-green-100 transition"
          >
            {getNextStatusText()}
          </button>
        )}

        <button 
          onClick={() => onEdit(task)}
          className="w-full text-xs font-medium bg-gray-50 text-gray-600 py-1.5 rounded border border-gray-200 hover:bg-gray-100 transition"
        >
          Editar / Deletar Tarefa
        </button>
      </div>
    </div>
  );
}