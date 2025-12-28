const form = document.querySelector("form");
const input = document.querySelector("#new-todo-input");
const todoList = document.querySelector("ul");

// The URL where your todo-backend is running
const API_URL = "/todos";

/**
 * 1. GET DATA ON LOAD
 * This replaces the "EJS" part. We ask the backend for the current list.
 */
const fetchTodos = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch todos");

    const todos = await response.json();

    // Clear the list and render items
    todoList.innerHTML = "";
    todos.forEach((todoText) => {
      const li = document.createElement("li");
      li.textContent = todoText;
      todoList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading todos:", error);
  }
};

/**
 * 2. POST DATA ON SUBMIT
 */
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const todoText = input.value;
  if (!todoText) return;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: todoText }),
    });

    if (response.ok) {
      // Update UI dynamically
      const li = document.createElement("li");
      li.textContent = todoText;
      todoList.appendChild(li);

      // Clear input
      input.value = "";
    } else {
      console.error("Server returned an error");
    }
  } catch (error) {
    console.error("Fetch failed:", error);
  }
});

// Run this immediately when the script loads
fetchTodos();
