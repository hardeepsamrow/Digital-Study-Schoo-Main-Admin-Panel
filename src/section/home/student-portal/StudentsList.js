import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataService from "../../../services/data.service";
import moment from "moment";

const StudentsList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Student Portal - Students";
    getData();
  }, []);

  const getData = () => {
    DataService.getAllStudents().then((res) => {
      setData(res.data.data);
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      toast.error("Error fetching students");
    });
  };

  const deleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setLoading(true);
      DataService.deleteStudent(id).then(() => {
        toast.success("Student Deleted Successfully");
        getData();
      }).catch((err) => {
        setLoading(false);
        toast.error("Error deleting student");
      });
    }
  };

  const formatPhoneForWA = (phone) => {
    if (!phone) return "";
    const cleaned = String(phone).replace(/\D/g, "");
    if (cleaned.length === 10) return `91${cleaned}`;
    return cleaned;
  };

  return (
    <div className="row">
      <ToastContainer />
      <div className="col-md-12">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="f-700">All Enrolled Students</h4>
          <Link to="/student-portal/students/add" className="btn btn-primary" style={{ background: "#157549" }}>
            + Add New Student
          </Link>
        </div>
        
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Course</th>
              <th scope="col">Duration</th>
              <th scope="col">Status</th>
              <th scope="col">Enrolled Date</th>
              <th scope="col" className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center">Loading...</td></tr>
            ) : data && data.length > 0 ? (
              data.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    {item.phoneNo}
                    {item.phoneNo && (
                      <a href={`https://web.whatsapp.com/send?phone=${formatPhoneForWA(item.phoneNo)}&text=Hi ${encodeURIComponent(item.name)}, here are your login details for the Digital Study School student portal...`} target="_blank" rel="noreferrer" className="ms-2" title="Message on WhatsApp">
                        <i className="fab fa-whatsapp text-success fs-5"></i>
                      </a>
                    )}
                  </td>
                  <td>{item.courseEnrolled || "N/A"}</td>
                  <td>{item.courseDuration || "N/A"}</td>
                  <td>{item.isActive ? "Active" : "Inactive"}</td>
                  <td>{moment(item.createdAt).format("ll")}</td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Link to={`/student-portal/students/edit/${item._id}`} className="btn btn-sm btn-primary">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteStudent(item._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center">No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsList;
