import "./style.css";

const dialogAddProject = document.querySelector("#dialog-add-project") as HTMLDialogElement;
const dialogAddTodo = document.querySelector("#dialog-add-todo") as HTMLDialogElement;
const button = document.querySelector(".circleBtn.project")!;

button.addEventListener("click", () => {
  dialogAddTodo.showModal()!;
});
