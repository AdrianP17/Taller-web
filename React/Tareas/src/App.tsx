import { useState } from 'react'
import './App.css'
import { CheckCircle, Plus, Sparkles } from 'lucide-react'
import type { Task } from './interface/Task'
import { TaskItem } from './components/TaskItem';



function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [taskIdCounter, setTaskIdCounter] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [inputError, setInputError] = useState(false);


  const addTask = () => {
    const taskText = inputValue.trim();
    
    if (taskText === '') {
      setInputError(true);
      setTimeout(() => setInputError(false), 2000);
      return;
    }

    const newTask = {
      id: taskIdCounter,
      text: taskText,
      completed: false,
      createdAt: new Date()
    };

    setTasks([...tasks, newTask]);
    setTaskIdCounter(taskIdCounter + 1);
    setInputValue('');
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1000);
  };

  const toggleTask = (taskId : number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId : number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const getCounterText = () => {
    if (totalTasks === 0) {
      return 'No tienes tareas pendientes';
    } else if (pendingTasks === 0) {
      return `🎉 ¡Todas las tareas completadas! (${totalTasks} ${totalTasks === 1 ? 'tarea' : 'tareas'})`;
    } else {
      return `${pendingTasks} ${pendingTasks === 1 ? 'tarea pendiente' : 'tareas pendientes'} de ${totalTasks}`;
    }
  };


  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="text-6xl mb-6 opacity-30">
        <Sparkles className="mx-auto" size={64} />
      </div>
      <h3 className="text-2xl font-bold text-gray-700 mb-3">¡Todo despejado!</h3>
      <p className="text-gray-500 text-lg">
        No tienes tareas pendientes. ¡Agrega una nueva tarea para comenzar!
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br bg-blue-600 p-5">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
            📝 Lista de Tareas
          </h1>
          <p className="text-xl opacity-90">Organiza tu día de manera eficiente</p>
        </div>

        {/* Input Section */}
        <div className="p-8 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputError ? 'Por favor, ingresa una tarea' : '¿Qué necesitas hacer hoy?'}
              maxLength={100}
              className={`
                flex-1 px-6 py-4 rounded-full border-2 text-lg
                focus:outline-none focus:ring-4 transition-all duration-300 text-gray-700
                ${inputError 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-200'
                }
              `}
            />
            <button
              onClick={addTask}
              disabled={showSuccess}
              className={`
                px-8 py-4 rounded-full font-semibold text-lg
                flex items-center gap-2 transition-all duration-300
                focus:outline-none focus:ring-4 focus:ring-purple-200
                hover:transform hover:-translate-y-1 hover:shadow-xl
                ${showSuccess 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                }
              `}
            >
              {showSuccess ? (
                <>
                  <CheckCircle size={20} />
                  ¡Agregada!
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Agregar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="p-8">
          {/* Counter */}
          <div className="text-center mb-6 text-xl text-gray-600 font-medium">
            {getCounterText()}
          </div>

          {/* Task List */}
          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-3">
              {tasks.map(task => (
                <TaskItem key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
