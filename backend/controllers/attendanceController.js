const db = require('../config/database');

const checkIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        
        const [existing] = await db.execute(
            'SELECT * FROM attendance WHERE user_id = ? AND date = ?',
            [userId, today]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Already checked in today' });
        }
        
        await db.execute(
            'INSERT INTO attendance (user_id, check_in_time, date) VALUES (?, ?, ?)',
            [userId, now, today]
        );
        
        res.json({ message: 'Check-in successful', time: now });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const checkOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        
        const [attendance] = await db.execute(
            'SELECT * FROM attendance WHERE user_id = ? AND date = ? AND check_out_time IS NULL',
            [userId, today]
        );
        
        if (attendance.length === 0) {
            return res.status(400).json({ message: 'No active check-in found' });
        }
        
        await db.execute(
            'UPDATE attendance SET check_out_time = ? WHERE id = ?',
            [now, attendance[0].id]
        );
        
        res.json({ message: 'Check-out successful', time: now });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMyAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const [records] = await db.execute(
            'SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC',
            [userId]
        );
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllAttendance = async (req, res) => {
    try {
        const [records] = await db.execute(`
            SELECT a.*, u.name, u.email 
            FROM attendance a 
            JOIN users u ON a.user_id = u.id 
            ORDER BY a.date DESC
        `);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { checkIn, checkOut, getMyAttendance, getAllAttendance };
