import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItem as cardprops } from "../types/types";

type CartItemProps = {
  cartItem: cardprops;
  incrementHandler: (cartItem: cardprops) => void;
  decrementHandler: (cartItem: cardprops) => void;
  removeHandler: (id: string) => void;
};

function CartItem({
  cartItem,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: CartItemProps) {
  const { photo, productId, name, price, quantity } = cartItem;

  return (
    <div className="cart-item">
      <img src={`${server}/${photo}`} alt="photo" />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>
      <div>
        <button onClick={() => decrementHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button onClick={() => incrementHandler(cartItem)}>+</button>
      </div>
      <button onClick={() => removeHandler(productId)}>
        <FaTrash />
      </button>
    </div>
  );
}

export default CartItem;
