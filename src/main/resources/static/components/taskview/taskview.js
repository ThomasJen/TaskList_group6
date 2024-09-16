import '../tasklist/tasklist.js';
import '../taskbox/taskbox.js';

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

class TaskView extends HTMLElement {
    constructor() {
        super();

        this.view = document.querySelector('task-view');

        let templateContent = template.content;
        this.view.append(templateContent);

        this.updateMessage();
        this.newTaskBtn = this.shadowRoot.querySelector('#new-task-btn');
        this.taskList = this.shadowRoot.querySelector('task-list');
        this.taskBox = this.shadowRoot.querySelector('task-box');


        taskbox.newtaskCallback((task) => {
            let server = this.addTask(task).then(function(res) {
                tasklist.showTask(res.task)
                let view = document.querySelector('task-view');
                view.removeTask(res.task.id);
                view.updateStatus(res.task);
                view.updateMessage();
                console.log(res)
            }).catch(function(err) {
                console.log(err)
            })
            console.log(server);
            if (server) {
                this.updateMessage();
            }
            taskbox.close();
        })

        button.addEventListener("click", () => { taskbox.show() });

    }

    updateMessage() {

        let view = document.querySelector('task-view');
        const tasklist = document.querySelector('task-list');
        let message = document.querySelector('#message')

        this.enableButton(false);
        // Creating a pending paragraph element
        let para = document.createElement("p");
        let node = document.createTextNode("Waiting for server data.")
        para.append(node);

        // We replace the old message with the new one
        const child = document.querySelector("p");
        message.replaceChild(para, child);
        $.ajax({
            url: view.getAttribute("data-serviceurl") + "/tasklist",
            type: 'GET',
            dataType: 'json',
            success: function(res) {
                if (tasklist.getNumtasks() > 0) {

                    node = document.createTextNode(`You have ${tasklist.getNumtasks()} task(s).`);
                    para.innerHTML = '';
                    para.append(node);

                } else {

                    for (let t of res.tasks) {
                        tasklist.showTask(t);
                        view.updateStatus(t);
                        view.removeTask(t.id);
                    }
                    if (tasklist.getNumtasks() == 0) {
                        node = document.createTextNode(`No tasks were found.`);
                        para.innerHTML = '';
                        para.append(node);
                        $("task-list").hide();

                    } else {
                        node = document.createTextNode(`${tasklist.getNumtasks()} tasks were found. `);
                        para.innerHTML = '';
                        para.append(node);
                    }
                }
            }

        });
        // Updating message status, and making button available
        this.enableButton(true);
    }

    addTask(task) {
        let url = this.view;
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: url.getAttribute("data-serviceurl") + "/task",
                type: 'POST',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ title: task.title, status: task.status }),
                success: function(res) {
                    $("task-list").show();

                    resolve(res)
                },
                error: function(err) {
                    reject(err)
                }
            })
        })
    }

    removeTask(taskID) {
        let list = document.querySelector("task-list")
        list.deletetaskCallback((id) => {
            let server = this.ajaxRemoveTask(id).then(function(res) {
                console.log(res)
            }).catch(function(err) {
                console.log(err)
            })
            console.log(server);
            if (server) {
                list.removeTask(taskID);
                this.updateMessage();
            }
        }, taskID)
    }

    updateStatus(task) {
        let list = document.querySelector("task-list");
        let newStatus = "";
        list.changestatusCallback((id) => {
            newStatus = document.getElementById(task.id).querySelector("select").value;
            let server = this.ajaxUpdateStatus(task.id, newStatus).then(function(res) {
                console.log(res);
            }).catch(function(err) {
                console.log(err);
            })
            console.log(server);
            if (server) {
                newStatus = document.getElementById(task.id).querySelector("select").value;
                list.updateTask({ id: task.id, newStatus: newStatus });
                this.updateMessage();
            }
        }, task.id)
    }

    ajaxUpdateStatus(taskID, newStatus) {
        console.log(taskID);
        console.log(newStatus);
        let url = this.view;
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: url.getAttribute("data-serviceurl") + "/task/" + taskID,
                type: 'PUT',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ status: newStatus }),
                success: function(res) {

                }
            })
        })

    }

    ajaxRemoveTask(taskID) {
        let url = this.view;
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: url.getAttribute("data-serviceurl") + "/task/" + taskID,
                type: 'DELETE',
                success: function(res) {

                    resolve(res)
                },
                error: function(err) {
                    reject(err)
                }
            })
        })
    }

    enableButton(active) {
        let button = document.querySelector("button");
        if (active) {

            button.removeAttribute("disabled")
        }
        else {

            button.setAttribute("disabled", "");
        }
    }

    getStatusList() {
        let url = this.view;
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: this.view.getAttribute("data-serviceurl") + "/allstatuses",
                type: 'GET',
                dataType: 'json',
                success: function(res) {
                    tasklist.setStatuseslist(res.allstatuses)

                    console.log(res);
                }
            });
        })
    }

}

customElements.define('task-view', TaskView);
