import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (res.ok) {
        onLogin(data.user, data.token);
      } else {
        alert(data.error || 'Hiba a bejelentkezésnél');
      }
    } catch (error) {
      alert('Hálózati hiba történt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Bejelentkezés</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Felhasználónév vagy Email</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Add meg a felhasználóneved vagy email-ed"
                  value={form.login}
                  onChange={e => setForm({...form, login: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Jelszó</label>
                <input 
                  type="password" 
                  className="form-control"
                  placeholder="Add meg a jelszavad"
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
                    Bejelentkezés...
                  </>
                ) : (
                  'Belépés'
                )}
              </button>
            </form>
            
            <div className="text-center mt-3">
              <small className="text-muted">
                Még nincs fiókod? <Link to="/register">Regisztrálj itt!</Link>
              </small>
            </div>

            {/* Fodrász bejelentkezési adatok megjelenítése */}
            <div className="mt-4 p-3 bg-light rounded">
              <h6 className="mb-2">Fodrász bejelentkezési adatok:</h6>
              <small className="text-muted">
                <div>eva_stylist / eva123</div>
                <div>anna_hair / anna123</div>
                <div>mike_barber / mike123</div>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}