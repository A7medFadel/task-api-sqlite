# Task API

A simple REST API built with Node.js and Express for managing tasks.

---

## Features

- Create Task
- Get All Tasks
- Get Task By ID
- Update Task
- Delete Task
- Swagger Documentation

---

## Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Install dependencies:

```bash
npm install
```

Run the project:

```bash
node index.js
```

Server:

```
http://localhost:3000
```

Swagger:

```
http://localhost:3000/api-docs
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | API information |
| GET | /health | Health check |
| GET | /tasks | Get all tasks |
| GET | /tasks/:id | Get task by ID |
| POST | /tasks | Create task |
| PUT | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |

---

## Example curl

```bash
curl -i http://localhost:3000/tasks
```

Example Output

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "title": "Learn Express",
    "done": false
  }
]
```

---

## Swagger Screenshot

![Swagger](images/swagger.png)
