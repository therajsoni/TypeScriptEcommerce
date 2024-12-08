import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { server } from "../redux/store";
import { cartReducerInitialState } from "../types/reduce-types";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

function Shipping() {
  const { cartItems, total } = useSelector(
    (state: { cartReducer: cartReducerInitialState }) => state.cartReducer
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });
  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigateShippingFunction = () => {
    if (cartItems.length <= 0) return navigate("/cart");
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingInfo(shippingInfo));
    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create`,
        {
          amount: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/pay", {
        state: data.clientSecret,
      });
    } catch (error) {
      console.log(error);
      toast.error("SomeThing Went Wrong!");
    }
  };

  useEffect(() => {
    navigateShippingFunction();
  }, [cartItems]);

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>
      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>
        <input
          type="text"
          placeholder="Address"
          name="address"
          onChange={changeHandler}
          value={shippingInfo.address}
        />
        <input
          type="text"
          placeholder="City"
          name="city"
          onChange={changeHandler}
          value={shippingInfo.city}
        />
        <input
          type="text"
          placeholder="State"
          name="state"
          onChange={changeHandler}
          value={shippingInfo.state}
        />
        <input
          type="text"
          placeholder="Country"
          name="country"
          onChange={changeHandler}
          value={shippingInfo.country}
        />
        <input
          type="number"
          placeholder="PinCode"
          name="pincode"
          onChange={changeHandler}
          value={shippingInfo.pinCode}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Shipping;
