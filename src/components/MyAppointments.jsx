import React, { useState } from 'react';

export default function MyAppointments({ user, appointments, onCancel }) {
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Biztosan le szeretnéd mondani ezt az időpontot?')) {
      return;
    }

    setCancellingId(appointmentId);
    
    try {
      const res = await fetch(`http://localhost:3001/api/appointments/${appointmentId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: user.id })
      });
      
      if (res.ok) {
        onCancel(appointmentId);
        alert('Időpont sikeresen lemondva');
      } else {
        const data = await res.json();
        alert(data.error || 'Hiba a lemondás során');
      }
    } catch (error) {
      alert('Hálózati hiba történt');
    } finally {
      setCancellingId(null);
    }
  };

  const activeAppointments = appointments.filter(a => a.status !== 'cancelled');
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');

  return (
    <div>
      <h2 className="mb-4">Időpontjaim</h2>
      
      {activeAppointments.length === 0 && cancelledAppointments.length === 0 ? (
        <div className="alert alert-info">
          Még nincsenek foglalt időpontjaid. <a href="/book" className="alert-link">Foglalj most!</a>
        </div>
      ) : (
        <>
          {/* Aktív foglalások */}
          {activeAppointments.length > 0 && (
            <div className="mb-5">
              <h4 className="mb-3">Aktív foglalások</h4>
              <div className="row">
                {activeAppointments.map(appointment => (
                  <div key={appointment.id} className="col-md-6 mb-3">
                    <div className="card h-100 border-success">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title text-success">{appointment.service_name}</h5>
                          <span className="badge bg-success">{appointment.status}</span>
                        </div>
                        <h6 className="card-subtitle mb-2 text-muted">
                          {appointment.staff_name} fodrásznál
                        </h6>
                        <p className="card-text">
                          <strong>Időpont:</strong> {new Date(appointment.start_at).toLocaleString('hu-HU')}
                        </p>
                        {appointment.notes && (
                          <p className="card-text">
                            <strong>Megjegyzés:</strong> {appointment.notes}
                          </p>
                        )}
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleCancel(appointment.id)}
                          disabled={cancellingId === appointment.id}
                        >
                          {cancellingId === appointment.id ? (
                            <span className="spinner-border spinner-border-sm me-2"></span>
                          ) : null}
                          Lemondás
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lemondott foglalások */}
          {cancelledAppointments.length > 0 && (
            <div>
              <h4 className="mb-3">Lemondott foglalások</h4>
              <div className="row">
                {cancelledAppointments.map(appointment => (
                  <div key={appointment.id} className="col-md-6 mb-3">
                    <div className="card h-100 border-secondary">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title text-muted">{appointment.service_name}</h5>
                          <span className="badge bg-secondary">Lemondva</span>
                        </div>
                        <h6 className="card-subtitle mb-2 text-muted">
                          {appointment.staff_name} fodrásznál
                        </h6>
                        <p className="card-text text-muted">
                          <strong>Időpont:</strong> {new Date(appointment.start_at).toLocaleString('hu-HU')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}