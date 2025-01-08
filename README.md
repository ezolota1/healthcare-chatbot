# Healthcare Chatbot System

A web application that provides a healthcare chatbot system for users to interact with and book appointments with medical specialists.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)

## Features

- User authentication (login and registration)
- Appointment booking with doctor specialization
- MySQL database integration for storing user and appointment data

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [XAMPP](https://www.apachefriends.org/index.html) or any other tool to run a local MySQL server

## Setup Instructions

Follow these steps to set up the project locally:

1. **Clone the Repository**:

   ```bash
   git clone <repository_url>
   cd healthcare-chatbot-app
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure the Environment**:

   - Locate the `.env.example` file in the root directory.
   - Rename it to `.env`:
     ```bash
     mv .env.example .env
     ```
   - Update the `.env` file with your database details:
     ```env
     DB_HOST=localhost
     DB_USER=<your_mysql_username>
     DB_PASSWORD=<your_mysql_password>
     DB_NAME=<your_database_name>
     ```

4. **Start MySQL Server**:

   - Open XAMPP and start the Apache and MySQL servers.

5. **Create the Database**:
   - Log in to your MySQL instance and create a new database:
     ```sql
     CREATE DATABASE <your_database_name>;
     ```

## Database Setup

1. **Synchronize Models with the Database**:
   Run the following command to generate the database tables:

   ```bash
   node sync.js
   ```

2. **Seed the Database**:
   Populate the database with initial data using seeders:
   ```bash
   npm run seed
   ```

## Running the Project

1. Start the application:

   ```bash
   node app.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
