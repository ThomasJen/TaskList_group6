class Taskbox extends HTMLElement {
    
    constructor() {
    super();
      
    const template = document.createElement('template');
    template.innerHTML = `
    
        <div class="task-box> 
            <h3 class="Wash floor> </h3>
            <p class="Done"> </p>
        </div>  
      `;
      
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
      
        }
        
        connectedCallBack() {
            
            this.shadowRoot.querySelector('.Wash floor').textContent = this.getAttribute('task') || "uknown task";
            this.shadowRoot.querySelector('.Done').textContent = this.getAttribute('status') || "uknown status";
                
        }
    }
    
    customElements.define('task-box', Taskbox);