package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

const dataFile = "tasks.json"

// ==========================================
// FUNÇÕES DE BANCO DE DADOS (JSON)
// ==========================================
func loadTasks() []Task {
	if _, err := os.Stat(dataFile); os.IsNotExist(err) {
		return []Task{}
	}
	file, err := os.ReadFile(dataFile)
	if err != nil {
		fmt.Println("Erro ao ler o arquivo:", err)
		return []Task{}
	}
	var tasks []Task
	if err := json.Unmarshal(file, &tasks); err != nil {
		fmt.Println("Erro ao converter JSON:", err)
		return []Task{}
	}
	return tasks
}

func saveTasks(tasks []Task) {
	file, _ := json.MarshalIndent(tasks, "", "  ")
	err := os.WriteFile(dataFile, file, 0644)
	if err != nil {
		fmt.Println("Erro ao salvar arquivo:", err)
	}
}

// ==========================================
// HANDLERS (Controladores das rotas)
// ==========================================

func pingHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "pong! Arquitetura separada com sucesso!"})
}

func getTasksHandler(c *gin.Context) {
	tasks := loadTasks()
	c.JSON(http.StatusOK, tasks)
}

func createTaskHandler(c *gin.Context) {
	var newTask Task
	if err := c.ShouldBindJSON(&newTask); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	newTask.ID = time.Now().UnixMilli()
	tasks := loadTasks()
	tasks = append(tasks, newTask)
	saveTasks(tasks)

	c.JSON(http.StatusCreated, newTask)
}

func updateTaskHandler(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var updatedData Task
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	tasks := loadTasks()
	found := false

	for i, task := range tasks {
		if task.ID == id {
			tasks[i].Title = updatedData.Title
			tasks[i].Description = updatedData.Description
			tasks[i].Status = updatedData.Status
			found = true
			updatedData.ID = task.ID 
			c.JSON(http.StatusOK, tasks[i])
			break
		}
	}

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarefa não encontrada"})
		return
	}
	saveTasks(tasks)
}

func deleteTaskHandler(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	tasks := loadTasks()
	var newTasks []Task
	found := false

	for _, task := range tasks {
		if task.ID == id {
			found = true
		} else {
			newTasks = append(newTasks, task)
		}
	}

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarefa não encontrada"})
		return
	}

	saveTasks(newTasks)
	c.JSON(http.StatusOK, gin.H{"message": "Tarefa deletada com sucesso"})
}