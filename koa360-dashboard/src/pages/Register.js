import { useState } from "react";
import api from "../api/api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [regNo, setRegNo] = useState(""); 
  const [patientNo, setPatientNo] = useState(""); // Manual patient number
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { username, password };

      if (role === "doctor") {
        payload.regNo = regNo;
      } else {
        payload.doctorRegNo = regNo;
        payload.patientNo = patientNo; // include manual patient number
      }

      await api.post(`/register/${role}`, payload);

      alert(`Registration successful! ${role === "patient" ? "Patient No: " + patientNo : ""}`);

      // Reset form
      setUsername("");
      setPassword("");
      setRegNo("");
      setPatientNo("");
      setRole("patient");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        {role === "patient" && (
          <input
            type="text"
            value={patientNo}
            onChange={(e) => setPatientNo(e.target.value)}
            placeholder="Patient No"
            className="w-full p-2 border rounded"
            required
          />
        )}

        <input
          type="text"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
          placeholder={role === "doctor" ? "Doctor Reg No" : "Doctor's Reg No"}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
