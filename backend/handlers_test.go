// Testa a rota de ping para garantir que a API está respondendo com Status 200 (OK)
package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestPingHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := gin.Default()
	r.GET("/api/ping", pingHandler)

	req, _ := http.NewRequest(http.MethodGet, "/api/ping", nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Esperava status %d, mas recebeu %d", http.StatusOK, w.Code)
	}
}