class Taskbox extends HTMLElement {

    constructor() {
        super();

        const template = document.createElement("template");
        template.innerHTML = `
        <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/taskbox.css"/>

        <div class="modal-background">
        <div class="modal-content">
              <span class="close-btn">&times;</span>
              <h3>Title:</h3>
              <input type="text" class="task-title" placeholder="Task title">
              <h3>Status:</h3>
              <select class="task-status">
                 <option value="WAITING">WAITING</option>
                 <option value="ACTIVE">ACTIVE</option>
                 <option value="DONE">DONE</option>
               </select>
               <br><br>
               <button class="add-task-btn">Add task</button>
         </div>
        </div>`;
        
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));

    }
    
    connectedCallback(){
        const modalBackground = this.shadowRoot.querySelector('.modal-background');
        const closeModalBtn = this.shadowRoot.querySelector('.close-btn');
        const addTaskBtn = this.shadowRoot.querySelector('.add-task-btn');
        const taskTitleInput = this.shadowRoot.querySelector('.task-title');
        const taskStatusInput = this.shadowRoot.querySelector('.task-status');
                    
        closeModalBtn.addEventListener('click', () => {
            this.close();
            });
        
        modalBackground.addEventListener('click', (event) => {
            if(event.target === modalBackground) {
                this.close();
                }
            });    
        
        addTaskBtn.addEventListener('click', () => {
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
       this.shadowRoot.querySelector('.modal-background').classList.add('active');       
    }
    
    close() {
       this.shadowRoot.querySelector('.modal-background').classList.remove('active');   
    }    
}

customElements.define('task-box', Taskbox);