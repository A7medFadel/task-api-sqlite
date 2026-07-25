const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const db = require("./database");

const express = require("express");

const app = express();
const PORT = 3000;
const swaggerDocument = YAML.load("./swagger.yaml");
app.use(express.json());
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);


// Root
app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: [
            "/tasks"
        ]
    });
});

// Health Check
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

// Get All Tasks
app.get("/tasks", (req, res) => {

    db.all("SELECT * FROM tasks", [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        const tasks = rows.map(task => ({
            ...task,
            done: Boolean(task.done)
        }));

        res.json(tasks);

    });

});
app.get("/tasks/search", (req, res) => {

    const q = req.query.q;

    db.all(
        "SELECT * FROM tasks WHERE title LIKE ?",
        [`%${q}%`],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            const tasks = rows.map(task => ({
                ...task,
                done: Boolean(task.done)
            }));

            res.json(tasks);
        }
    );

});
// Get Task By ID
app.get("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            error: "Invalid task id"
        });
    }

    db.get(
        "SELECT * FROM tasks WHERE id = ?",
        [id],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    error: "Task not found"
                });
            }

            row.done = Boolean(row.done);

            res.json(row);

        }
    );

});

// Create Task
app.post("/tasks", (req, res) => {

    const { title, done } = req.body;

    if (!title) {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    db.run(
        "INSERT INTO tasks (title, done) VALUES (?, ?)",
        [title, done ? 1 : 0],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                id: this.lastID,
                title,
                done: Boolean(done)
            });

        }
    );

});

// Update Task
app.put("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const { title, done } = req.body;

    db.run(
        "UPDATE tasks SET title = ?, done = ? WHERE id = ?",
        [title, done ? 1 : 0, id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Task not found"
                });
            }

            res.json({
                id,
                title,
                done
            });

        }
    );

});

// Delete Task
app.delete("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    db.run(
        "DELETE FROM tasks WHERE id = ?",
        [id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Task not found"
                });
            }

            res.sendStatus(204);

        }
    );

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});