import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./form.css"

export default function UpdateEmployee() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState({
    name: "",
    email: "",
    mobile: "",
    department: "",
  })

  useEffect(() => {
    axios
      .get(`/api/employee/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.log("axios error", err))
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()

    axios
      .put(`/api/employee/${id}`, data)
      .then((res) => {
        alert("Employee updated successfully!")
        navigate("/")
      })
      .catch((err) => console.log("update axios err", err))
  }

  return (
    <div className="form-container">
      <h2>Update Employee</h2>

      <form onSubmit={handleSubmit} className="form-box">
        <input
          type="text"
          placeholder="Enter your name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
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
        />


        <input
          type="text"
          placeholder="Enter your department"
          value={data.department}
          onChange={(e) => setData({ ...data, department: e.target.value })}
        />

        <button type="submit">UPDATE</button>
      </form>
    </div>
  )
}
