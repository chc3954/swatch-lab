package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
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
		You are a creative color palette generator. Based on the following description, provide a set of unique hex color codes (#RRGGBB format) that strictly conform to the ThemeColors type definition.
		**IMPORTANT:** The example output below demonstrates the *required JSON structure and the purpose of each color field*. **You MUST generate entirely NEW, unique hex codes that perfectly match the provided description.** Do NOT use the placeholder values from the example output.
		Do not include any extra text, explanations, or code blocks. Only return a valid JSON object.

		Description: "%s"

		ThemeColors type definition:%s

		Example Output:
		{
		"background": "#<HEX>", // The main background color of the UI.
		"foreground": "#<HEX>", // A background-like color for UI elements that sit on top of the 'background' (e.g., card backgrounds, modal backgrounds), typically slightly lighter or darker than the main background.
		"textBase": "#<HEX>",   // Default text color for general content.
		"textMuted": "#<HEX>",  // Muted or secondary text color, for less prominent information (e.g., timestamps, descriptions).
		"primary": "#<HEX>",    // Main interactive color for primary actions, buttons, or links.
		"primaryHover": "#<HEX>", // Color for primary elements on hover state.
		"secondary": "#<HEX>",  // Secondary interactive color or for less emphasized elements.
		"accent": "#<HEX>",     // An accent color to draw attention or highlight specific elements.
		"accentHover": "#<HEX>", // Color for accent elements on hover state.
		"warning": "#<HEX>",    // Color for warning messages or cautionary indicators.
		"success": "#<HEX>",    // Color for success messages or positive indicators.
		"info": "#<HEX>",       // Color for informational messages.
		"border": "#<HEX>"      // Color for borders, dividers, or separators.
		}
		`, description, typeDef)

    return prompt
}

func main() {
	const (
		ollamaURL     = "http://localhost:11434/api/generate"
		model         = "qwen3:0.6b"
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

		log.Printf("Received request to generate theme with description: %s", req.Description)

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
		log.Printf("AI response: %s", response)

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
	if err := router.Run("0.0.0.0:" + serverPort); err != nil {
        fmt.Printf("Server failed to start: %v\n", err)
    }
}
