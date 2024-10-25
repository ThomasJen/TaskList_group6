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
        
        this.shadowRoot = this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        this.taskListElement = this.shadowRoot.querySelector('#tasklist');
        this.taskListElement.appendChild(tasktable.content.cloneNode(true));
        
        this.tasks = [];
        this.statuses = [];
        this.changeCallback = null;
        this.deleteCallback = null;

        
        this.shadow.addEventListener('change', (event) => {
                          if (event.target.tagName === 'SELECT') {
                              const selectElement = event.target;
                              const row = selectElement.closest('tr');
                              const taskId = row.getAttribute('data-id')  // Anta ID-en er i første kolonne
                              const newStatus = selectElement.value;

                              const confirmation = window.confirm(`Set '${taskId}' to ${newStatus}?`);
                              if (confirmation && this.changeCallback) {
                                  this.changeCallback(taskId, newStatus);
                              }
                          }
                      });

                             this.shadow.addEventListener('click', (event) => {
                                 if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Remove') {
                                     const row = event.target.closest('tr');
                                     const taskId = row.getAttribute('data-id')  // Anta ID-en er i første kolonne

                                     const confirmation = window.confirm(`Are you sure you want to delete task ${taskId}?`);
                                     if (confirmation && this.deleteCallback) {
                                         this.deleteCallback(taskId);
                                     }
                                 }
                             });
    }

    /**
     * @public
     * @param {Array} list with all possible task statuses
     */
    setStatuseslist(allstatuses) {

        this.statusesList = allstatuses;
    }

    /**
     * Add callback to run on change on change of status of a task, i.e. on change in the SELECT element
     * @public
     * @param {function} callback
     */
    changestatusCallback(callback) {

      this.changeCallback = callback;
    }

    /**
     * Add callback to run on click on delete button of a task
     * @public
     * @param {function} callback
     */
    deletetaskCallback(callback) {

        this.deleteCallback = callback;
    }

    /**
     * Add task at top in list of tasks in the view
     * @public
     * @param {Object} task - Object representing a task
     */
    showTask(task) {

        const tablecontent = tasktable.content;
        let templatecontent = template.content;
        templatecontent.append(tablecontent);
        this.append(templatecontent);

        const tbody = document.querySelector("tbody");

        const clone = taskrow.content.cloneNode(true);
        let tr = clone.querySelector("tr");
        tr.setAttribute("id", task.id);

        let td = clone.querySelectorAll("td");

        td[0].textContent = task.title;
        td[1].textContent = task.status;

        let select = clone.querySelector("select");
        let list = this.statusesList

        for (let status of list) {
            let option = document.createElement("option");
            let node = document.createTextNode(status);
            option.appendChild(node);
            option.setAttribute("value", status);
            select.appendChild(option);
        }

        tbody.prepend(clone);

    }

    /**
     * Update the status of a task in the view
     * @param {Object} task - Object with attributes {'id':taskId,'status':newStatus}
     */
    updateTask(task) {

        let tr = document.getElementById(task.id).getElementsByTagName("td")[1];

        tr.innerHTML = task.newStatus;
    }

    /**
     * Remove a task from the view
     * @param {Integer} task - ID of task to remove
     */
    removeTask(id) {

        if (confirm("Do you want to remove task?") == true) {
            document.getElementById(id).remove();
        }
    }

    /**
     * @public
     * @return {Number} - Number of tasks on display in view
     */
    getNumtasks() {
        /**
         * Fill inn the code
         */
        if (document.querySelector("table")) {
            return document.querySelector("table").rows.length - 1;
        } else {
            return 0;
        }
    }



}
customElements.define('task-list', TaskList);