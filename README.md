# AttendJS

AttendJS is a comprehensive Attendance Management System consisting of a React-based frontend, an Express.js-based REST API, and a Python-based background worker.

## Project Structure

- **api/**: Node.js/Express backend handling API requests, authentication, and database interactions (MongoDB).
- **client/**: React frontend built with Vite, utilizing Material UI and Redux for state management.
- **backend/**: Python background process for date/calendar processing and report generation updates.

## Tech Stack

### Client
- **Framework**: React (Vite)
- **UI Library**: Material UI (@mui/material)
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Other**: FullCalendar, Axios, i18next

### API
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, bcryptjs
- **Documentation**: Swagger
- **Logging**: Winston

### Backend (Worker)
- **Language**: Python
- **Libraries**: pymongo, pyodbc, korean-lunar-calendar
- **Purpose**: Background data synchronization and report updates.

## Getting Started

### Prerequisites
- Node.js & npm
- Python 3.x
- MongoDB

### Installation

1.  **Install dependencies for all services:**
    ```bash
    # Root (handles concurrency scripts)
    npm install

    # API
    cd api
    npm install

    # Client
    cd client
    npm install

    # Backend (Python)
    cd backend
    pip install -r requirements.txt
    ```

2.  **Environment Setup:**
    - Configure `.env` in `api/` (refer to code for required variables like `MONGO_URI`, `JWT_SECRET`, etc.).
    - Configure `config.py` in `backend/` if necessary.

### Running the Application

To run the API and Client concurrently:

```bash
npm start
```

This runs:
- **API**: `npm start` (nodemon index.js)
- **Client**: `npm run dev` (vite)

To run the Python worker:

```bash
cd backend
python main.py
```
