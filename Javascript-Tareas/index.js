 class TodoApp {
            constructor() {
                this.tasks = [];
                this.taskIdCounter = 1;
                this.initializeElements();
                this.attachEventListeners();
                this.updateDisplay();
            }

            initializeElements() {
                this.taskInput = document.getElementById('taskInput');
                this.addBtn = document.getElementById('addBtn');
                this.taskList = document.getElementById('taskList');
                this.taskCounter = document.getElementById('taskCounter');
                this.emptyState = document.getElementById('emptyState');
            }

            attachEventListeners() {
                this.addBtn.addEventListener('click', () => this.addTask());
                this.taskInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.addTask();
                    }
                });
            }

            addTask() {
                const taskText = this.taskInput.value.trim();
                
                if (taskText === '') {
                    this.showInputError();
                    return;
                }

                const task = {
                    id: this.taskIdCounter++,
                    text: taskText,
                    completed: false,
                    createdAt: new Date()
                };

                this.tasks.push(task);
                this.taskInput.value = '';
                this.updateDisplay();
                this.showSuccessMessage();
            }

            showInputError() {
                this.taskInput.style.borderColor = '#dc3545';
                this.taskInput.placeholder = 'Por favor, ingresa una tarea';
                
                setTimeout(() => {
                    this.taskInput.style.borderColor = '#e9ecef';
                    this.taskInput.placeholder = '¿Qué necesitas hacer hoy?';
                }, 2000);
            }

            showSuccessMessage() {
                const originalText = this.addBtn.textContent;
                this.addBtn.textContent = '¡Agregada!';
                this.addBtn.style.background = '#28a745';
                
                setTimeout(() => {
                    this.addBtn.textContent = originalText;
                    this.addBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }, 1000);
            }

            toggleTask(taskId) {
                const task = this.tasks.find(t => t.id === taskId);
                if (task) {
                    task.completed = !task.completed;
                    this.updateDisplay();
                }
            }

            deleteTask(taskId) {
                this.tasks = this.tasks.filter(t => t.id !== taskId);
                this.updateDisplay();
            }

            updateDisplay() {
                this.renderTasks();
                this.updateCounter();
                this.toggleEmptyState();
            }

            renderTasks() {
                this.taskList.innerHTML = '';
                
                this.tasks.forEach(task => {
                    const taskItem = this.createTaskElement(task);
                    this.taskList.appendChild(taskItem);
                });
            }

            createTaskElement(task) {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                
                li.innerHTML = `
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="todoApp.toggleTask(${task.id})">
                        ${task.completed ? '✓' : ''}
                    </div>
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                    <button class="delete-btn" onclick="todoApp.deleteTask(${task.id})">
                        🗑️ Eliminar
                    </button>
                `;

                return li;
            }

            escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }

            updateCounter() {
                const totalTasks = this.tasks.length;
                const completedTasks = this.tasks.filter(t => t.completed).length;
                const pendingTasks = totalTasks - completedTasks;

                if (totalTasks === 0) {
                    this.taskCounter.textContent = 'No tienes tareas pendientes';
                } else if (pendingTasks === 0) {
                    this.taskCounter.textContent = `🎉 ¡Todas las tareas completadas! (${totalTasks} ${totalTasks === 1 ? 'tarea' : 'tareas'})`;
                } else {
                    this.taskCounter.textContent = `${pendingTasks} ${pendingTasks === 1 ? 'tarea pendiente' : 'tareas pendientes'} de ${totalTasks}`;
                }
            }

            toggleEmptyState() {
                if (this.tasks.length === 0) {
                    this.emptyState.style.display = 'block';
                    this.taskList.style.display = 'none';
                } else {
                    this.emptyState.style.display = 'none';
                    this.taskList.style.display = 'block';
                }
            }
        }

        // Inicializar la aplicación cuando se carga la página
        let todoApp;
        document.addEventListener('DOMContentLoaded', () => {
            todoApp = new TodoApp();
        });