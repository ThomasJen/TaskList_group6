import '../tasklist/tasklist.js';
import '../taskbox/taskbox.js';
 
class TaskView extends HTMLElement {
    constructor() {
    super(); 

    const template = document.createElement("template");
    template.innerHTML = `
 
    <div class="task-view">
        <link rel="stylesheet" type="text/css"href="${import.meta.url.match(/.*\//)[0]}/taskview.css"/>

        <h1>Tasks</h1>
 
        <div id="message"> <p>Waiting for server data.</p> </div>
 
        <div id="newtask"> <button type="button" disabled>New task</button> </div>
 
        <!-- The task list -->
        <task-list> </task-list>

        <!-- The Modal -->
        <task-box></task-box>
     </div>
 `;
 
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.messageElement = this.shadowRoot.querySelector('#message');
    this.newTaskBtn = this.shadowRoot.querySelector('#new-task-btn');
    this.taskList = this.shadowRoot.querySelector('task-list');
    this.taskBox = this.shadowRoot.querySelector('task-box');
    
    }
    connectedCallback() {
        
        this.loadTasksFromServer();
        
        this.newTaskBtn.addEventListener('click', () => {
           taskBox.open(); 
        });
        
        this.taskBox.addEventListener('add-task', (event) => {
            const { title, status } = event.detail;
            taskList.addTask(title, status);
            this.updateMessage();
        });
    }
    
    loadTasksFromServer() {
        setTimeout(() => {
            const tasksFromServer = [
            {title: "Wash floor", status: "DONE"},
            {title: "Wash windows", status: "ACTIVE"},
            {title: "Paint roof", status: "WAITING"}
            ];
            
            tasksFromServer.forEach(task => this.taskList.addTask(task.title, task.status));
            
            this.updateMessage();
            this.newTaskBtn.disabled = false;
        }, 2000);
    
   }
    updateMessage() {
        const taskCount = this.taskList.tasks.length;
        
        if(taskCount === 0) {
            this.messageElement.textContent = "No tasks were found";
        } else {
            this.messageElement.textContent = `Found ${taskCount} task${taskCount > 1 ? 's' : ''}`;
        }
    }
}
    
 customElements.define('task-view', TaskView);
 