
require('dotenv').config();

const express = require('express');
const app = express();

// Server port
const PORT = process.env.PORT || 3000;

// Environment Variables
const STUDENT_OWNER = process.env.STUDENT_OWNER || 'Unconfigured Student';
const APP_ENV = process.env.APP_ENV || 'development';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory task storage
let tasks = [
    {
        id: 1,
        title: 'Initialize GitHub Repository',
        status: 'Completed'
    },
    {
        id: 2,
        title: 'Deploy Web Service to Render PaaS',
        status: 'In Progress'
    }
];

// Escape HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

// ==========================================
// 1. MAIN WEB INTERFACE
// ==========================================

app.get('/', (req, res) => {

    const taskItems = tasks.map(task => `
        <li>
            <strong>#${task.id}</strong>:
            ${escapeHTML(task.title)}
            <em>[${escapeHTML(task.status)}]</em>
        </li>
    `).join('');

    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>TaskFlow Cloud System</title>

        <meta name="viewport"
              content="width=device-width, initial-scale=1.0">

        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #ecf0f5;
                padding: 40px;
                color: #1e293b;
            }

            .container {
                max-width: 650px;
                margin: auto;
                background: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            .badge {
                background: #0284c7;
                color: white;
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 12px;
                text-transform: uppercase;
            }

            input[type="text"] {
                width: 70%;
                padding: 8px;
                margin-right: 8px;
                box-sizing: border-box;
            }

            button {
                padding: 8px 14px;
                background: #16a34a;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            li {
                margin-bottom: 12px;
            }

            a {
                color: #0284c7;
            }

            @media (max-width: 600px) {
                body {
                    padding: 15px;
                }

                .container {
                    padding: 20px;
                }

                input[type="text"] {
                    width: 100%;
                    margin-bottom: 10px;
                }
            }
        </style>
    </head>

    <body>
        <div class="container">

            <h1>
                TaskFlow Cloud System
                <span class="badge">${escapeHTML(APP_ENV)}</span>
            </h1>

            <p>
                <strong>System Administrator:</strong>
                ${escapeHTML(STUDENT_OWNER)}
            </p>

            <p>
                <strong>Server Timestamp:</strong>
                ${new Date().toISOString()}
            </p>

            <hr>

            <h3>Add New Deployment Task</h3>

            <form method="POST" action="/tasks">

                <input
                    type="text"
                    name="title"
                    placeholder="Enter task description..."
                    required
                >

                <button type="submit">Add Task</button>

            </form>

            <h3>Active System Tasks</h3>

            <ul>
                ${taskItems}
            </ul>

            <p>
                <small>
                    API Endpoint:
                    <a href="/api/tasks">/api/tasks</a>
                </small>
            </p>

            <p>
                <small>
                    Health Check:
                    <a href="/api/health">/api/health</a>
                </small>
            </p>

        </div>
    </body>
    </html>
    `);
});

// ==========================================
// 2. FORM SUBMISSION - CREATE TASK
// ==========================================

app.post('/tasks', (req, res) => {

    const { title } = req.body;

    if (title && typeof title === 'string' && title.trim() !== '') {

        tasks.push({
            id: tasks.length + 1,
            title: title.trim(),
            status: 'Pending'
        });

    }

    res.redirect('/');
});

// ==========================================
// 3. REST API - GET ALL TASKS
// ==========================================

app.get('/api/tasks', (req, res) => {

    res.json({
        owner: STUDENT_OWNER,
        environment: APP_ENV,
        totalTasks: tasks.length,
        tasks: tasks
    });

});

// ==========================================
// 4. REST API - CREATE TASK
// ==========================================

app.post('/api/tasks', (req, res) => {

    const { title } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {

        return res.status(400).json({
            message: 'Task title is required.'
        });

    }

    const newTask = {
        id: tasks.length + 1,
        title: title.trim(),
        status: 'Pending'
    };

    tasks.push(newTask);

    res.status(201).json({
        message: 'Task created successfully.',
        task: newTask
    });

});

// ==========================================
// 5. HEALTH CHECK - PHASE 4
// ==========================================

app.get('/api/health', (req, res) => {

    res.json({
        service: 'TaskFlow Cloud System',
        version: '2.0',
        status: 'Healthy',
        uptimeSeconds: Math.floor(process.uptime())
    });

});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, '0.0.0.0', () => {

    console.log('================================');
    console.log('TaskFlow Cloud System Started');
    console.log('================================');

    console.log(`Port: ${PORT}`);
    console.log(`Owner: ${STUDENT_OWNER}`);
    console.log(`Environment: ${APP_ENV}`);

    console.log(`Server running on port ${PORT}`);

});
