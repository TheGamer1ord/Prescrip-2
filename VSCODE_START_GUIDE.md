# How to Start/Activate Project in VS Code

## Step 1: Open Project in VS Code

1. **Open VS Code**
2. **Open Folder:**
   - Click **File** → **Open Folder** (or `Ctrl+K` then `Ctrl+O`)
   - Navigate to: `F:\PRESCPITO-main`
   - Click **Select Folder**

Alternatively:
- Right-click on the `PRESCPITO-main` folder → **Open with Code**
- Or drag and drop the folder into VS Code

---

## Step 2: Open Integrated Terminal

You can open terminal in VS Code in several ways:

### Method 1: Keyboard Shortcut
- Press `` Ctrl+` `` (backtick key, above Tab)
- Or press `Ctrl+Shift+` `` (same key)

### Method 2: Menu
- Go to **Terminal** → **New Terminal**

### Method 3: Command Palette
- Press `Ctrl+Shift+P`
- Type "Terminal: Create New Terminal"
- Press Enter

---

## Step 3: Start Backend Server

1. **In the terminal**, navigate to backend:
   ```bash
   cd backend
   ```

2. **Start the backend:**
   ```bash
   npm run dev
   ```

3. **You should see:**
   - "Connected to Mongodb" (if Atlas connection works)
   - "Server is running on 2222"
   - Server logs and activity

**Keep this terminal open** - the backend will run continuously.

---

## Step 4: Start Frontend Server (New Terminal)

You need a **second terminal** for the frontend:

### Option A: Split Terminal
1. Click the **"+"** icon in the terminal panel (top right)
2. Or press `` Ctrl+Shift+` `` again
3. Or click the **split terminal icon** (looks like two squares)

### Option B: New Terminal Tab
1. Click the **dropdown arrow** next to the terminal tab
2. Select **"New Terminal"**

### Then:
1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **You should see:**
   - Vite dev server starting
   - "Local: http://localhost:5173"
   - Frontend is now running

---

## Step 5: Access Your Application

Once both servers are running:

1. **Open your browser**
2. **Go to:** `http://localhost:5173`
3. Your application should load!

**Backend API:** `http://localhost:2222/api`

---

## Quick Reference: VS Code Terminal Tips

### Split Terminal View
- Click the **split icon** (top right of terminal panel)
- Or use: `` Ctrl+\ `` to split terminal

### Switch Between Terminals
- Click on the terminal tab at the top
- Or use: `Ctrl+PageUp` / `Ctrl+PageDown`

### Kill Process in Terminal
- Click in the terminal
- Press `Ctrl+C` to stop the running process

### Clear Terminal
- Right-click in terminal → **Clear**
- Or type `cls` (Windows) / `clear` (Mac/Linux)

---

## Using VS Code Tasks (Advanced)

You can create tasks to run both servers with one command:

### Create `.vscode/tasks.json`:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Start Backend",
            "type": "shell",
            "command": "cd backend && npm run dev",
            "problemMatcher": [],
            "isBackground": true,
            "presentation": {
                "reveal": "always",
                "panel": "dedicated"
            }
        },
        {
            "label": "Start Frontend",
            "type": "shell",
            "command": "cd frontend && npm run dev",
            "problemMatcher": [],
            "isBackground": true,
            "presentation": {
                "reveal": "always",
                "panel": "dedicated"
            }
        },
        {
            "label": "Start All",
            "dependsOn": ["Start Backend", "Start Frontend"],
            "problemMatcher": []
        }
    ]
}
```

### Then:
1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select **"Start All"**

This will start both servers automatically!

---

## VS Code Extensions (Recommended)

Install these extensions for better development:

1. **ES7+ React/Redux/React-Native snippets** - React code snippets
2. **Prettier - Code formatter** - Auto-format code
3. **ESLint** - Code linting
4. **MongoDB for VS Code** - Connect to Atlas from VS Code
5. **Thunder Client** or **REST Client** - Test API endpoints

---

## Troubleshooting

### Terminal Not Opening
- **Solution:** Check if terminal is hidden: `View` → `Terminal`

### npm Command Not Found
- **Solution:** Make sure Node.js is installed and in PATH
- Restart VS Code after installing Node.js

### Port Already in Use
- **Solution:** Stop the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :2222
  taskkill /PID <PID> /F
  ```

### Can't See Both Terminals
- **Solution:** Use split terminal view or open a new terminal tab

### Changes Not Reflecting
- **Solution:** 
  - Backend: Restart server (`Ctrl+C` then `npm run dev`)
  - Frontend: Usually auto-reloads, but you can refresh browser

---

## Quick Start Checklist

- [ ] Open project folder in VS Code
- [ ] Open terminal (`` Ctrl+` ``)
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Open new terminal
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Open browser: `http://localhost:5173`
- [ ] Verify both servers are running

---

## Pro Tips

1. **Pin Terminals:** Right-click terminal tab → "Keep Open"
2. **Rename Terminals:** Right-click terminal tab → "Rename"
3. **Save Terminal Sessions:** VS Code remembers your terminals when you reopen
4. **Use Integrated Terminal:** Faster than external command prompt
5. **Watch Logs:** Both terminals will show server logs in real-time

---

## Keyboard Shortcuts Reference

| Action | Shortcut |
|--------|----------|
| Open Terminal | `` Ctrl+` `` |
| New Terminal | `` Ctrl+Shift+` `` |
| Split Terminal | `` Ctrl+\ `` |
| Switch Terminal | `Ctrl+PageUp/Down` |
| Kill Process | `Ctrl+C` |
| Clear Terminal | Right-click → Clear |

---

**That's it!** Your project should now be running in VS Code. Both servers will continue running until you stop them (`Ctrl+C` in each terminal).

