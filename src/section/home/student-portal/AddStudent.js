import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataService from "../../../services/data.service";

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    courseEnrolled: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Name, Email, and Password are required!");
      return;
    }
    setLoading(true);
    DataService.addStudent(formData).then((res) => {
      toast.success("Student added successfully!");
      setTimeout(() => navigate("/student-portal/students"), 1500);
    }).catch((err) => {
      setLoading(false);
      const msg = err.response?.data?.message || "Failed to add student.";
      toast.error(msg);
    });
  };

  return (
    <div className="row">
      <ToastContainer />
      <div className="col-md-12">
        <h4 className="f-700 mb-4">Add New Student</h4>
        <div className="card shadow-sm border-0 p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email <span className="text-danger">*</span></label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-control" name="phoneNo" value={formData.phoneNo} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Course Enrolled</label>
                <input type="text" className="form-control" name="courseEnrolled" value={formData.courseEnrolled} onChange={handleChange} placeholder="e.g. Digital Marketing" />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label">Temporary Password <span className="text-danger">*</span></label>
                <input type="text" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
              </div>
            </div>
            <div className="d-flex gap-3">
              <button type="submit" className="btn btn-primary" style={{ background: "#157549" }} disabled={loading}>
                {loading ? "Adding..." : "Save Student"}
              </button>
              <Link to="/student-portal/students" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
