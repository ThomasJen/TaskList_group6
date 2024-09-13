import '../taskbox/taskbox.js';

const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/tasklist.css"/>

    <div id="tasklist"></div>`;

const tasktable = document.createElement("template");
tasktable.innerHTML = `
    <table>
        <thead><tr><th>Task</th><th>Status</th></tr></thead>
        <tbody></tbody>
    </table>`;

const taskrow = document.createElement("template");
taskrow.innerHTML = `
    <tr>
        <td></td>
        <td></td>
        <td>
            <select>
                <option value="0" selected>&lt;Modify&gt;</option>
            </select>
        </td>
        <td><button type="button">Remove</button></td>
    </tr>`;

/**
  * TaskList
  * Manage view with list of tasks
  */
class TaskList extends HTMLElement {

    constructor() {
        super();

        const shadowroot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(taskListTemplate.content.cloneNode(true));
        
        this.tasks = [
            {title: "Wash floor", status: "DONE"},
            {title: "Wash windows", status: "ACTIVE"},
            {title: "Paint roof", status: "WAITING"}
            ];
    }
    
    connectedCallbacks() {
        this.renderTasks();    
    }
    
    renderTasks() {
     
        const taskListContainer = this.shadowRoot.querySelector('.task-list');
        const taskCount = this.shadowRoot.querySelector('.task-count');
        taskListContainer.innerHTML = '';
        taskCount.textContent = this.tasks.length;   
        
        this.tasks.forEach((task, id) => {
            const taskRow = document.createElement('tr');
            
            const taskTitleCell = document.createElement('td');
            taskTitle. textContent = task.title;
            taskRow.appendChild(taskTitleCell);
            
            const taskStatusCell = document.createElement('td');
            const statusSelect = document.createElement('select');
            ["DONE", "ACTIVE", "WAITING"].forEach(status =>{
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                if (task.status === status) {
                    option.selected = true;
                    }
                    statusSelect.appendChild(option); 
                });
                taskStatusCell.appendChild(statusSelect);
                taskRow.appendChild(taskStatusCell);
                
                const taskActionSell = document.createElement('td');
                const removeButton = document.createElement('button');
                removeButton.textContent = "Remove";
                removeButton.addEventListener('click', () => this.removeTask(id));
                taskActionSell.appendChild(removeButton);
                taskRow.appendChild(taskActionSell);
                
                taskListContainer.appendChild(taskRow);
                
                statusSelect.addEventListener('change', (event) =>{
                    this.tasks[id].status = event.target.value;                  
                    });
            });
     }

    addTask(title, status = "WAITING") {
        this.tasks.push({ title, status });
        this.renderTasks();    
    } 

    removeTask(id) {
        this.tasks.splice(id, 1);
        this.renderTasks();
  
    }
}
customElements.define('task-list', TaskList);
