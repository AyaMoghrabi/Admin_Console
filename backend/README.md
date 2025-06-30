# Admin Console Backend

This is the backend server for the Admin Console project. It is built with Node.js, Express, and PostgreSQL.

## Prerequisites
- Node.js (v14 or higher recommended)
- npm (comes with Node.js)
- PostgreSQL

## Setup Instructions

### 1. Install Dependencies
```
npm install
```

### 2. Configure Database Credentials
- Open `server.js`.
- Update the password section with your PostgreSQL password:

```js
const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database_name',
  password: 'your_password',
  port: 5432, // Default PostgreSQL port
});
```

### 3. Run the Server
```
node server.js
```

The server will start on `http://localhost:5000` by default.

## API Endpoints
- `GET /api/users` - List all users
- `POST /api/users` - Add a new user
- `DELETE /api/users/:id` - Delete a user
- `GET /api/roles` - List all roles
- `GET /api/permissions` - List all permissions
- `GET /api/hierarchy` - List all hierarchy entries