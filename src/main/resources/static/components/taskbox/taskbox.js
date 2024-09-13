class Taskbox extends HTMLElement {

    constructor() {
        super();

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
        
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));

    }
    
    connectedCallback(){
        const dialog = this.shadowRoot.querySelector('dialog');
        const closeModalBtn = this.shadowRoot.querySelector('.close-btn');
        const addTaskBtn = this.shadowRoot.querySelector('.add-task-btn');
        const taskTitleInput = this.shadowRoot.querySelector('.task-title');
        const taskStatusInput = this.shadowRoot.querySelector('.task-status');
                    
        closeModalBtn.addEventListener('click', () => {
            dialog.close();
            });
           
        
        addTaskBtn.addEventListener('click', (event) => {
            event.preventDefault();
            
            const title = taskTitleInput.value || "New Task";
            const status = taskStatusInput.value;
            
            this.dispatchEvent(new CustomEvent('add-task', {
               detail: { title, status },
               bubbles: true,
               composed: true
            }));
            
            taskTitleInput.value = '';
            taskStatusInput.value = "WAITING";
            this.close();    
            });    
    }
    
    open() {
       const dialog = this.shadowRoot.querySelector('dialog');
       dialog.showModal();
    }
    
    close() {
       const dialog = this.shadowRoot.querySelector('dialog');
       dialog.close();
    }    
}

customElements.define('task-box', Taskbox);