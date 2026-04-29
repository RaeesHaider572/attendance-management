const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create tables automatically
async function initDatabase() {
    try {
        // Create users table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'employee') DEFAULT 'employee',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table ready');

        // Create attendance table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS attendance (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                check_in_time DATETIME NOT NULL,
                check_out_time DATETIME,
                date DATE NOT NULL,
                status ENUM('present', 'absent', 'late') DEFAULT 'present',
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
        console.log('✅ Attendance table ready');

        // Check if admin exists
        const [adminCheck] = await db.execute('SELECT * FROM users WHERE email = ?', ['admin@example.com']);
        
        if (adminCheck.length === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await db.execute(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['Admin User', 'admin@example.com', hashedPassword, 'admin']
            );
            console.log('✅ Admin user created');
        }

        // Check if employee exists
        const [empCheck] = await db.execute('SELECT * FROM users WHERE email = ?', ['john@example.com']);
        
        if (empCheck.length === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('employee123', 10);
            await db.execute(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['John Doe', 'john@example.com', hashedPassword, 'employee']
            );
            console.log('✅ Employee user created');
        }

    } catch (error) {
        console.error('Database init error:', error);
    }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Initialize database and start server
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
