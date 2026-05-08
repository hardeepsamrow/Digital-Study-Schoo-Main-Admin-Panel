import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataService from "../../../services/data.service";

const EditResource = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [resourceType, setResourceType] = useState("pdf");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseTag: "All",
    category: "General",
    courseDuration: "Both",
    videoUrl: "",
    toolUsername: "",
    toolPassword: "",
    toolUrl: ""
  });
  const [file, setFile] = useState(null);
  const [existingFile, setExistingFile] = useState("");

  useEffect(() => {
    document.title = "Edit Learning Resource";
    fetchResource();
  }, [id]);

  const fetchResource = () => {
    DataService.getResourceById(id).then((res) => {
      const data = res.data.data;
      setResourceType(data.resourceType);
      setFormData({
        title: data.title || "",
        description: data.description || "",
        courseTag: data.courseTag || "All",
        category: data.category || "General",
        courseDuration: data.courseDuration || "Both",
        videoUrl: data.videoUrl || "",
        toolUsername: data.toolCredentials?.username || "",
        toolPassword: data.toolCredentials?.password || "",
        toolUrl: data.toolCredentials?.url || ""
      });
      setExistingFile(data.fileUrl || "");
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      toast.error("Error fetching resource details");
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required!");
      return;
    }
    
    setUpdating(true);
    const apiData = new FormData();
    apiData.append("title", formData.title);
    apiData.append("description", formData.description);
    apiData.append("resourceType", resourceType);
    apiData.append("courseTag", formData.courseTag);
    apiData.append("category", formData.category);
    apiData.append("courseDuration", formData.courseDuration);

    if (resourceType === "pdf") {
      if (file) {
        apiData.append("file", file);
      }
    } else if (resourceType === "video") {
      apiData.append("videoUrl", formData.videoUrl);
    } else if (resourceType === "tool") {
      apiData.append("toolCredentials", JSON.stringify({
        username: formData.toolUsername,
        password: formData.toolPassword,
        url: formData.toolUrl
      }));
    }

    DataService.updateResource(id, apiData).then((res) => {
      toast.success("Resource updated successfully!");
      setTimeout(() => navigate("/student-portal/resources"), 1500);
    }).catch((err) => {
      setUpdating(false);
      toast.error("Failed to update resource.");
    });
  };

  if (loading) {
    return <div className="text-center py-5"><span className="spinner-border"></span></div>;
  }

  return (
    <div className="row">
      <ToastContainer />
      <div className="col-md-12">
        <h4 className="f-700 mb-4">Edit Learning Resource</h4>
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
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select className="form-control" name="category" value={formData.category} onChange={handleChange}>
                  <option value="General">General</option>
                  <option value="SEO">SEO</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Social Media Marketing">Social Media Marketing</option>
                  <option value="Content Marketing">Content Marketing</option>
                  <option value="Email Marketing">Email Marketing</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Course Duration</label>
                <select className="form-control" name="courseDuration" value={formData.courseDuration} onChange={handleChange}>
                  <option value="Both">Both (3 & 6 Months)</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                </select>
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3"></textarea>
              </div>

              {resourceType === "pdf" && (
                <div className="col-md-12 mb-4">
                  <label className="form-label">Upload New PDF (Leave blank to keep current)</label>
                  <input type="file" className="form-control" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
                  {existingFile && <p className="mt-2 small text-muted">Current: {existingFile.split('/').pop()}</p>}
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
              <button type="submit" className="btn btn-primary" style={{ background: "#157549" }} disabled={updating}>
                {updating ? "Updating..." : "Update Resource"}
              </button>
              <Link to="/student-portal/resources" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditResource;
