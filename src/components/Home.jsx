import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const staffRes = await fetch('http://localhost:3001/api/staff');
        const staffData = await staffRes.json();
        setStaffMembers(staffData);

        const servicesRes = await fetch('http://localhost:3001/api/services');
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setStaffMembers([
          { id: 1, display_name: 'Éva', bio: 'Női fodrász szakember, hosszú hajak vágása és festése' },
          { id: 2, display_name: 'István', bio: 'Férfi fodrász, klasszikus és modern férfi friurák' },
          { id: 3, display_name: 'Anikó', bio: 'Gyermek fodrász, kreatív hajviselek' }
        ]);
        setServices([
          { id: 1, name: 'Férfi hajvágás', duration_minutes: 30, price_cents: 4500 },
          { id: 2, name: 'Női hajvágás', duration_minutes: 60, price_cents: 8000 },
          { id: 3, name: 'Teljes hajfestés', duration_minutes: 120, price_cents: 15000 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const galleryImages = [
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=300&fit=crop'
  ];

  const staffDetails = {
    1: {
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop&crop=face',
      specialties: ['Női hajvágás', 'Hajfestés', 'Balayage'],
      title: 'Női fodrász'
    },
    2: {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      specialties: ['Férfi hajvágás', 'Borotválás', 'Szakáll formázás'],
      title: 'Férfi fodrász'
    },
    3: {
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      specialties: ['Gyermek hajvágás', 'Kreatív friurák', 'Divatos vágások'],
      title: 'Gyermek fodrász'
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Adatok betöltése...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center text-white py-5 mb-5 rounded" 
               style={{background: 'linear-gradient(135deg, #1a2a6c 0%, #2d5b8a 50%, #3a7bd5 100%)'}}>
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">Üdvözöljük a Fazonműhelyben!</h1>
          <p className="lead mb-4">Professzionális fodrászati szolgáltatások férfiaknak és nőknek</p>
          <Link to="/register" className="btn btn-light btn-lg px-4 me-2">Regisztráció</Link>
          <Link to="/book" className="btn btn-outline-light btn-lg px-4">Időpontfoglalás</Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="mb-5">
        <h2 className="text-center mb-4">Munkáink</h2>
        <div className="row g-3">
          {galleryImages.map((img, index) => (
            <div key={index} className="col-md-3 col-6">
              <img src={img} alt={`Fodrászati munkák ${index + 1}`} className="img-fluid rounded shadow" />
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="mb-5">
        <h2 className="text-center mb-4">Szolgáltatásaink és Áraink</h2>
        <div className="row">
          {services.map((service) => (
            <div key={service.id} className="col-md-4 mb-3">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <h5 className="card-title">{service.name}</h5>
                  <p className="card-text">
                    <strong className="text-primary">{service.price_cents / 100} Ft</strong><br/>
                    <small className="text-muted">{service.duration_minutes} perc</small>
                  </p>
                  {service.description && (
                    <p className="card-text small text-muted">{service.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Staff Section */}
      <section className="mb-5">
        <h2 className="text-center mb-4">Fodrászaink</h2>
        <div className="row">
          {staffMembers.map(staff => (
            <div key={staff.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow border-0">
                <img 
                  src={staffDetails[staff.id]?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop&crop=face'} 
                  className="card-img-top" 
                  alt={staff.display_name} 
                  style={{height: '300px', objectFit: 'cover'}} 
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{staff.display_name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {staffDetails[staff.id]?.title || 'Fodrász'}
                  </h6>
                  <p className="card-text">{staff.bio || 'Professzionális fodrász'}</p>
                  <div>
                    {(staffDetails[staff.id]?.specialties || ['Fodrászat']).map((spec, idx) => (
                      <span key={idx} className="badge bg-primary me-1 mb-1">{spec}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-5 bg-light rounded">
        <h3>Készen áll az új frizurára?</h3>
        <p className="mb-4">Foglaljon időpontot még ma!</p>
        <Link to="/book" className="btn btn-primary btn-lg">Időpontfoglalás</Link>
      </section>
    </div>
  );
}