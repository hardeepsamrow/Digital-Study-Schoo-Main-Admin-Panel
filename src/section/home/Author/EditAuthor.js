import React, { useState, useRef, useEffect } from "react";
import DataService from "../../../services/data.service";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditAuthor = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [designation, setDesignation] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [twitter, setTwitter] = useState("");
    const [quora, setQuora] = useState("");
    const [education, setEducation] = useState("");
    const [authorType, setAuthorType] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const inputFileRef = useRef();
    const imgRef = useRef();

    useEffect(() => {
        DataService.getAuthorById(id).then((res) => {
            const author = res.data.data;
            setName(author.name || "");
            setBio(author.bio || "");
            setDesignation(author.designation || "");
            setSpecialization(author.specialization || "");
            setLinkedin(author.linkedin || "");
            setFacebook(author.facebook || "");
            setInstagram(author.instagram || "");
            setTwitter(author.twitter || "");
            setQuora(author.quora || "");
            setEducation(author.education || "");
            setAuthorType(author.authorType || "");
            setEmail(author.email || "");
            if (author.image) {
                imgRef.current.src = `https://backend.digitalstudyschool.com${author.image.url}`;
            }
        });
    }, [id]);

    const onFileChangeCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
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
        setLoading(true);
        const data = new FormData();
        data.append("name", name);
        data.append("bio", bio);
        data.append("designation", designation);
        data.append("specialization", specialization);
        data.append("linkedin", linkedin);
        data.append("facebook", facebook);
        data.append("instagram", instagram);
        data.append("twitter", twitter);
        data.append("quora", quora);
        data.append("education", education);
        data.append("authorType", authorType);
        data.append("email", email);
        if (password) {
            data.append("password", password);
        }
        if (file) {
            data.append("image", file);
        }

        DataService.updateAuthor(id, data).then(
            () => {
                toast.success("Author Updated Successfully!!!");
                setTimeout(() => navigate("/authors"), 2000);
            },
            (error) => {
                setLoading(false);
                toast.error("Something went wrong");
            }
        );
    };

    return (
        <div className="container-fluid">
            <ToastContainer />
            <div className="row">
                <div className="d-flex w-100 justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 f-700">Edit Author</h4>
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
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Author Type</label>
                                        <input type="text" className="form-control" value={authorType} onChange={(e) => setAuthorType(e.target.value)} placeholder="E.g. Company Staff, Guest Author" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Education</label>
                                        <input type="text" className="form-control" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="E.g. MBA in Marketing" />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Designation</label>
                                    <input type="text" className="form-control" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Job Title" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Specialization</label>
                                    <input type="text" className="form-control" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="E.g. SEO, Content Marketing" />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">LinkedIn Profile URL</label>
                                        <input type="text" className="form-control" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Twitter Profile URL</label>
                                        <input type="text" className="form-control" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..." />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Facebook Profile URL</label>
                                        <input type="text" className="form-control" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Instagram Profile URL</label>
                                        <input type="text" className="form-control" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Quora Profile URL</label>
                                    <input type="text" className="form-control" value={quora} onChange={(e) => setQuora(e.target.value)} placeholder="https://quora.com/..." />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password (Leave blank to keep current)</label>
                                    <input type="password" title="Set a new password for author login" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Bio</label>
                                    <textarea className="form-control" rows="4" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short Biography"></textarea>
                                </div>
                                <div className="d-flex justify-content-start">
                                    <button className="btn btn-primary" type="submit" disabled={loading}>
                                        {loading && <span className="spinner-border spinner-border-sm me-1"></span>}
                                        Update Author
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

export default EditAuthor;
