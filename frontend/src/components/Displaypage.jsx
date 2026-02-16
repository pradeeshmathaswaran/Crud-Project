import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./employee.css";

export default function DisplayEmployee() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/employee")
      .then((res) => setData(res.data))
      .catch((err) => console.log("axios err", err));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this employee?")) return;

    axios
      .delete(`http://localhost:5000/employee/${id}`)
      .then(() => {
        setData(data.filter((item) => item._id !== id));
      })
      .catch((err) => console.log("delete err", err));
  };

  const handleUpdate = (id) => {
    navigate(`/updateEmp/${id}`);
  };

  return (
    <div className="emp-container">
      <div className="emp-header">
        <h2>Employee Details</h2>
        <button className="add-btn" onClick={() => navigate("/insertemp")}>
          + Add Employee
        </button>
      </div>

      <table className="emp-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>MOBILE NUM</th>
            <th>DEPARTMENT</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {data.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.mobile}</td>
              <td>{employee.department}</td>

              <td>
                <button className="edit-btn" onClick={() => handleUpdate(employee._id)}>
                  Edit
                </button>

                <button className="delete-btn" onClick={() => handleDelete(employee._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
