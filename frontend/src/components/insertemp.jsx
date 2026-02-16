import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./form.css"

export default function InsertEmp() {
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: "",
    email: "",
    mobile: "",
    department: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post(`${import.meta.env.VITE_API_URL}/employee`, data)
      .then(() => {
        alert("Employee details inserted")
        setData({ name: "", email: "", mobile: "", department: "" })
        navigate("/")
      })
      .catch((err) => console.log("insert err", err))
  }

  return (
    <div className="form-container">
      <h2>Insert Employee Details</h2>

      <form onSubmit={handleSubmit} className="form-box">
        <input
          type="text"
          placeholder="Enter your name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Enter your email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Enter your mobile number"
          value={data.mobile}
          onChange={(e) => {
            if (e.target.value.length <= 10) {
              setData({ ...data, mobile: e.target.value });
            }
          }}
          required
        />

        <input
          type="text"
          placeholder="Enter your department"
          value={data.department}
          onChange={(e) => setData({ ...data, department: e.target.value })}
          required
        />

        <button type="submit">INSERT</button>
      </form>
    </div>
  )
}
