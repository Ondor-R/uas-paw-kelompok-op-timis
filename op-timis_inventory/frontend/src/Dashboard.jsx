import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
        navigate('/');
        } else {
        setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null;

    return (
        <div>
            <div className="dashboard-header">
                <h3 style={{ margin: 0 }}>Op-timis' Inventory</h3>
                <div className="header-user">
                <span>Hi, <b>{user.name}</b> ({user.role})</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </div>

            <div className="page-container">
                <h2>Status</h2>
                <p>Memuat dashboard...</p>
            </div>
        </div>
    );
}

export default Dashboard;