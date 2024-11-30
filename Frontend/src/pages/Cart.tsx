import { useState, useEffect } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

const cartItem = [
  {
    productId: "a",
    photo:
      "https://m.media-amazon.com/images/I/71MUhny6I0L._AC_UF894,1000_QL80_FMwebp_.jpg",
    name: "MacBook",
    price: 30000,
    stock: 64,
    quantity: 45,
  },
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 200;
const total = subtotal + tax + shippingCharges;
const discount = 0;

function Cart() {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (Math.random() > 0.5) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        {cartItem.length > 0 ? (
          cartItem?.map((i, idx) => <CartItem cartItem={i} />)
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal : ₹{subtotal}</p>
        <p>Shipping Charges : ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total: ${total}</b>
        </p>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Coupon Code"
        />
        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}
        {cartItem.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
}

export default Cart;
