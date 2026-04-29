import React, { useState } from 'react';
import axios from 'axios';

function Attendance({ onAttendanceUpdate }) {
    const [message, setMessage] = useState('');

    const handleCheckIn = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/attendance/checkin`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: response.data.message });
            onAttendanceUpdate();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Check-in failed' });
        }
    };

    const handleCheckOut = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/attendance/checkout`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: response.data.message });
            onAttendanceUpdate();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Check-out failed' });
        }
    };

    return (
        <div style={styles.container}>
            <h2>Mark Attendance</h2>
            <div style={styles.buttonGroup}>
                <button onClick={handleCheckIn} style={styles.checkInButton}>
                    Check In
                </button>
                <button onClick={handleCheckOut} style={styles.checkOutButton}>
                    Check Out
                </button>
            </div>
            {message && (
                <div style={message.type === 'success' ? styles.success : styles.error}>
                    {message.text}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '30px'
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '20px'
    },
    checkInButton: {
        padding: '10px 30px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    checkOutButton: {
        padding: '10px 30px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    success: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#d4edda',
        color: '#155724',
        borderRadius: '4px'
    },
    error: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '4px'
    }
};

export default Attendance;