import "./style.css";
import { TodoItem, formToDo } from "./module_todo";
import { ProjectItem, formProject, testProject1, testProject2 } from "./module_project";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

class ToDoAppUI {
  public projects: ProjectItem[] = [];
  private projectList: HTMLElement;
  private todoList: HTMLElement;
  public actualProject: string = "";
  private projectCards!: NodeListOf<HTMLElement>;

  constructor() {
    this.projectList = document.querySelector(".projectList") as HTMLElement;
    this.todoList = document.querySelector(".toDoList") as HTMLElement;
  }
  initUI() {
    const dialogTodo = document.querySelector("#dialog-add-todo") as HTMLDialogElement;
    const dialogProject = document.querySelector("#dialog-add-project") as HTMLDialogElement;
    const addProjectBtn = document.querySelector(".circleBtn.btnproject") as HTMLButtonElement;
    const addToDoBtn = document.querySelector(".circleBtn.btntodo") as HTMLButtonElement;
    const projectCancel = document.querySelector("button[data-dialog='project'].btn-cancel") as HTMLFormElement;
    const todoCancel = document.querySelector("button[data-dialog='todo'].btn-cancel") as HTMLFormElement;
    // const projectCards = document.querySelectorAll(".projectCard");

    addProjectBtn.addEventListener("click", () => dialogProject.showModal());
    addToDoBtn.addEventListener("click", () => dialogTodo.showModal());
    projectCancel.addEventListener("click", () => dialogProject.close());
    todoCancel.addEventListener("click", () => dialogTodo.close());
    // dialog project
    dialogProject.addEventListener("submit", (event) => {
      event?.preventDefault();
      dialogProject.close();
      this.addProject();
    });
    // dialog todo
    dialogTodo.addEventListener("submit", (event) => {
      event?.preventDefault();
      dialogTodo.close();
      this.addTodo();
    });
    this.load();
    this.clickOnProject(this.projectCards[0]);
  }
  clickOnProject(projectCard: Element) {
    // const projectCards = document.querySelectorAll(".projectCard");
    const projectId = (projectCard as HTMLElement).dataset.id;
    this.actualProject = projectId!;
    console.log(`Project ID: ${projectId}`);
    this.projectCards.forEach((card) => card.classList.remove("active-project"));
    projectCard.classList.add("active-project");
    this.renderAllTodos();
    console.log(this.projects);
  }
  setProjectEvents() {
    // const projectCards = document.querySelectorAll(".projectCard");
    this.projectCards.forEach((projectCard) => {
      projectCard.addEventListener("click", () => this.clickOnProject(projectCard));
    });
  }
  setTodoEvents() {
    const selections = document.querySelectorAll(".toDoCard select");
    const doneBtns = document.querySelectorAll(".toDoCard input");
    const deleteBtns = document.querySelectorAll<HTMLButtonElement>(".toDoCard .btn-delete");
    selections.forEach((select) => {
      select.addEventListener("change", (event) => {
        const target = event.target as HTMLSelectElement | null;
        if (target) {
          const value = target.value;
          const id = target.dataset.index;
          console.log(value, id);
          this.projects.forEach((project) => {
            const projecToChange = project.getProjectData().todos.find((todo) => todo.getToDoItem().id == id);
            if (projecToChange) {
              projecToChange.priority = value;
            }
          });
          // Use value and id as needed
        }
        this.renderAllTodos();
      });
    });
    deleteBtns.forEach((del) => {
      del.addEventListener("click", () => {
        const idDelete = del.dataset.index;
        const idx: number = this.getActualProject()!
          .getProjectData()
          .todos.findIndex((todo) => todo.id == idDelete);
        // this.projects.splice(idx, 1);
        this.getActualProject()?.removeTask(idx);
        this.renderAllTodos();
        this.save();
      });
    });
    doneBtns.forEach((done) => {
      done.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        const id = target.dataset.index;
        this.projects.forEach((project) => {
          const projecToChange = project.getProjectData().todos.find((todo) => todo.getToDoItem().id == id);
          if (projecToChange) {
            projecToChange.done = target.checked;
          }
        });
        this.renderAllTodos();
      });
    });
    this.save();
  }
  getActualProject() {
    const actual = this.projects.find((p) => p.getProjectData().id == this.actualProject);
    return actual;
  }
  addTodo() {
    const formData = formToDo.getFormData();
    const todo = new TodoItem(formData.title, formData.description, formData.dueDate, formData.priority);
    const actual = this.projects.find((p) => p.getProjectData().id == this.actualProject);
    actual?.addTask(todo);
    this.renderTodo(todo);
    this.save();
  }
  addProject() {
    const formData = formProject.getFormData();
    const project = new ProjectItem(formData.name, formData.description);
    this.projects.push(project);
    this.renderProjects();
    this.setProjectEvents();
    this.save();
  }
  renderAllTodos() {
    const actual = this.projects.find((p) => p.getProjectData().id == this.actualProject);
    this.todoList.innerHTML = ``;
    actual?.getProjectData().todos.forEach((todo) => {
      this.renderTodo(todo);
    });
  }
  renderTodo(todo: TodoItem) {
    this.todoList.innerHTML += formToDo.todoContent(
      todo.getToDoItem().title,
      todo.getToDoItem().description,
      format(todo.getToDoItem().dueDate, "dd.MM.yyyy HH:mm"),
      todo.getToDoItem().priority,
      todo.getToDoItem().id,
      todo.getToDoItem().done
    );
    this.setTodoEvents();
  }
  renderProjects() {
    this.projectList.innerHTML = ``;
    this.todoList.innerHTML = ``;
    this.projects.forEach((project) => {
      this.projectList.innerHTML += `<div class="projectCard" data-id="${project.getProjectData().id}">${
        project.getProjectData().name
      }</div>`;
    });
    this.projectCards = document.querySelectorAll<HTMLElement>(".projectCard");
    this.setProjectEvents();
  }

  save() {
    localStorage.setItem("projects", JSON.stringify(this.projects));
  }
  load() {
    const data = localStorage.getItem("projects");
    if (!data) {
      this.projects = [];
      return;
    }
    // console.log(data);
    const storedProjects = JSON.parse(data);
    this.projects = storedProjects.map((project: any) => {
      const proj = new ProjectItem(project._name, project._description);
      proj.id = project._id;
      project._todos?.forEach((element: any) => {
        const todo = new TodoItem(element._title, element._description, new Date(element._dueDate), element._priority);
        todo.id = element._id;
        todo.done = element._done;
        proj.addTask(todo);
      });
      return proj;
    });
    this.actualProject = this.projects[0].id;
    this.renderProjects();
  }
}

const app = new ToDoAppUI();
// app.projects.push(testProject1, testProject2);
// app.renderProjects();
// app.renderAllTodos();
app.initUI();
// app.load();
