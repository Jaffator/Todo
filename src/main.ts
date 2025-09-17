import "./style.css";
import "@mdi/font/css/materialdesignicons.css";
import { TodoItem, formToDo } from "./module_todo";
import { ProjectItem, formProject } from "./module_project";
import { format } from "date-fns";

class ToDoAppUI {
  public projects: ProjectItem[] = [];
  private projectList: HTMLElement;
  private todoList: HTMLElement;
  public actualProject: string = "";
  private projectCards!: NodeListOf<HTMLElement>;
  private dialogProject: HTMLDialogElement;
  private dialogTitle: HTMLHeadingElement;
  private projectDialogTitle: HTMLInputElement;
  private projectDialogDescription: HTMLTextAreaElement;

  constructor() {
    this.projectList = document.querySelector(".projectList") as HTMLElement;
    this.todoList = document.querySelector(".toDoList") as HTMLElement;
    this.dialogProject = document.querySelector("#dialog-add-project") as HTMLDialogElement;
    this.dialogTitle = document.querySelector<HTMLHeadingElement>(".dialogProject .dialog-title")!;
    this.projectDialogTitle = document.querySelector<HTMLInputElement>(".dialogProject input")!;
    this.projectDialogDescription = document.querySelector<HTMLTextAreaElement>(".dialogProject #description")!;
  }
  initUI() {
    const dialogTodo = document.querySelector("#dialog-add-todo") as HTMLDialogElement;
    const addProjectBtn = document.querySelector(".circleBtn.btnproject") as HTMLButtonElement;
    const addToDoBtn = document.querySelector(".circleBtn.btntodo") as HTMLButtonElement;
    const projectCancel = document.querySelector("button[data-dialog='project'].btn-cancel") as HTMLFormElement;
    const todoCancel = document.querySelector("button[data-dialog='todo'].btn-cancel") as HTMLFormElement;

    addProjectBtn.addEventListener("click", () => {
      this.dialogTitle.textContent = "New project";
      this.dialogProject.showModal();
    });
    addToDoBtn.addEventListener("click", () => dialogTodo.showModal());
    projectCancel.addEventListener("click", () => this.dialogProject.close());
    todoCancel.addEventListener("click", () => dialogTodo.close());

    // dialog project
    this.dialogProject.addEventListener("submit", (event) => {
      if (this.dialogTitle.textContent == "New project") {
        event?.preventDefault();
        this.dialogProject.close();
        this.addProject();
      } else {
        event?.preventDefault();
        this.dialogProject.close();
        this.editProject();
      }
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
    const projectId = (projectCard as HTMLElement).dataset.id;
    this.actualProject = projectId!;
    this.projectCards.forEach((card) => card.classList.remove("active-project"));
    projectCard.classList.add("active-project");
    formProject.disableProjectBtns();
    const buttons = projectCard.querySelectorAll<HTMLButtonElement>("button");
    buttons.forEach((btn) => {
      btn.disabled = false;
    });
    const actualProjectTitle = document.querySelector<HTMLDivElement>(".todoListContainer .projectTitle")!;
    actualProjectTitle.textContent = this.getActualProject()?.name ?? "";
    this.renderAllTodos();
  }

  setProjectEvents() {
    const projectDelBtn = document.querySelectorAll(".projectCard .project-btn.del");
    const projectEditBtn = document.querySelectorAll(".projectCard .project-btn.edit");

    // click on project event
    this.projectCards.forEach((projectCard) => {
      projectCard.addEventListener("click", () => this.clickOnProject(projectCard));
    });

    // edit project
    projectEditBtn.forEach((edit) => {
      edit.addEventListener("click", () => {
        this.dialogTitle.textContent = "Edit project";
        this.dialogProject.showModal();
        const descr = this.getActualProject()?.getProjectData().description!;
        const name = this.getActualProject()?.getProjectData().name!;
        this.projectDialogDescription.value = descr;
        this.projectDialogTitle.value = name;
      });
    });

    // delete project
    projectDelBtn.forEach((del) => {
      del.addEventListener("click", (event) => {
        const cardId = ((event.currentTarget as HTMLElement).closest(".projectCard") as HTMLElement)!.dataset.id;
        const idx = this.projects.findIndex((pr) => pr.getProjectData().id == cardId);
        this.projects.splice(idx, 1);
        this.renderProjects();
        this.save();
      });
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
  editProject() {
    const formData = formProject.getFormData();
    const actualProject = this.getActualProject();
    actualProject!.descpription = formData.description;
    actualProject!.name = formData.name;
    this.renderProjects();
    const idx = this.projects.findIndex((prj) => prj.getProjectData().id == this.getActualProject()!.id);
    this.clickOnProject(this.projectCards[idx]);
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
      const id = project.getProjectData().id;
      const name = project.getProjectData().name;
      this.projectList.innerHTML += formProject.projectContent(id, name);
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
app.initUI();
