import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RegisterForm({ onLogin }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (res.ok) {
        onLogin(data.user, data.token);
      } else {
        alert(data.error || 'Hiba a regisztrációnál');
      }
    } catch (error) {
      alert('Hálózati hiba történt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Regisztráció</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Felhasználónév *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Válassz felhasználónevet"
                  value={form.username}
                  onChange={e => setForm({...form, username: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Teljes név *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Add meg a teljes neved"
                  value={form.full_name}
                  onChange={e => setForm({...form, full_name: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email cím *</label>
                <input 
                  type="email" 
                  className="form-control"
                  placeholder="pl. nev@example.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Telefonszám</label>
                <input 
                  type="tel" 
                  className="form-control"
                  placeholder="06-30-123-4567"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Jelszó *</label>
                <input 
                  type="password" 
                  className="form-control"
                  placeholder="Válassz erős jelszót"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Regisztráció...
                  </>
                ) : (
                  'Regisztráció'
                )}
              </button>
            </form>
            
            <div className="text-center mt-3">
              <small className="text-muted">
                Már van fiókod? <Link to="/login">Jelentkezz be itt!</Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}