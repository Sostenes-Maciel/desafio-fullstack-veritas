package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Inicializa o roteador
	r := gin.Default()

	// Configuração do CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// ==========================================
	// MAPEAMENTO DE ROTAS -> HANDLERS
	// ==========================================
	
	r.GET("/api/ping", pingHandler)
	
	r.GET("/api/tasks", getTasksHandler)
	r.POST("/api/tasks", createTaskHandler)
	r.PUT("/api/tasks/:id", updateTaskHandler)
	r.DELETE("/api/tasks/:id", deleteTaskHandler)

	// Inicia o servidor
	r.Run(":8080")
}