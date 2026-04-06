import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="container py-5">
        <div className="row">

          {/* 🌱 BRAND */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold text-success">🌱 AgroMart</h4>
            <p className="text-light-muted">
              Fresh vegetables delivered directly from farmers to your home.
              Fast, reliable and affordable service.
            </p>

            {/* 📱 SOCIAL (CLICKABLE FIX) */}
            <div className="mt-3 d-flex gap-3 fs-5">
              <a href="#"><FaFacebook className="social" /></a>
              <a href="#"><FaInstagram className="social" /></a>
              <a href="#"><FaTwitter className="social" /></a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                <FaWhatsapp className="social" />
              </a>
            </div>
          </div>

          {/* 🔗 LINKS */}
          <div className="col-md-3 mb-4">
            <h5>Quick Links</h5>

            <ul className="list-unstyled">
              <li><Link to="/home" className="footer-link">Home</Link></li>
              <li><Link to="/crops" className="footer-link">Crops</Link></li>
              <li><Link to="/cart" className="footer-link">Cart</Link></li>
              <li><Link to="/corders" className="footer-link">Orders</Link></li>
            </ul>
          </div>

          {/* ⚖️ LEGAL + CONTACT */}
          <div className="col-md-5 mb-4">
            <h5>Legal & Contact</h5>

            <ul className="list-unstyled">
              <li><Link to="#" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="#" className="footer-link">Terms & Conditions</Link></li>
              <li><Link to="#" className="footer-link">Refund Policy</Link></li>
            </ul>

            <p className="mt-3 text-light-muted">
              📍 Nagpur, Maharashtra, India
            </p>

            <p className="text-light-muted">
              📧 support@agromart.com
            </p>

            <p className="text-light-muted">
              📞 +91 9876543210
            </p>
          </div>

        </div>

        <hr />

        {/* 🔥 TRUST BADGES */}
        <div className="row text-center mb-3">
          <div className="col">🚚 Fast Delivery</div>
          <div className="col">🔒 Secure Payment</div>
          <div className="col">🥬 Fresh Guarantee</div>
          <div className="col">💯 Quality</div>
        </div>

        {/* COPYRIGHT */}
        <div className="text-center text-muted">
          © 2026 AgroMart. All rights reserved.
        </div>
      </div>

      {/* 🔥 WHATSAPP FLOAT */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noreferrer"
        className="whatsapp"
      >
        💬
      </a>

      {/* 🔥 BACK TO TOP */}
      <button
        className="top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ⬆️
      </button>

      {/* 🔥 STYLES */}
      <style>{`
        .footer {
          background: linear-gradient(135deg, #111, #1a1a1a);
          color: #fff;
          animation: fadeUp 1s ease;
        }

        .footer-link {
          color: #bbb;
          text-decoration: none;
          display: block;
          margin-bottom: 8px;
          transition: 0.3s;
        }

        .footer-link:hover {
          color: #198754;
          padding-left: 5px;
        }

        .text-light-muted {
          color: #aaa;
        }

        .social {
          cursor: pointer;
          transition: 0.3s;
        }

        .social:hover {
          color: #198754;
          transform: scale(1.2);
        }

        .whatsapp {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #25D366;
          color: white;
          padding: 12px;
          border-radius: 50%;
          font-size: 20px;
          text-decoration: none;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          z-index: 999;
        }

        .top-btn {
          position: fixed;
          bottom: 80px;
          right: 20px;
          background: #198754;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 50%;
          z-index: 999;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </footer>
  );
}

export default Footer;