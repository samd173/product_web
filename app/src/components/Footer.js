import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-dark text-light mt-5">

      <div className="container py-5">
        <div className="row">

          {/* 🌱 BRAND */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold text-success">🌱 AgroMart</h4>
            <p className="text-secondary">
              Fresh vegetables delivered directly from farmers to your home.
              Fast, reliable and affordable service.
            </p>

            <div className="d-flex gap-3 fs-5">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-light">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-light">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-light">
                <FaTwitter />
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-light">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* 🔗 LINKS */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Quick Links</h5>

            <ul className="list-unstyled">
              <li><Link to="/home" className="text-secondary text-decoration-none">Home</Link></li>
              <li><Link to="/crops" className="text-secondary text-decoration-none">Crops</Link></li>
              <li><Link to="/cart" className="text-secondary text-decoration-none">Cart</Link></li>
              <li><Link to="/orders" className="text-secondary text-decoration-none">Orders</Link></li>
            </ul>
          </div>

          {/* 📞 CONTACT */}
          <div className="col-md-5 mb-4">
            <h5 className="fw-bold">Contact</h5>

            <p className="text-secondary mt-3 mb-1">
              📍 Nagpur, Maharashtra, India
            </p>

            <p className="text-secondary mb-1">
              📧 support@agromart.com
            </p>

            <p className="text-secondary">
              📞 +91 9876543210
            </p>
          </div>

        </div>

        <hr className="border-secondary" />

        {/* 🔥 TRUST BADGES */}
        <div className="row text-center small text-secondary mb-3">
          <div className="col">🚚 Fast Delivery</div>
          <div className="col">🔒 Secure Payment</div>
          <div className="col">🥬 Fresh Guarantee</div>
          <div className="col">💯 Quality</div>
        </div>

        {/* COPYRIGHT */}
        <div className="text-center text-secondary small">
          © 2026 AgroMart. All rights reserved.
        </div>
      </div>

      {/* 🔥 FLOAT BUTTONS */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noreferrer"
        className="btn btn-success position-fixed bottom-0 end-0 m-3 rounded-circle"
      >
        💬
      </a>

      <button
        className="btn btn-success position-fixed bottom-0 end-0 m-3 mb-5 rounded-circle"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ⬆️
      </button>

    </footer>
  );
}

export default Footer;