import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Attendance from './Attendance';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [allAttendance, setAllAttendance] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchMyAttendance();
        if (JSON.parse(userData)?.role === 'admin') {
            fetchAllAttendance();
        }
    }, []);

    const fetchMyAttendance = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/attendance/my-attendance`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAttendance(response.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const fetchAllAttendance = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/attendance/all-attendance`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllAttendance(response.data);
        } catch (error) {
            console.error('Error fetching all attendance:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Attendance Dashboard</h1>
                <div>
                    <span>Welcome, {user?.name} ({user?.role})</span>
                    <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                </div>
            </div>
            
            <Attendance onAttendanceUpdate={fetchMyAttendance} />
            
            <div style={styles.section}>
                <h2>My Attendance History</h2>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map(record => (
                            <tr key={record.id}>
                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                <td>{new Date(record.check_in_time).toLocaleTimeString()}</td>
                                <td>{record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString() : '-'}</td>
                                <td>{record.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {user?.role === 'admin' && (
                <div style={styles.section}>
                    <h2>All Employees Attendance</h2>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Date</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allAttendance.map(record => (
                                <tr key={record.id}>
                                    <td>{record.name}</td>
                                    <td>{new Date(record.date).toLocaleDateString()}</td>
                                    <td>{new Date(record.check_in_time).toLocaleTimeString()}</td>
                                    <td>{record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString() : '-'}</td>
                                    <td>{record.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #eee'
    },
    logoutButton: {
        marginLeft: '20px',
        padding: '5px 15px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    section: {
        marginTop: '30px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '15px'
    },
    th: {
        border: '1px solid #ddd',
        padding: '12px',
        textAlign: 'left',
        backgroundColor: '#f4f4f4'
    },
    td: {
        border: '1px solid #ddd',
        padding: '12px',
        textAlign: 'left'
    }
};

export default Dashboard;