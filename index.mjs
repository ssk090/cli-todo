import fs from "fs";
import path from "path";
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();
const filePath = path.join(process.cwd(), "todos.json");

// Function to read todos from the file
function readTodos() {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Function to write todos to the file
function writeTodos(todos) {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2), "utf8");
}

// Add a new todo
program
  .command("add <task>")
  .description("Add a new todo")
  .action((task) => {
    const todos = readTodos();
    todos.push({ task, done: false });
    writeTodos(todos);
    console.log(chalk.green("Todo added successfully!"));
  });

// Delete a todo by index
program
  .command("delete <index>")
  .description("Delete a todo by its index")
  .action((index) => {
    const todos = readTodos();
    if (index >= 1 && index <= todos.length) {
      todos.splice(index - 1, 1);
      writeTodos(todos);
      console.log(chalk.red("Todo deleted successfully!"));
    } else {
      console.log(chalk.yellow("Invalid index!"));
    }
  });

// Mark a todo as done by index
program
  .command("done <index>")
  .description("Mark a todo as done")
  .action((index) => {
    const todos = readTodos();
    if (index >= 1 && index <= todos.length) {
      todos[index - 1].done = true;
      writeTodos(todos);
      console.log(chalk.blue("Todo marked as done!"));
    } else {
      console.log(chalk.yellow("Invalid index!"));
    }
  });

// List all todos
program
  .command("list")
  .description("List all todos")
  .action(() => {
    const todos = readTodos();
    if (todos.length === 0) {
      console.log(chalk.magenta("No todos found!"));
    } else {
      todos.forEach((todo, index) => {
        const status = todo.done
          ? chalk.green("[Done]")
          : chalk.red("[Pending]");
        console.log(`${index + 1}. ${status} ${todo.task}`);
      });
    }
  });

program.parse(process.argv);
