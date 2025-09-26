import React, { useEffect, useState } from 'react';

export default function StaffAppointments({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffId, setStaffId] = useState(null);

  useEffect(() => {
    const fetchStaffAppointments = async () => {
      try {
        // Staff ID keresése
        const staffRes = await fetch('http://localhost:3001/api/staff');
        const staffList = await staffRes.json();
        
        const staff = staffList.find(s => s.user_id === user.id);
        
        if (staff) {
          setStaffId(staff.id);
          const res = await fetch(`http://localhost:3001/api/appointments/staff/${staff.id}`);
          const data = await res.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffAppointments();
  }, [user]);

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      // Státusz frissítése
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? {...apt, status: newStatus} : apt
      ));
      
      // Itt később lehet backend hívás
      console.log(`Státusz módosítás: ${appointmentId} -> ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <div className="text-center"><div className="spinner-border"></div></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Ügyfeleim - {user.full_name}</h2>
        <span className="badge bg-primary">Fodrász felület</span>
      </div>

      {appointments.length === 0 ? (
        <div className="alert alert-info">
          Még nincsenek foglalások.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Ügyfél</th>
                <th>Telefon</th>
                <th>Szolgáltatás</th>
                <th>Időpont</th>
                <th>Státusz</th>
                <th>Megjegyzés</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img 
                        src={appointment.client_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.client_name)}&size=32`}
                        alt={appointment.client_name}
                        className="rounded-circle me-2"
                        style={{width: '32px', height: '32px', objectFit: 'cover'}}
                      />
                      <strong>{appointment.client_name}</strong>
                    </div>
                  </td>
                  <td>{appointment.client_phone || '-'}</td>
                  <td>{appointment.service_name}</td>
                  <td>
                    <div>{new Date(appointment.start_at).toLocaleDateString('hu-HU')}</div>
                    <small>{new Date(appointment.start_at).toLocaleTimeString('hu-HU', {hour: '2-digit', minute: '2-digit'})}</small>
                  </td>
                  <td>
                    <span className={`badge ${
                      appointment.status === 'confirmed' ? 'bg-success' :
                      appointment.status === 'cancelled' ? 'bg-danger' :
                      'bg-warning'
                    }`}>
                      {appointment.status === 'confirmed' ? 'Megerősített' :
                       appointment.status === 'cancelled' ? 'Lemondva' : 'Foglalt'}
                    </span>
                  </td>
                  <td>
                    <small>{appointment.notes || '-'}</small>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-success"
                        onClick={() => updateStatus(appointment.id, 'confirmed')}
                        disabled={appointment.status === 'confirmed'}
                        title="Megerősítés"
                      >
                        ✅
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        onClick={() => updateStatus(appointment.id, 'cancelled')}
                        disabled={appointment.status === 'cancelled'}
                        title="Lemondás"
                      >
                        ❌
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}