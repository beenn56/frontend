import React, { useState, useEffect } from 'react';

export default function Profile({ user, onUserUpdate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    profile_picture: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/users/${user.id}`);
      const data = await res.json();
      setProfile(data);
      setForm({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || '',
        profile_picture: data.profile_picture || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch(`http://localhost:3001/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setMessage('Profil sikeresen frissítve');
        // Frissítjük a user adatokat
        const updatedUser = { ...user, ...form };
        onUserUpdate(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        const data = await res.json();
        setMessage('Hiba: ' + data.error);
      }
    } catch (error) {
      setMessage('Hálózati hiba történt');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setMessage('Az új jelszavak nem egyeznek');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password
        })
      });

      if (res.ok) {
        setMessage('Jelszó sikeresen megváltoztatva');
        setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        const data = await res.json();
        setMessage('Hiba: ' + data.error);
      }
    } catch (error) {
      setMessage('Hálózati hiba történt');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm({ ...form, profile_picture: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="text-center"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Profilom</h2>
            
            {/* Tab navigáció */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profil adatok
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  Jelszó változtatás
                </button>
              </li>
            </ul>

            {message && (
              <div className={`alert ${message.includes('Hiba') ? 'alert-danger' : 'alert-success'}`}>
                {message}
              </div>
            )}

            {/* Profil tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate}>
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <img 
                      src={form.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.full_name)}&size=120&background=random`}
                      alt="Profilkép"
                      className="rounded-circle shadow"
                      style={{width: '120px', height: '120px', objectFit: 'cover'}}
                    />
                    <label className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle">
                      <i className="bi bi-camera"></i>
                      <input 
                        type="file" 
                        className="d-none" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Teljes név *</label>
                  <input 
                    type="text" 
                    className="form-control"
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
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={saving}
                >
                  {saving ? 'Mentés...' : 'Profil frissítése'}
                </button>
              </form>
            )}

            {/* Jelszó tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange}>
                <div className="mb-3">
                  <label className="form-label">Jelenlegi jelszó *</label>
                  <input 
                    type="password" 
                    className="form-control"
                    value={passwordForm.current_password}
                    onChange={e => setPasswordForm({...passwordForm, current_password: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Új jelszó *</label>
                  <input 
                    type="password" 
                    className="form-control"
                    value={passwordForm.new_password}
                    onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Új jelszó megerősítése *</label>
                  <input 
                    type="password" 
                    className="form-control"
                    value={passwordForm.confirm_password}
                    onChange={e => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={saving}
                >
                  {saving ? 'Mentés...' : 'Jelszó megváltoztatása'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}