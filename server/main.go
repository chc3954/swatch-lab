package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// ThemeColors defines the structure of a generated color palette.
type ThemeColors struct {
	Background    string `json:"background"`
	Foreground    string `json:"foreground"`
	TextBase      string `json:"textBase"`
	TextMuted     string `json:"textMuted"`
	Primary       string `json:"primary"`
	PrimaryHover  string `json:"primaryHover"`
	Secondary     string `json:"secondary"`
	Accent        string `json:"accent"`
	AccentHover   string `json:"accentHover"`
	Warning       string `json:"warning"`
	Success       string `json:"success"`
	Info          string `json:"info"`
	Border        string `json:"border"`
}

// OllamaGenerateRequest represents the payload for Ollama's /api/generate.
type OllamaGenerateRequest struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
	Stream bool   `json:"stream"` // Set to false to receive the full response.
}

// OllamaGenerateResponse represents the expected response from Ollama.
type OllamaGenerateResponse struct {
	Response string `json:"response"` // Expected to contain a JSON object.
	Done     bool   `json:"done"`
}

// APIRequest is the JSON structure received from the frontend.
type APIRequest struct {
	Description string `json:"description" binding:"required"`
}

// createColorPrompt builds the prompt to instruct the AI to return hex colors.
func createColorPrompt(description string) string {
	typeDef := `
export type ThemeColors = {
	background: string;
	foreground: string;
	textBase: string;
	textMuted: string;
	primary: string;
	primaryHover: string;
	secondary: string;
	accent: string;
	accentHover: string;
	warning: string;
	success: string;
	info: string;
	border: string;
};
`
	prompt := fmt.Sprintf(`
You are a color palette generator. Based on the following description, provide a set of hex color codes (#RRGGBB format) that strictly conform to the ThemeColors type definition.
Do not include any extra text, explanations, or code blocks. Only return a valid JSON object.

Description: "%s"

ThemeColors type definition:%s

Example Output:
{
  "background": "#FFFFFF",
  "foreground": "#000000",
  "textBase": "#333333",
  "textMuted": "#666666",
  "primary": "#007bff",
  "primaryHover": "#0056b3",
  "secondary": "#6c757d",
  "accent": "#28a745",
  "accentHover": "#218838",
  "warning": "#ffc107",
  "success": "#28a745",
  "info": "#17a2b8",
  "border": "#dee2e6"
}
`, description, typeDef)

	return prompt
}

func main() {
	const (
		ollamaURL     = "http://localhost:11434/api/generate"
		model         = "tinyllama"
		serverPort    = "8080"
		requestTimeout = 120 * time.Second
	)

	router := gin.Default()

	// Enable basic CORS headers
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	// Route to generate a theme
	router.POST("/generate-theme", func(c *gin.Context) {
		var req APIRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
			return
		}

		prompt := createColorPrompt(req.Description)

		payload, err := json.Marshal(OllamaGenerateRequest{
			Model:  model,
			Prompt: prompt,
			Stream: false,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal request: " + err.Error()})
			return
		}

		client := &http.Client{Timeout: requestTimeout}
		reqOllama, err := http.NewRequest("POST", ollamaURL, bytes.NewBuffer(payload))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request: " + err.Error()})
			return
		}
		reqOllama.Header.Set("Content-Type", "application/json")

		resp, err := client.Do(reqOllama)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ollama request failed: " + err.Error()})
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			body, _ := io.ReadAll(resp.Body)
			c.JSON(http.StatusBadGateway, gin.H{"error": fmt.Sprintf("Ollama returned error %s: %s", resp.Status, body)})
			return
		}

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response: " + err.Error()})
			return
		}

		var aiResp OllamaGenerateResponse
		if err := json.Unmarshal(body, &aiResp); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to unmarshal Ollama response: %v, Raw: %s", err, string(body))})
			return
		}

		// Attempt to extract JSON object from AI response
		response := aiResp.Response
		start := strings.Index(response, "{")
		end := strings.LastIndex(response, "}")

		if start == -1 || end == -1 || end <= start {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "No valid JSON object found in AI response."})
			return
		}

		rawJSON := response[start : end+1]

		var colors ThemeColors
		if err := json.Unmarshal([]byte(rawJSON), &colors); err != nil {
			// Try to clean up potential markdown formatting or extra whitespace
			cleaned := strings.TrimSpace(rawJSON)
			cleaned = strings.TrimPrefix(cleaned, "```json")
			cleaned = strings.TrimSuffix(cleaned, "```")

			if err := json.Unmarshal([]byte(cleaned), &colors); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":           "Failed to parse cleaned JSON.",
					"extractedJSON":   cleaned,
					"originalResponse": response,
				})
				return
			}
		}

		c.JSON(http.StatusOK, colors)
	})

	fmt.Printf("Server running at http://localhost:%s\n", serverPort)
	router.Run(":" + serverPort)
}
