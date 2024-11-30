import { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const user = {
  _id: "a",
  role: "admin",
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const LogoutHandler = () => {
    setIsOpen(false);
  };

  return (
    <nav className="header">
      <Link onClick={() => setIsOpen(false)} to="/">
        HOME
      </Link>
      <Link onClick={() => setIsOpen(false)} to="/search">
        <FaSearch />
      </Link>
      <Link onClick={() => setIsOpen(false)} to="/cart">
        <FaShoppingBag />
      </Link>
      {user?._id ? (
        <>
          <button onClick={(prev) => setIsOpen(!prev)}>
            <FaUser />
          </button>
          <dialog open={isOpen}>
            <div>
              {user?.role === "admin" && (
                <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">
                  Admin
                </Link>
              )}
              <Link onClick={() => setIsOpen(false)} to="/orders">
                Orders
              </Link>
              <button onClick={LogoutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to="/login">
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
}
