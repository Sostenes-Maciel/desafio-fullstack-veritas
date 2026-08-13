export default function TaskCard({ task, onMove, onEdit }) {
  // Regra de negócio: Define qual é a próxima coluna e o texto do botão
  const getNextStatusText = () => {
    if (task.status === 'TODO') return 'Mover para Em Progresso';
    if (task.status === 'IN_PROGRESS') return 'Mover para Concluída';
    return null; // Se já está concluída, não tem botão de mover
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col gap-2">
      <h3 className="font-semibold text-gray-800">{task.title}</h3>
      
      {task.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
      )}
      
      {/* Container dos botões */}
      <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-100">
        
        {/* Botão de Mover (Só aparece se a tarefa não estiver concluída) */}
        {getNextStatusText() && (
          <button 
            onClick={() => onMove(task.id, task.status)}
            className="w-full text-xs font-medium bg-green-50 text-green-700 py-1.5 rounded border border-green-200 hover:bg-green-100 transition"
          >
            {getNextStatusText()}
          </button>
        )}

        {/* Botão de Editar / Deletar */}
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