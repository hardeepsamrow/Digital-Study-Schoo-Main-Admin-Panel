import React, { useEffect, useState, useRef } from "react";
import DataService from "../../../services/data.service";
import { ToastContainer, toast } from "react-toastify";

const CertifiedStudentsList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        DataService.getAllCertifiedStudents().then((res) => {
            setData(res?.data?.data || []);
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Check if file is larger than 5MB (5,242,880 bytes)
            if (selectedFile.size > 5242880) {
                toast.error("File is too large! Please upload an image smaller than 5MB. (A large file causes a Network Error)");
                e.target.value = null; // reset input
                setFile(null);
                setPreview(null);
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleAddStudent = (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please upload a photo");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);
        formData.append("name", name || "Student");

        DataService.addCertifiedStudent(formData).then(
            () => {
                toast.success("Student added successfully!");
                setName("");
                setFile(null);
                setPreview(null);
                fetchStudents();
                setLoading(false);
            },
            (err) => {
                console.error("Upload error details:", err, err.response);
                toast.error(err.response?.data?.message || err.message || "Failed to add student");
                setLoading(false);
            }
        );
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this student image?")) {
            DataService.deleteCertifiedStudent(id).then(() => {
                toast.success("Deleted successfully");
                fetchStudents();
            });
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="container">
                <div className="top-heading-sec-scholar">
                    <h4 className="mb-0 f-700">Manage Certified Students Photos</h4>
                </div>

                <div className="card mt-4 p-4">
                    <form onSubmit={handleAddStudent}>
                        <div className="row align-items-end">
                            <div className="col-md-5">
                                <label className="form-label">Student Name (for alt text)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter student name"
                                />
                            </div>
                            <div className="col-md-5">
                                <label className="form-label">Upload Photo</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    accept="image/*"
                                />
                            </div>
                            <div className="col-md-2">
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? "Uploading..." : "Add Photo"}
                                </button>
                            </div>
                        </div>
                        {preview && (
                            <div className="mt-3">
                                <p className="mb-1">Preview:</p>
                                <img src={preview} alt="preview" style={{ width: '150px', borderRadius: '10px', border: '1px solid #ddd', display: 'block' }} />
                            </div>
                        )}
                    </form>
                </div>

                <div className="card mt-4 p-4">
                    <h5 className="f-600 mb-3">Existing Students</h5>
                    <div className="row">
                        {data.map((item) => (
                            <div className="col-md-3 mb-4" key={item._id}>
                                <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                    <div style={{ position: 'relative', paddingTop: '100%' }}>
                                        <img 
                                            src={"https://backend.digitalstudyschool.com" + item.image?.url} 
                                            alt={item.name} 
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            onError={(e) => e.target.src = '../assets/img/noImage.jpg'}
                                        />
                                    </div>
                                    <div className="card-body p-2 text-center">
                                        <p className="small mb-2 text-truncate">{item.name}</p>
                                        <button className="btn btn-danger btn-sm w-100" onClick={() => handleDelete(item._id)}>
                                            <i className="fas fa-trash-alt me-1"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {data.length === 0 && (
                            <div className="col-12 text-center py-4">
                                <p className="text-muted">No photos added yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CertifiedStudentsList;
