const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./tasks.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            done INTEGER NOT NULL DEFAULT 0
        )
    `);

    db.get("SELECT COUNT(*) AS count FROM tasks", (err, row) => {

        if (err) {
            console.error(err.message);
            return;
        }

        if (row.count === 0) {

            const stmt = db.prepare(
                "INSERT INTO tasks (title, done) VALUES (?, ?)"
            );

            stmt.run("Learn Express", 0);
            stmt.run("Learn SQLite", 0);
            stmt.run("Build CRUD API", 1);

            stmt.finalize();

            console.log("Database seeded.");
        }

    });

});

module.exports = db;