import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-light mt-5">

      <div className="container py-4">
        <div className="row">

          {/* BRAND */}
          <div className="col-md-4 mb-4">
            <h4 className="text-success">🌱 AgroMart</h4>
            <p className="text-secondary">
              Fresh vegetables delivered directly from farmers.
            </p>
          </div>

          {/* LINKS */}
          <div className="col-md-3 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/home" className="text-decoration-none text-secondary">Home</Link></li>
              <li><Link to="/crops" className="text-decoration-none text-secondary">Crops</Link></li>
              <li><Link to="/cart" className="text-decoration-none text-secondary">Cart</Link></li>
              <li><Link to="/corders" className="text-decoration-none text-secondary">Orders</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="col-md-5 mb-4">
            <h5>Contact</h5>
            <p className="text-secondary">📍 Nagpur, India</p>
            <p className="text-secondary">📧 support@agromart.com</p>
            <p className="text-secondary">📞 +91 9876543210</p>
          </div>

        </div>

        <hr />

        {/* TRUST */}
        <div className="row text-center small text-secondary mb-3">
          <div className="col-6 col-md-3">🚚 Fast Delivery</div>
          <div className="col-6 col-md-3">🔒 Secure Payment</div>
          <div className="col-6 col-md-3">🥬 Fresh</div>
          <div className="col-6 col-md-3">💯 Quality</div>
        </div>

        <div className="text-center text-secondary">
          © 2026 AgroMart
        </div>
      </div>

      {/* FLOAT BUTTONS */}
      <a
        href="https://wa.me/919876543210"
        className="btn btn-success position-fixed bottom-0 end-0 m-3 mb-5"
      >
        💬
      </a>

      <button
        className="btn btn-success position-fixed bottom-0 end-0 m-3"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ⬆️
      </button>

    </footer>
  );
}

export default Footer;