# Dynamic-Form-Generator
A dynamic form generator that takes a JSON schema and generates a styled, functional form in real-time.
## Live Application

[View the live application](https://form-generator-rd.netlify.app/) 

## Images

Here are some images that showcase the app in action:

### Screenshot of the Form Generator Interface

![Form Generator Interface](https://github.com/yourusername/form-generator/blob/main/assets/form-generator-interface.png)

### Example of a Contact Form Rendered

![Contact Form Example](https://github.com/yourusername/form-generator/blob/main/assets/contact-form-example.png)

### Screenshot of the JSON Schema Editor

![JSON Schema Editor](https://github.com/yourusername/form-generator/blob/main/assets/json-schema-editor.png)


Here’s a step-by-step guide on how to set up your project in a GitHub repository, including a `README.md` file with the necessary sections. We will also cover how to deploy your app on Vercel or Netlify.

### Step 1: Create the GitHub Repository
1. Go to GitHub and log in to your account.
2. Click on the **+** icon in the top right corner and select **New repository**.
3. Name your repository (e.g., `form-generator`).
4. Add a description (optional).
5. Choose to make the repository **public** or **private**.
6. Initialize the repository with a **README.md** file and select **MIT License** if needed.
7. Click **Create repository**.

### Step 2: Clone the Repository Locally
Once the repository is created, clone it to your local machine.

```bash
git clone https://github.com/D-D-Roshan/Dynamic-Form-Generator.git
cd Dynamic-Form-Generato
```

### Step 3: Add Your Code
- Create a folder `src` and place your React code inside.
- If you're using Vite, ensure your `index.html` and `main.tsx` are set up correctly.

### Step 4: Set Up the Project
1. In your project directory, initialize it with npm if not done already:

```bash
npm init -y
```

2. Install required dependencies, including React, ReactDOM, and TailwindCSS:

```bash
npm install react react-dom
npm install tailwindcss postcss autoprefixer
npx tailwindcss init
```

3. Set up `tailwind.config.js` and add the following content:

```js
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

4. Configure `postcss.config.js`:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

5. Add TailwindCSS to your CSS:

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

6. Set up Vite if you're using it for development:

```bash
npm install vite
```

Create a `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### Step 5: Push the Project to GitHub
After your project is set up and working locally, commit the changes and push them to your GitHub repository.

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 6: Add a README.md

Create a `README.md` file in the root of your project with the following content:

```markdown
# Form Generator

Form Generator is a React-based web application that allows users to dynamically create forms based on a JSON schema. The app validates the JSON schema and provides an interactive form generator, where users can fill out forms based on the schema.

## Setup Instructions

To set up this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/form-generator.git
   cd form-generator
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. The application will be available at `http://localhost:5173`.

## Example JSON Schemas

### Simple Contact Form
```json
{
  "formTitle": "Contact Form",
  "formDescription": "Please fill out the form below.",
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "required": true,
      "placeholder": "Enter your name"
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email",
      "required": true,
      "placeholder": "Enter your email"
    }
  ]
}
```

### Feedback Form
```json
{
  "formTitle": "Feedback Form",
  "formDescription": "We would love to hear your feedback.",
  "fields": [
    {
      "id": "rating",
      "type": "select",
      "label": "Rating",
      "required": true,
      "options": [
        { "value": "1", "label": "1 Star" },
        { "value": "2", "label": "2 Stars" },
        { "value": "3", "label": "3 Stars" },
        { "value": "4", "label": "4 Stars" },
        { "value": "5", "label": "5 Stars" }
      ]
    },
    {
      "id": "comments",
      "type": "textarea",
      "label": "Comments",
      "placeholder": "Enter your feedback"
    }
  ]
}
```

## Local Development Guide

1. Install dependencies with `npm install`.
2. Run the development server with `npm run dev`.
3. The app will be live on `http://localhost:3000`.

## Deployment

You can deploy this project using either [Vercel](https://vercel.com/) or [Netlify](https://netlify.com).

### Deploy with Vercel

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and log in.
3. Click **New Project** and import your GitHub repository.
4. Vercel will automatically configure the deployment. Click **Deploy**.

### Deploy with Netlify

1. Push your code to GitHub.
2. Go to [Netlify](https://www.netlify.com/) and log in.
3. Click **New site from Git** and connect to your GitHub repository.
4. Netlify will automatically detect the build settings. Click **Deploy Site**.

## Live Application

[View the live application](https://form-generator-rd.netlify.app/) 






