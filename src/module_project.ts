import type { TodoItem } from "./module_todo";

interface ProjectItemData {
  name: string;
  description: string;
  todos: TodoItem[];
  id: string;
}

// ----- project UI items -------

class ProjectFormUI {
  public form: HTMLFormElement;
  public titleInput: HTMLInputElement;
  public descriptionInput: HTMLInputElement;
  constructor() {
    this.form = document.querySelector("#add-project-form") as HTMLFormElement;
    this.titleInput = document.querySelector("#project-title") as HTMLInputElement;
    this.descriptionInput = document.querySelector("#description") as HTMLInputElement;
  }
  getFormData() {
    const name = this.titleInput.value.trim();
    const description = this.descriptionInput.value.trim();
    return { name, description };
  }
  disableProjectBtns() {
    const projectDelBtn = document.querySelectorAll<HTMLButtonElement>(".projectCard .project-btn.del");
    const projectEditBtn = document.querySelectorAll<HTMLButtonElement>(".projectCard .project-btn.edit");
    projectDelBtn.forEach((btn) => {
      btn.disabled = true;
    });
    projectEditBtn.forEach((btn) => {
      btn.disabled = true;
    });
  }
  projectContent(id: string, name: string) {
    return `
    <div class="projectCard" data-id="${id}">${name}
      <div>
        <button disabled class="project-btn edit"><span class="mdi mdi-pencil"></span></button>
        <button disabled class="project-btn del"><span class="mdi mdi-trash-can-outline"></span></button>
      <div/>
    </div>`;
  }
}
// ----- project Object -------

class ProjectItem {
  private _name: string;
  private _description: string;
  private _todos: TodoItem[] = [];
  private _id: string;

  constructor(name: string, description: string) {
    this._name = name;
    this._description = description;
    this._id = crypto.randomUUID();
  }
  addTask(todo: TodoItem) {
    this._todos.push(todo);
  }
  set id(value: string) {
    this._id = value;
  }
  set descpription(value: string) {
    this._description = value;
  }
  set name(value: string) {
    this._name = value;
  }
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  removeTask(index: number) {
    this._todos.splice(index, 1);
  }
  getProjectData(): ProjectItemData {
    return {
      name: this._name,
      description: this._description,
      todos: this._todos,
      id: this._id,
    };
  }
  setProjectData(data: ProjectItemData) {
    this._name = data.name;
    this._description = data.description;
    this._todos = data.todos;
  }
}

const formProject = new ProjectFormUI();
export { ProjectItem, formProject };
