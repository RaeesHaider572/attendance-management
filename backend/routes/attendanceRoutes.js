const express = require('express');
const { 
    checkIn, 
    checkOut, 
    getMyAttendance, 
    getAllAttendance 
} = require('../controllers/attendanceController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/checkin', authenticateToken, checkIn);
router.post('/checkout', authenticateToken, checkOut);
router.get('/my-attendance', authenticateToken, getMyAttendance);
router.get('/all-attendance', authenticateToken, isAdmin, getAllAttendance);

module.exports = router;