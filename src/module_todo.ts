interface TodoItemData {
  title: string;
  description: string;
  dueDate: Date;
  priority: string;
  done: boolean;
}

// ----- todo UI items -------

class TodoFormUI {
  public form: HTMLFormElement;
  public titleInput: HTMLInputElement;
  public descriptionInput: HTMLInputElement;
  public dueDateInput: HTMLInputElement;
  public prioritySelect: HTMLSelectElement;

  constructor() {
    this.form = document.getElementById("add-todo-form") as HTMLFormElement;
    this.titleInput = document.getElementById("todo-title") as HTMLInputElement;
    this.descriptionInput = document.getElementById("description") as HTMLInputElement;
    this.dueDateInput = document.getElementById("dueDate") as HTMLInputElement;
    this.prioritySelect = document.getElementById("priority") as HTMLSelectElement;
  }
  getFormData() {
    const todoDate = new Date(this.dueDateInput.value);
    return {
      title: this.titleInput.value,
      description: this.descriptionInput.value,
      dueDate: todoDate,
      priority: this.prioritySelect.value,
    };
  }
  clearForm() {
    this.form.reset();
  }
  todoContent(title: string, desc: string, date: string, priority: string, id: string, done: boolean): string {
    console.log(done);
    return `    <div class="toDoCard ${done === true ? "done" : ""}" style="border-color: var(--priority-${priority})">
                <div class="todoContent">
                  <div class="todoTitle">${title}</div>
                  <div class="todoDescription">
                      ${desc}
                  </div>
                  <div class="todoDueDate">${date}</div>
                </div>
                <div class="todoSetting">
                  <span>Priority</span>
                  <select data-index="${id}">
                    <option value="low" ${priority === "low" ? "selected" : ""}>Low</option>
                    <option value="medium" ${priority === "medium" ? "selected" : ""}>Medium</option>
                    <option value="high" ${priority === "high" ? "selected" : ""}>High</option>
                  </select>
                  <span>Done!</span>
                  <div class="cardButtons">
                  <label class="checkbox">
                    <input data-index="${id}" type="checkbox" ${done === true ? "checked" : ""}/>
                    <span class="checkmark"></span>
                  </label>
                  <button data-index="${id}" class="btn-delete"><span class="mdi mdi-trash-can-outline"></span></button>
              
                  </div>
                </div>
              </div>
            </div>`;
  }
}
// ----- todo Object -------

class TodoItem {
  private _title: string;
  private _description: string;
  private _dueDate: Date;
  private _priority: string;
  private _done: boolean = false;
  private _id: string;

  constructor(title: string, description: string, dueDate: Date, priority: string) {
    this._title = title;
    this._description = description;
    this._dueDate = dueDate;
    this._priority = priority;
    this._id = crypto.randomUUID();
  }
  set priority(value: string) {
    this._priority = value;
  }
  set done(value: boolean) {
    this._done = value;
  }
  set id(value: string) {
    this._id = value;
  }
  get id() {
    return this._id;
  }
  changeToDoItem(data: TodoItemData) {
    this._title = data.title;
    this._description = data.description;
    this._dueDate = data.dueDate;
    this._priority = data.priority;
    this._done = data.done;
  }

  getToDoItem() {
    return {
      title: this._title,
      description: this._description,
      dueDate: this._dueDate,
      priority: this._priority,
      done: this._done,
      id: this._id,
    };
  }
}

const formToDo = new TodoFormUI();

export { TodoItem, formToDo };
