import { useState } from "react";
import type { Task } from "../interface/Task";
import { CheckCircle, Trash2 } from "lucide-react";

interface TaskItemProps {
  task: Task;
  toggleTask: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
}

export const TaskItem = ({ task, toggleTask, deleteTask } : TaskItemProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <li 
        className={`
          bg-white p-5 rounded-xl shadow-sm border-l-4 border-transparent
          flex items-center gap-4 transition-all duration-300 ease-in-out
          hover:transform hover:translate-x-2 hover:shadow-lg hover:border-l-purple-500
          animate-in slide-in-from-bottom-2
          ${task.completed ? 'opacity-70 bg-gray-50' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={() => toggleTask(task.id)}
          className={`
            w-6 h-6 rounded-full border-2 border-purple-500 
            flex items-center justify-center transition-all duration-300
            hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-300
            ${task.completed ? 'bg-purple-500 text-white' : 'bg-white text-transparent'}
          `}
        >
          {task.completed && <CheckCircle size={16} />}
        </button>
        
        <span 
          className={`
            flex-1 text-lg transition-all duration-300
            ${task.completed 
              ? 'line-through text-gray-500' 
              : 'text-gray-800'
            }
          `}
        >
          {task.text}
        </span>
        
        <button
          onClick={() => deleteTask(task.id)}
          className={`
            bg-red-500 text-white px-3 py-2 rounded-full
            flex items-center gap-2 text-sm font-medium
            transition-all duration-300 hover:bg-red-600 hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-red-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <Trash2 size={14} />
          Eliminar
        </button>
      </li>
    );
  };