import { ChangeEvent, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function Shipping() {
  const navigate = useNavigate();
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
  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>
      <form>
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
