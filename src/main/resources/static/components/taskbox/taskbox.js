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

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));

        this.dialog = shadowRoot.querySelector('dialog');
        this.closeModalBtn = shadowRoot.querySelector('.close-btn');
        this.addTaskBtn = shadowRoot.querySelector('.add-task-btn');
        this.taskTitleInput = shadowRoot.querySelector('.task-title');
        this.taskStatusSelect = shadowRoot.querySelector('.task-select');
        this.statusesList = ["WAITING", "ACTIVE", "DONE"];

        this.closeModalBtn.addEventListener('click', () => this.close());

        this.dialog.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }


    show() {

        this.dialog.showModal();

    }

    setStatusesList(statuslist) {

        this.statusesList = statuslist;
        const select = this.shadowRoot.querySelector("select");
        select.innerHTML = '';
        for (const status of statuslist) {

            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            select.appendChild(option);

        }


    }

    newtaskCallback(callback) {

        this.addTaskBtn.addEventListener('click', () => {
            const status = this.taskStatusSelect.value;
            const title = this.taskTitleInput.value;

            const newTask = { title, status };
            callback(newTask);
        });
    }

    close() {

        this.dialog.close();

    }
}

customElements.define('task-box', Taskbox);