import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataService from "../../../services/data.service";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    courseEnrolled: "",
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    DataService.getStudentById(id).then((res) => {
      const student = res.data.data;
      setFormData({
        name: student.name || "",
        email: student.email || "",
        phoneNo: student.phoneNo || "",
        password: "", // Leave blank unless they want to change it
        courseEnrolled: student.courseEnrolled || "",
        isActive: student.isActive !== false
      });
      setFetching(false);
    }).catch((err) => {
      toast.error("Error fetching student details");
      setFetching(false);
    });
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required!");
      return;
    }
    setLoading(true);
    
    // Only send password if it was filled out
    const updateData = { ...formData };
    if (!updateData.password) {
      delete updateData.password;
    }

    DataService.updateStudent(id, updateData).then((res) => {
      toast.success("Student updated successfully!");
      setTimeout(() => navigate("/student-portal/students"), 1500);
    }).catch((err) => {
      setLoading(false);
      const msg = err.response?.data?.message || "Failed to update student.";
      toast.error(msg);
    });
  };

  if (fetching) return <div className="text-center p-5">Loading student data...</div>;

  return (
    <div className="row">
      <ToastContainer />
      <div className="col-md-12">
        <h4 className="f-700 mb-4">Edit Student Profile</h4>
        <div className="card shadow-sm border-0 p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email <span className="text-danger">*</span></label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required disabled />
                <small className="text-muted">Email cannot be changed.</small>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-control" name="phoneNo" value={formData.phoneNo} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Course Enrolled</label>
                <input type="text" className="form-control" name="courseEnrolled" value={formData.courseEnrolled} onChange={handleChange} placeholder="e.g. Digital Marketing" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Change Password</label>
                <input type="text" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current password" />
              </div>
              <div className="col-md-6 mb-4 d-flex align-items-center">
                <div className="form-check mt-4">
                  <input className="form-check-input" type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="isActive">
                    Account is Active
                  </label>
                </div>
              </div>
            </div>
            <div className="d-flex gap-3">
              <button type="submit" className="btn btn-primary" style={{ background: "#157549" }} disabled={loading}>
                {loading ? "Updating..." : "Update Student"}
              </button>
              <Link to="/student-portal/students" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
