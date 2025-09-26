import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Fazonműhely</h5>
            <p className="mb-1">Székesfehérvár, Budai út 45</p>
            <p className="mb-1">Telefon: +36 22 345 678</p>
            <p className="mb-1">Email: info@fazonmuhely.hu</p>
            <div className="mt-2">
              <small>Nyitvatartás: H-P 9:00-17:00</small>
            </div>
          </div>
          
          <div className="col-md-4 mb-3">
            <h6>Gyors linkek</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Kezdőlap</a></li>
              <li><a href="/book" className="text-light text-decoration-none">Időpontfoglalás</a></li>
              <li><a href="/login" className="text-light text-decoration-none">Bejelentkezés</a></li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h6>Térkép</h6>
            <div className="ratio ratio-16x9">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2695.391421839285!2d18.4083942156275!3d47.50105697917767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476cdc424c6c5c0d%3A0x4a7a6a9a1a0b0b0b!2sBudai%20%C3%BAt%2045%2C%208000%20Sz%C3%A9kesfeh%C3%A9rv%C3%A1r!5e0!3m2!1shu!2shu!4v1620000000000!5m2!1shu!2shu" 
                style={{border: 0, borderRadius: '5px'}}
                allowFullScreen
                loading="lazy"
                title="Fazonműhely helye"
              ></iframe>
            </div>
          </div>
        </div>
        
        <hr className="my-3" />
        <div className="text-center">
          <small>&copy; 2024 Fazonműhely - Minden jog fenntartva</small>
        </div>
      </div>
    </footer>
  );
}