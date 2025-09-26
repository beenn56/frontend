import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import BookingForm from './components/BookingForm';
import MyAppointments from './components/MyAppointments';
import StaffAppointments from './components/StaffAppointments';
import Home from './components/Home';
import Profile from './components/Profile';
import Footer from './components/Footer';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // Foglalások betöltése amint a user bejelentkezik
  useEffect(() => {
    const fetchAppointments = async () => {
      if (user && user.role === 'client') {
        setLoadingAppointments(true);
        try {
          const res = await fetch(`http://localhost:3001/api/appointments/client/${user.id}`);
          const data = await res.json();
          setAppointments(data);
        } catch (error) {
          console.error('Error fetching appointments:', error);
        } finally {
          setLoadingAppointments(false);
        }
      } else {
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setAppointments([]);
  };

  const addAppointment = (newAppointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const cancelAppointment = (appointmentId) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const activeAppointmentsCount = appointments.filter(a => 
    a.status !== 'cancelled' && a.status !== 'completed'
  ).length;

  return (
    <div className="min-vh-100 d-flex flex-column" style={{background: 'linear-gradient(135deg, #1a2a6c 0%, #2d5b8a 50%, #3a7bd5 100%)'}}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-scissors me-2"></i>
            Fazonműhely
          </Link>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto">
              <Link className="nav-link" to="/">Kezdőlap</Link>
              
              {user ? (
                <>
                  {user.role === 'staff' && (
                    <Link className="nav-link" to="/staff-appointments">
                      <i className="bi bi-people me-1"></i>
                      Ügyfeleim
                    </Link>
                  )}
                  {user.role === 'client' && (
                    <>
                      <Link className="nav-link" to="/book">
                        <i className="bi bi-calendar-plus me-1"></i>
                        Foglalás
                      </Link>
                      <Link className="nav-link position-relative" to="/my">
                        <i className="bi bi-calendar-check me-1"></i>
                        Időpontjaim
                        {activeAppointmentsCount > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {activeAppointmentsCount}
                          </span>
                        )}
                      </Link>
                    </>
                  )}
                  <Link className="nav-link" to="/profile">
                    <i className="bi bi-person-circle me-1"></i>
                    Profilom
                  </Link>
                  <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Kijelentkezés
                  </button>
                </>
              ) : (
                <>
                  <Link className="nav-link" to="/login">Bejelentkezés</Link>
                  <Link className="nav-link" to="/register">Regisztráció</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1">
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterForm onLogin={handleLogin} />} />
            <Route path="/book" element={user ? <BookingForm user={user} onAppointmentAdded={addAppointment} /> : <Navigate to="/login" />} />
            <Route path="/my" element={user ? <MyAppointments user={user} appointments={appointments} onCancel={cancelAppointment} loading={loadingAppointments} /> : <Navigate to="/login" />} />
            <Route path="/staff-appointments" element={user?.role === 'staff' ? <StaffAppointments user={user} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile user={user} onUserUpdate={updateUser} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
}