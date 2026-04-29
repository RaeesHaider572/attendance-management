CREATE DATABASE IF NOT EXISTS attendance_db;
USE attendance_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance records table
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late') DEFAULT 'present',
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_date (user_id, date)
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@example.com', '$2b$10$YourHashedPasswordHere', 'admin');

-- Insert sample employee (password: employee123)
INSERT INTO users (name, email, password, role) 
VALUES ('John Doe', 'john@example.com', '$2b$10$YourHashedPasswordHere', 'employee');