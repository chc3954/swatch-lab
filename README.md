# 🎨 Swatch Lab

## 📝 Introduction

This is a full-stack web application designed to help users visualize and manage UI themes in real time using hex color codes. The app provides an intuitive GUI where users can input color values for various UI elements and immediately preview the resulting design. For added creativity and ease, AI-generated theme suggestions are available based on user descriptions.

> ⚠️ **Note:** Since Ollama is running inside a Proxmox container, only models smaller than 1B parameters are currently used. As a result, the quality of AI-generated theme suggestions may not always meet expectations.

![image](https://github.com/user-attachments/assets/797dfcaa-2d92-41c4-abd4-b7ad062c41c9)

---

## 📌 Details

### 🔧 Purpose

The primary goal of this project is to streamline the theme creation and visualization process. By allowing users to input color values directly and see the changes live, the app eliminates guesswork and speeds up UI design workflows. It's especially helpful for developers and designers who want to quickly iterate on visual styles or need AI-assisted inspiration.

---

## 💻 Tech Stack

- **Frontend:** React (Vite)  
- **State Management:** Zustand  
- **Backend:** Go (Golang) with Gin framework  
- **AI Theme Generation:** Ollama (via backend `/generate-theme` endpoint)

---

## 🎨 Theme Structure

Each theme consists of a comprehensive set of color definitions, represented by the following structure:

```ts
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
```
Users can input hex values for each of the above fields to instantly preview the full theme across a mock UI in the app.

## 🌐 Frontend
The frontend interface allows users to:

- Input hex codes for each theme element

- Instantly see the visual effect of the theme

- Submit a short description to get AI-generated theme suggestions via the backend

Zustand is used to manage the current theme state efficiently across the interface.

--- 

## ⚙️ Backend
The backend is built with Go using the Gin framework. It provides the following core functionality:

- Theme Suggestion Endpoint:
POST /generate-theme
Accepts a short natural language description and returns a suggested ThemeColors object, powered by the Ollama AI model.

This enables users to simply describe the mood or purpose of a theme (e.g., “a calm and professional theme for a dashboard”), and receive a set of matching hex codes.
