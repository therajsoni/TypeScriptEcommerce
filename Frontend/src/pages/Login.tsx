import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>
        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value={""}>Select Gender</option>
            <option value={"male"}>Select Male</option>
            <option value={"female"}>Select Female</option>
          </select>
        </div>
        <div>
          <label>Date of birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <p>Already Signed In Once</p>
          <button>
            <FcGoogle />
            <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
}
