const template = document.createElement("template");
template.innerHTML = `
        <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/taskbox.css"/>
        
        <dialog>
        
              <span class="close-btn">&times;</span>
              <div>
               <div> Title: </div>
                <div>
                <input type="text" size="25" maxlength="80" placeholder="Task-title" class="task-title" autofocus />
                </div>
              </div>
             <div>
              <div>Status:</div>
                <div>
                    <select class="task-status">
                        <option value="WAITING">WAITING</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DONE">DONE</option>
                    </select>
                </div>
             </div>
               <p><button type="submit" class="add-task-btn">Add task</button></p>
        </dialog>
        `;
class Taskbox extends HTMLElement {

    constructor() {
        super();

        this.shadowRoot = this.attachShadow({ mode: 'open' });
       
        
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        console.log(this.shadowRoot.innerHTML);

        this.dialog = this.shadowRoot.querySelector('dialog');
        this.closeModalBtn = this.shadowRoot.querySelector('.close-btn');
        this.addTaskBtn = this.shadowRoot.querySelector('.add-task-btn');
        this.taskTitleInput = this.shadowRoot.querySelector('.task-title');
        this.taskStatusSelect = this.shadowRoot.querySelector('.task-status');
        this.statusesList = ["WAITING", "ACTIVE", "DONE"];

        this.closeModalBtn.addEventListener('click', () => this.close());
        
        this.taskCallback = null;
    }


    show() {

        this.dialog.showModal();

    }

    setStatusesList(statuslist) {

        this.taskStatusSelect.innerHTML= '';
        
        
        for (const status of statuslist) {

            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            this.taskStatusSelect.appendChild(option);

        }


    }

    newtaskCallback(callback) {
        
        this.taskCallback = callback;

        this.addTaskBtn.addEventListener('click', () => {
     
            const tasktitle = this.taskTitleInput.value;
            const taskstatus = this.taskStatusSelect.value;

            const newTask = { title:tasktitle, status: taskstatus };
            
            if (this.taskCallback) {
                            this.taskCallback(newTask);
            }
            this.close();;
        });
    }

    close() {

        this.dialog.close();

    }
}

customElements.define('task-box', Taskbox);