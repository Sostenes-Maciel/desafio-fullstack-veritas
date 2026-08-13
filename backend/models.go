package main

// Task representa a estrutura de uma tarefa no Kanban
type Task struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"` // TODO, IN_PROGRESS, DONE
}