import React, { useEffect, useState } from "react";
import DataService from "../../../services/data.service";
import { ToastContainer, toast } from "react-toastify";

const VideoReviewsList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [name, setName] = useState("");
  const [altText, setAltText] = useState("");
  const [isShort, setIsShort] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    DataService.getAllVideoReviews().then((res) => {
      setData(res.data.data);
    });
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!videoUrl || !name) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    const payload = { videoUrl, name, isShort, altText };
    console.log("Submitting payload:", payload);
    DataService.addVideoReview(payload).then(
      () => {
        toast.success("Video added successfully!");
        setVideoUrl("");
        setName("");
        setAltText("");
        setIsShort(false);
        fetchVideos();
        setLoading(false);
      },
      (err) => {
        console.error("Add Video Request Failed:", err);
        const msg = err.response?.data?.message || "Failed to add video";
        toast.error(msg);
        setLoading(false);
      }
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      DataService.deleteVideoReview(id).then(() => {
        toast.success("Deleted successfully");
        fetchVideos();
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <div className="top-heading-sec-scholar">
          <h4 className="mb-0 f-700">Manage Student Video Reviews</h4>
        </div>

        <div className="card mt-4 p-4">
          <form onSubmit={handleAddVideo}>
            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Video URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="YouTube Link"
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Student Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Alt Text (SEO)</label>
                <input
                  type="text"
                  className="form-control"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="SEO Video Title"
                />
              </div>
              <div className="col-md-2">
                <label className="form-label d-block">Is it a Short?</label>
                <div className="form-check form-switch mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={isShort}
                    onChange={(e) => setIsShort(e.target.checked)}
                  />
                  <label className="form-check-label">{isShort ? "Yes" : "No"}</label>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Adding..." : "Add New Video"}
              </button>
            </div>
          </form>
        </div>

        <div className="card mt-4 p-4">
            <h5 className="f-600 mb-3">Existing Videos</h5>
            <div className="table-responsive">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Thumbnail</th>
                            <th>Name/Title</th>
                            <th>Video Link</th>
                            <th>Type</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item._id}>
                                <td>
                                    <img src={item.thumb} alt="thumb" style={{ width: '100px', borderRadius: '8px', display: 'block' }} onError={(e) => e.target.src = '../assets/img/noImage.jpg'} />
                                </td>
                                <td>{item.name}</td>
                                <td>
                                    <a href={item.videoUrl} target="_blank" rel="noreferrer" className="text-primary truncate-text" style={{ maxWidth: '200px', display: 'block' }}>
                                        {item.videoUrl}
                                    </a>
                                </td>
                                <td>
                                    <span className={`badge ${item.isShort ? 'bg-info' : 'bg-primary'}`}>
                                        {item.isShort ? 'YouTube Short' : 'Standard Video'}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>
                                        <i className="fas fa-trash-alt me-1"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length === 0 && <p className="text-center mt-3">No videos added yet.</p>}
            </div>
        </div>
      </div>
    </>
  );
};

export default VideoReviewsList;
