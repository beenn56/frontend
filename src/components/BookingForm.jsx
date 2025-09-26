import React, { useState, useEffect } from 'react';

export default function BookingForm({ user, onAppointmentAdded }) {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const [form, setForm] = useState({
    service_id: '',
    staff_id: '', 
    notes: ''
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/services')
      .then(r => r.json())
      .then(setServices);
    fetch('http://localhost:3001/api/staff')
      .then(r => r.json())
      .then(setStaff);
  }, []);

  // Elérhető időpontok betöltése
  useEffect(() => {
    if (form.staff_id && selectedDate) {
      fetch(`http://localhost:3001/api/appointments/available/${form.staff_id}/${selectedDate}`)
        .then(r => r.json())
        .then(setAvailableSlots);
    }
  }, [form.staff_id, selectedDate]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime('');
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  const submit = async e => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert('Válassz dátumot és időpontot!');
      return;
    }

    const start_at = `${selectedDate}T${selectedTime}`;
    
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:3001/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: user.id,
          ...form,
          start_at
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('Foglalás sikeres!');
        
        // Új foglalás hozzáadása a listához
        const newAppointment = {
          id: data.appointmentId,
          service_name: services.find(s => s.id == form.service_id)?.name,
          staff_name: staff.find(s => s.id == form.staff_id)?.display_name,
          start_at: start_at.replace('T', ' '),
          status: 'booked',
          notes: form.notes
        };
        
        onAppointmentAdded(newAppointment);
        
        // Form reset
        setForm({ service_id: '', staff_id: '', notes: '' });
        setSelectedDate('');
        setSelectedTime('');
        setAvailableSlots([]);
      } else {
        alert(data.error || 'Hiba a foglalásnál');
      }
    } catch (error) {
      alert('Hálózati hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Új időpont foglalás</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Szolgáltatás *</label>
                <select 
                  className="form-select"
                  value={form.service_id} 
                  onChange={e => setForm({...form, service_id: e.target.value})}
                  required
                >
                  <option value="">-- válassz szolgáltatást --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.duration_minutes} perc) - {s.price_cents / 100} Ft
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Fodrász *</label>
                <select 
                  className="form-select"
                  value={form.staff_id} 
                  onChange={e => setForm({...form, staff_id: e.target.value, staff_selected: true})}
                  required
                >
                  <option value="">-- válassz fodrászt --</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.display_name}</option>
                  ))}
                </select>
              </div>

              {form.staff_id && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Dátum *</label>
                    <input 
                      type="date" 
                      className="form-control"
                      min={minDate}
                      value={selectedDate}
                      onChange={handleDateChange}
                      required
                    />
                  </div>

                  {selectedDate && (
                    <div className="mb-3">
                      <label className="form-label">Időpont *</label>
                      <div className="row g-2">
                        {allTimeSlots.map(slot => {
                          const isAvailable = availableSlots.includes(slot);
                          const isSelected = selectedTime === slot;
                          
                          return (
                            <div key={slot} className="col-3">
                              <button
                                type="button"
                                className={`btn w-100 ${isSelected ? 'btn-primary' : isAvailable ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                                disabled={!isAvailable}
                                onClick={() => setSelectedTime(slot)}
                              >
                                {slot}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <small className="text-muted">
                        Zöld: szabad, Szürke: foglalt
                      </small>
                    </div>
                  )}
                </>
              )}

              <div className="mb-4">
                <label className="form-label">Megjegyzés</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  placeholder="Speciális kérések, megjegyzések..."
                  value={form.notes} 
                  onChange={e => setForm({...form, notes: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2"
                disabled={loading || !selectedTime}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Foglalás...
                  </>
                ) : (
                  'Időpont foglalása'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}