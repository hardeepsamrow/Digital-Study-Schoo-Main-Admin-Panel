import React, { useState, useRef } from "react";
import DataService from "../../../services/data.service";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAuthor = () => {
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [designation, setDesignation] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState(null);
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = () => {
        setLoading(true);
        DataService.sendAuthorOtp({ action: "CREATE_AUTHOR" }).then(
            () => {
                setLoading(false);
                setOtpSent(true);
                toast.success("OTP sent to admin email");
            },
            (error) => {
                setLoading(false);
                toast.error("Failed to send OTP to admin");
            }
        );
    };
    const inputFileRef = useRef();
    const imgRef = useRef();

    const onFileChangeCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                toast.error("Please select a valid image file");
                setFile(null);
                e.target.value = null;
                return;
            }
            setFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onloadend = (theFile) => {
                imgRef.current.src = theFile.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFile = () => inputFileRef.current.click();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) {
            toast.error("Name is required");
            return;
        }
        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }
        setLoading(true);
        const data = new FormData();
        data.append("name", name);
        data.append("bio", bio);
        data.append("designation", designation);
        data.append("specialization", specialization);
        data.append("linkedin", linkedin);
        data.append("email", email);
        data.append("password", password);
        data.append("otp", otp);
        if (file) {
            data.append("image", file);
        }

        DataService.addAuthor(data).then(
            () => {
                toast.success("Author Added Successfully!!!");
                setTimeout(() => navigate("/authors"), 2000);
            },
            (error) => {
                setLoading(false);
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        );
    };

    return (
        <div className="container-fluid">
            <ToastContainer />
            <div className="row">
                <div className="d-flex w-100 justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 f-700">Add New Author</h4>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body text-center">
                                <h4 className="f-700">Profile Picture</h4>
                                <div className="Product-thumbnail" onClick={triggerFile} style={{ cursor: 'pointer', border: '1px dashed #ccc', padding: '10px' }}>
                                    <img
                                        style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }}
                                        src="../assets/img/upload-image.png"
                                        ref={imgRef}
                                        alt="Author"
                                    />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={inputFileRef}
                                    style={{ display: 'none' }}
                                    onChangeCapture={onFileChangeCapture}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="card mb-5">
                            <div className="card-body p-4">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Designation</label>
                                    <input type="text" className="form-control" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Job Title" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Specialization</label>
                                    <input type="text" className="form-control" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="E.g. SEO, Content Marketing" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">LinkedIn Profile URL</label>
                                    <input type="text" className="form-control" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <div className="input-group">
                                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required />
                                        <button className="btn btn-outline-secondary" type="button" onClick={handleSendOtp} disabled={loading}>
                                            {otpSent ? "Resend OTP" : "Send OTP"}
                                        </button>
                                    </div>
                                </div>
                                {otpSent && (
                                    <div className="mb-3">
                                        <label className="form-label">OTP Verification</label>
                                        <input type="text" className="form-control" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" required />
                                        <small className="text-success">OTP sent to admin email for security</small>
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" title="Set a password for author login" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Login Password" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Bio</label>
                                    <textarea className="form-control" rows="4" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short Biography"></textarea>
                                </div>
                                <div className="d-flex justify-content-start">
                                    <button className="btn btn-primary" type="submit" disabled={loading}>
                                        {loading && <span className="spinner-border spinner-border-sm me-1"></span>}
                                        Save Author
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddAuthor;
