import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataService from "../../../services/data.service";

const AddResource = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resourceType, setResourceType] = useState("pdf");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseTag: "All",
    videoUrl: "",
    toolUsername: "",
    toolPassword: "",
    toolUrl: ""
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required!");
      return;
    }
    
    setLoading(true);
    const apiData = new FormData();
    apiData.append("title", formData.title);
    apiData.append("description", formData.description);
    apiData.append("resourceType", resourceType);
    apiData.append("courseTag", formData.courseTag);

    if (resourceType === "pdf") {
      if (!file) {
        toast.error("Please upload a PDF file.");
        setLoading(false);
        return;
      }
      apiData.append("file", file);
    } else if (resourceType === "video") {
      apiData.append("videoUrl", formData.videoUrl);
    } else if (resourceType === "tool") {
      apiData.append("toolCredentials", JSON.stringify({
        username: formData.toolUsername,
        password: formData.toolPassword,
        url: formData.toolUrl
      }));
    }

    DataService.addResource(apiData).then((res) => {
      toast.success("Resource added successfully!");
      setTimeout(() => navigate("/student-portal/resources"), 1500);
    }).catch((err) => {
      setLoading(false);
      toast.error("Failed to add resource.");
    });
  };

  return (
    <div className="row">
      <ToastContainer />
      <div className="col-md-12">
        <h4 className="f-700 mb-4">Add Learning Resource</h4>
        <div className="card shadow-sm border-0 p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">Resource Type</label>
                <select className="form-control" value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
                  <option value="pdf">PDF Document</option>
                  <option value="video">Video Embed</option>
                  <option value="tool">Tool Credentials</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Title <span className="text-danger">*</span></label>
                <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Course Tag</label>
                <input type="text" className="form-control" name="courseTag" value={formData.courseTag} onChange={handleChange} placeholder="e.g. Digital Marketing, or All" />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3"></textarea>
              </div>

              {resourceType === "pdf" && (
                <div className="col-md-12 mb-4">
                  <label className="form-label">Upload PDF <span className="text-danger">*</span></label>
                  <input type="file" className="form-control" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
                </div>
              )}

              {resourceType === "video" && (
                <div className="col-md-12 mb-4">
                  <label className="form-label">Video Embed URL <span className="text-danger">*</span></label>
                  <input type="url" className="form-control" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://www.youtube.com/embed/..." />
                </div>
              )}

              {resourceType === "tool" && (
                <div className="col-md-12 mb-4 p-3 border rounded bg-light">
                  <h6 className="mb-3">Tool Login Details</h6>
                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Login URL</label>
                      <input type="url" className="form-control" name="toolUrl" value={formData.toolUrl} onChange={handleChange} placeholder="https://semrush.com/login" />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Username / Email</label>
                      <input type="text" className="form-control" name="toolUsername" value={formData.toolUsername} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Password</label>
                      <input type="text" className="form-control" name="toolPassword" value={formData.toolPassword} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              )}

            </div>
            <div className="d-flex gap-3">
              <button type="submit" className="btn btn-primary" style={{ background: "#157549" }} disabled={loading}>
                {loading ? "Adding..." : "Save Resource"}
              </button>
              <Link to="/student-portal/resources" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddResource;
