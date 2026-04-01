import React, { useEffect, useState, useRef } from "react";
import DataService from "../../../services/data.service";
import AuthService from "../../../services/auth.service";
import { json, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { ToastContainer, toast } from "react-toastify";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

const styles = {
  input: {
    opacity: "0%",
    position: "absolute",
  },
};
let inputProps = {
  placeholder: "Date (YYYY-MM-DD)",
};
const MAX_COUNT = 5;

const SeoIndicator = ({ value, max }) => {
  const length = value ? value.length : 0;
  const percentage = Math.min((length / max) * 100, 100);

  let color = "#ffc107"; // Warning (Yellow/Orange) - Too short
  let status = "Too Short";

  if (length === 0) {
    status = "Empty";
  } else if (length > max) {
    color = "#dc3545"; // Error (Red) - Too long
    status = "Too Long";
  } else if (length >= max * 0.5) {
    color = "#198754"; // Success (Green) - Good
    status = "Good";
  }

  return (
    <div style={{ marginTop: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
        <span style={{ color: color, fontWeight: 'bold' }}>
          {status}
        </span>
        <span style={{ color: length > max ? '#dc3545' : '#6c757d' }}>{length} / {max} px (approx chars)</span>
      </div>
      <div style={{ height: '5px', width: '100%', backgroundColor: '#e9ecef', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${length > max ? 100 : percentage}%`,
          backgroundColor: color,
          borderRadius: '3px',
          transition: 'width 0.3s ease, background-color 0.3s ease'
        }}></div>
      </div>
    </div>
  );
};

const AddBlogPost = () => {

  const form = useRef();
  const [slot, setSlot] = useState("");
  const [corrected, setCorrected] = useState("");
  const [name, setName] = useState("");

  const [url, setUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");

  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [metaKeyWords, setMetaKeyWords] = useState([]);
  const [sPopup, setSPopup] = useState(false)
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [category, setCategory] = useState([]);
  const [data, setData] = useState([]);

  const [filteredData, setfilteredData] = useState([]);
  const [parentId, setparentId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [innerCategoryName, setInnerCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [authors, setAuthors] = useState([]);
  const [authorId, setAuthorId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const editorRef = useRef(null);

  // SEO Optimization states
  const [focusKeyword, setFocusKeyword] = useState("");
  const [seoResults, setSeoResults] = useState(null);
  const [duplicateResults, setDuplicateResults] = useState(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const navigate = useNavigate();

  const inputFileRef = useRef();
  const imgRef = useRef();
  const handleEditorInit = (evt, editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (content, editor) => {
    setDescription(content);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (description || name || focusKeyword) {
        DataService.analyzeSeo({
          title: name,
          description: description,
          metaTitle: metaTitle,
          metaDescription: metaDescription,
          keyword: focusKeyword
        }).then(res => {
          setSeoResults(res.data.data);
        }).catch(err => console.error("SEO Analysis Error:", err));
      }
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [description, name, metaTitle, metaDescription, focusKeyword]);

  const handleCheckDuplicate = () => {
    if (!description && !name) {
      toast.warning("Please enter a title or description first to check duplicates.");
      return;
    }
    setIsCheckingDuplicate(true);
    DataService.checkDuplicate({ title: name, description })
      .then(res => {
        setDuplicateResults(res.data.data);
      })
      .catch(err => {
        console.error("Duplicate Check Error:", err);
        toast.error("Failed to check duplicate content.");
      })
      .finally(() => setIsCheckingDuplicate(false));
  };

  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyWordSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setTodos([...todos, inputValue]);
    setInputValue("");
  };

  const handleDelete = (index) => {
    const updatedTodos = todos.filter((todo, i) => i !== index);
    setTodos(updatedTodos);
  };
  const generateUrlFromTitle = (title) => {
    // return title.toLowerCase().replace(/\s+/g, '-');
    return title.toLowerCase().replace(/[^\w\-]+/g, '-').replace(/-+/g, '-').replace(/-+$/, '');
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    setUrl(generateUrlFromTitle(newName));
  };

  const onFileChangeCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error("Please select a valid image file (PNG, JPG, JPEG, WEBP)");
        setFile(null);
        e.target.value = null; // Reset input
        return;
      }
      setFile(e.target.files);
      const reader = new FileReader();
      const url = reader.readAsDataURL(file);
      reader.onloadend = function (theFile) {
        var image = new Image();
        image.src = theFile.target.result;
        imgRef.current.src = image.src;
      };
    }
  };
  const triggerFile = () => {
    inputFileRef.current.click();
  };
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(selectedValues);
  };
  const isValidDate = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current.isSameOrAfter(today);
  };
  const handleDateChange = (date) => {
    // If user types invalid date, date might be string or invalid moment
    if (moment.isMoment(date)) {
      setSlot(date.format("YYYY-MM-DD HH:mm:ss"));
    } else {
      setSlot(date);
    }
  };


  const userId = JSON.parse(localStorage.getItem("user"));
  const userIdString = userId && userId._id ? userId._id.toString() : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!name) {
      toast.error("Please enter a Post Title (English).");
      setLoading(false);
      return;
    }
    if (!categoryName) {
      toast.error("Please select a Category.");
      setLoading(false);
      return;
    }
    if (!file || file.length === 0) {
      toast.error("Please upload a Thumbnail image.");
      setLoading(false);
      return;
    }
    const desc = {
      EN: editorRef.current?.getContent() || "",
      PU: ""
    }
    const head = {
      EN: name,
      PU: ""
    }
    const data = new FormData();
    if (file && file.length > 0) {
      data.append("image", file[0]);
    }
    todos.forEach((keyword, index) => {
      data.append(`metaKeywords[${index}]`, keyword);
    });
    data.append("title", JSON.stringify(head));
    data.append("description", JSON.stringify(desc));

    selectedOptions.map((val, i) => {
      data.append(`tag[${i}]`, selectedOptions[i]);
    });
    data.append("category", categoryName);
    if (innerCategoryName) {
      data.append("innerCategory", innerCategoryName);
    }
    data.append("metaTitle", metaTitle);
    data.append("metaDescription", metaDescription);
    data.append("url", url);
    data.append("canonicalUrl", canonicalUrl);
    data.append("author", authorId);
    data.append("status", "Published");
    DataService.addBlog(data).then(
      () => {
        toast.success("Blog added successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          navigate("/blogs");
        }, 2000);
      },

      (error) => {
        const resMessage = error?.response?.data?.message || error.message || "Something went wrong";
        toast.error(resMessage)
        setLoading(false);
        setMessage(resMessage);
      }
    );
  };
  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!name) {
      toast.error("Please enter a Post Title (English).");
      setLoading(false);
      return;
    }
    if (!categoryName) {
      toast.error("Please select a Category.");
      setLoading(false);
      return;
    }
    if (!file || file.length === 0) {
      toast.error("Please upload a Thumbnail image.");
      setLoading(false);
      return;
    }
    if (!slot) {
      toast.error("Please select a valid date/time.");
      setLoading(false);
      return;
    }
    const desc = {
      EN: editorRef.current?.getContent() || "",
      PU: ""
    }
    const head = {
      EN: name,
      PU: ""
    }
    const data = new FormData();
    if (file && file.length > 0) {
      data.append("image", file[0]);
    }
    todos.forEach((keyword, index) => {
      data.append(`metaKeywords[${index}]`, keyword);
    });
    data.append("title", JSON.stringify(head));
    data.append("description", JSON.stringify(desc));

    selectedOptions.map((val, i) => {
      data.append(`tag[${i}]`, selectedOptions[i]);
    });
    data.append("category", categoryName);
    if (innerCategoryName) {
      data.append("innerCategory", innerCategoryName);
    }
    data.append("metaTitle", metaTitle);
    data.append("metaDescription", metaDescription);
    data.append("url", url);
    data.append("canonicalUrl", canonicalUrl);
    data.append("author", authorId);
    data.append("status", "Pending");
    // Ensure slot is a valid ISO string for backend Date parsing
    const isoDate = moment(slot).toISOString();
    data.append("schedulingDate", isoDate);
    DataService.addBlog(data).then(
      () => {
        toast.success("Blog added successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          navigate("/blogs");
        }, 2000);
      },

      (error) => {
        const resMessage = error?.response?.data?.message || error.message || "Something went wrong";
        toast.error(resMessage)
        setLoading(false);
        setMessage(resMessage);
      }
    );
  };
  useEffect(() => {
    getAllCategory();
    getAllTag();
    DataService.getAllAuthors().then((res) => {
      setAuthors(res.data.data);
      const user = AuthService.getCurrentUser();
      if (user && user.role === 'Author') {
        setAuthorId(user._id);
      }
    });
  }, []);
  const getAllCategory = () => {
    DataService.getCategory().then((data) => {
      setCategory(data.data.data);
    });
  };

  const getAllTag = () => {
    DataService.getTags(data).then((data) => {
      setData(data.data.data);
      setfilteredData(data.data.data);
      setLoading(false);
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid">
        <div className="row">
          <div className="d-flex w-100 justify-content-between align-items-center mb-4">
            <h4 className="mb-0 f-700">Add Blog</h4>
          </div>
        </div>
        {/* <form onSubmit={handleSubmit} className="mt-4 login" ref={form}> */}
        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-xxl-3 col-lg-4">
            <div className="card">
              <div className="card-body text-center">
                {/* <h4 className="f-700">Blog Details</h4> */}
                <div className="mb-3">
                  <label className="form-label">Url</label>
                  <input
                    type="text"
                    className="form-control"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Url"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Canonical URL (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="Leave empty to auto-generate"
                  />
                  <div className="form-text text-muted">
                    If empty, will be: https://digitalstudyschool.com/blog/{url || 'your-url'}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    required
                    className="form-select"
                    value={innerCategoryName || categoryName}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedCat = category.find(c => c._id === selectedId);
                      if (selectedCat) {
                        if (selectedCat.parentCategory) {
                          // It's an inner category
                          setCategoryName(selectedCat.parentCategory?._id || selectedCat.parentCategory);
                          setInnerCategoryName(selectedCat._id);
                        } else {
                          // It's a main category
                          setCategoryName(selectedCat._id);
                          setInnerCategoryName("");
                        }
                      } else {
                        setCategoryName("");
                        setInnerCategoryName("");
                      }
                    }}
                  >
                    <option value="">Select an option</option>
                    {(() => {
                        const topLevel = category.filter(c => !c.parentCategory);
                        const children = category.filter(c => c.parentCategory);
                        
                        return topLevel.map(parent => (
                            <React.Fragment key={parent._id}>
                                <option value={parent._id} style={{ fontWeight: 'bold' }}>
                                    {parent.name}
                                </option>
                                {children
                                    .filter(child => (child.parentCategory?._id || child.parentCategory) === parent._id)
                                    .map(child => (
                                        <option key={child._id} value={child._id}>
                                            &nbsp;&nbsp;&nbsp;-- {child.name}
                                        </option>
                                    ))
                                }
                            </React.Fragment>
                        ));
                    })()}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Author</label>
                  <select
                    className="form-select"
                    onChange={(e) => setAuthorId(e.target.value)}
                    value={authorId}
                    disabled={AuthService.getCurrentUser()?.role === 'Author'}
                  >
                    <option value="">Select an author</option>
                    {authors && authors.length > 0
                      ? authors.map((item, i) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))
                      : ""}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Tags</label>

                  <select
                    multiple
                    required
                    onChange={handleSelectChange}
                    value={selectedOptions}
                    className="form-select"
                    style={{ minHeight: "150px" }}
                  >
                    <option>Select an option</option>
                    {data && data.length > 0
                      ? data.map((item, i) => (
                        <React.Fragment key={item?._id}>
                          <option value={item?._id}>{item?.name}</option>
                        </React.Fragment>
                      ))
                      : ""}
                  </select>
                  <div className="form-text">
                    You Can Select Multiple Tags by Ctrl+Click
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Meta Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Meta Title"
                  />
                  <SeoIndicator value={metaTitle} max={60} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Meta Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Meta Description"
                  />
                  <SeoIndicator value={metaDescription} max={160} />
                </div>
                <div className="mb-3">
                  <form onSubmit={handleKeyWordSubmit}>
                    <label className="form-label">Meta Keywords</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add Meta Keywords"
                      value={inputValue}
                      onChange={handleChange}
                    />
                    <button className="btn-todo-list-key" type="submit">
                      Add
                    </button>
                  </form>
                  <ul className="todo-list-keyword">
                    {todos.map((todo, index) => (
                      <li key={index}>
                        {todo}
                        <i
                          onClick={() => handleDelete(index)}
                          className="far fa-times-circle icon-cross-todo"
                        ></i>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Modernized SEO Optimization Dashboard */}
                <div className="card mt-4 border border-light shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-header bg-white border-bottom-0 pt-4 pb-2">
                    <h5 className="f-700 mb-0 d-flex align-items-center" style={{ color: '#2c3e50' }}>
                      <i className="fas fa-rocket me-2 text-primary" style={{ fontSize: '1.2rem' }}></i>
                      SEO & Readability Analyzer
                    </h5>
                  </div>
                  <div className="card-body pt-2">
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-muted small text-uppercase letter-spacing-1">Focus Keyword</label>
                      <input
                        type="text"
                        className="form-control bg-light border-0"
                        placeholder="e.g. digital marketing, online learning..."
                        value={focusKeyword}
                        onChange={(e) => setFocusKeyword(e.target.value)}
                        style={{ padding: '10px 15px', borderRadius: '8px' }}
                      />
                    </div>

                    {seoResults ? (
                      <div className="seo-metrics-container">
                        <div className="row g-3 mb-4">
                          <div className="col-4">
                            <div className="p-3 text-center h-100 shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '10px', border: `2px solid ${seoResults.seo.score > 70 ? '#198754' : (seoResults.seo.score > 40 ? '#ffc107' : '#dc3545')}` }}>
                              <div className="text-muted fw-bold mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>SEO Score</div>
                              <div className="h3 mb-0 fw-bolder" style={{ color: seoResults.seo.score > 70 ? '#198754' : (seoResults.seo.score > 40 ? '#ffc107' : '#dc3545') }}>
                                {seoResults.seo.score}
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="p-3 text-center h-100 shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '10px', border: `2px solid ${seoResults.readability.color || '#6c757d'}` }}>
                              <div className="text-muted fw-bold mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Readability</div>
                              <div className="h3 mb-0 fw-bolder" style={{ color: seoResults.readability.color }}>
                                {seoResults.readability.score}
                              </div>
                              <div className="fw-bold" style={{ fontSize: '9px', color: seoResults.readability.color }}>{seoResults.readability.label}</div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="p-3 text-center h-100 shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '10px', border: `2px solid ${seoResults.ux.score > 70 ? '#198754' : '#ffc107'}` }}>
                              <div className="text-muted fw-bold mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>UX Score</div>
                              <div className="h3 mb-0 fw-bolder" style={{ color: seoResults.ux.score > 70 ? '#198754' : '#ffc107' }}>
                                {seoResults.ux.score}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '10px', backgroundColor: '#f9fbfd' }}>
                          <div className="card-body p-3">
                             <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: '#495057' }}>
                               <i className="fas fa-check-double me-2 text-success"></i> Action Plan
                             </h6>
                             <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                             {seoResults.seo.checklist.map((item, idx) => (
                               <div key={idx} className="d-flex align-items-start mb-2 small pb-2 border-bottom">
                                 {item.check ? (
                                   <i className="fas fa-check-circle text-success mt-1 me-2" style={{ fontSize: '1.1rem' }}></i>
                                 ) : (
                                   <i className="fas fa-exclamation-circle text-warning mt-1 me-2" style={{ fontSize: '1.1rem' }}></i>
                                 )}
                                 <span className={item.check ? "text-dark" : "text-muted"}>{item.label}</span>
                               </div>
                             ))}
                             </div>
                          </div>
                        </div>

                        {seoResults.allSuggestions.length > 0 && (
                          <div className="alert border-0 shadow-sm" style={{ backgroundColor: '#eff6ff', borderRadius: '10px' }}>
                            <h6 className="fw-bold mb-2 text-primary d-flex align-items-center">
                              <i className="far fa-lightbulb me-2"></i> Improvement Ideas
                            </h6>
                            <ul className="mb-0 ps-3 small text-dark" style={{ lineHeight: '1.6' }}>
                              {seoResults.allSuggestions.slice(0, 3).map((s, idx) => (
                                <li key={idx} className="mb-1">{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-4 text-muted bg-light" style={{ borderRadius: '10px' }}>
                         <i className="fas fa-spinner fa-spin fa-2x mb-2 text-primary"></i>
                         <p className="small mb-0">Analyzing content...</p>
                      </div>
                    )}

                    <hr className="my-4" style={{ borderTop: '2px dashed #e9ecef' }} />

                    {/* Duplicate Content Checker Section */}
                    <div>
                      <h6 className="fw-bold mb-2 d-flex align-items-center" style={{ color: '#2c3e50' }}>
                        <i className="fas fa-copy me-2 text-danger"></i>
                        Duplicate Checker
                      </h6>
                      <p className="small text-muted mb-3">Check internally across existing blogs and externally across the web for similar content.</p>
                      
                      <button 
                         type="button" 
                         className="btn btn-outline-primary btn-sm w-100 rounded-pill fw-bold mb-3"
                         onClick={handleCheckDuplicate}
                         disabled={isCheckingDuplicate}
                      >
                         {isCheckingDuplicate ? (
                           <><i className="fas fa-spinner fa-spin me-2"></i> Scanning...</>
                         ) : (
                           <><i className="fas fa-search me-2"></i> Run Plagiarism Check</>
                         )}
                      </button>

                      {duplicateResults && (
                        <div className="duplicate-results-container animation-fade-in">
                          {duplicateResults.internal?.length > 0 ? (
                            <div className="alert alert-danger border-danger border-opacity-25 bg-danger bg-opacity-10 py-2 px-3 small rounded-3">
                              <div className="fw-bold mb-1 text-danger"><i className="fas fa-exclamation-triangle me-1"></i> internal Duplication Detected!</div>
                              <ul className="mb-0 ps-3">
                                {duplicateResults.internal.map((item, idx) => (
                                  <li key={idx}>
                                    <strong>{item.title}</strong> - {item.similarityScore}% Similar
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div className="alert alert-success border-success border-opacity-25 bg-success bg-opacity-10 py-2 px-3 small rounded-3">
                              <div className="fw-bold text-success"><i className="fas fa-shield-alt me-1"></i> 100% Unique Internally</div>
                            </div>
                          )}

                          <div className="alert alert-warning border-warning border-opacity-25 bg-warning bg-opacity-10 py-2 px-3 small rounded-3 mt-2">
                            <div className="fw-bold text-warning mb-1"><i className="fas fa-globe me-1"></i> External Web Check</div>
                            {duplicateResults.externalCheckAvailable ? (
                                <div>Checked across web. Original content.</div>
                            ) : (
                                <div className="text-secondary">{duplicateResults.message}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-9 col-lg-8 ps-xxl-5 ps-md-3 ps-0">
            <div className="col-md-12">
              <div className="card mb-5">
                <div className="card-body p-4">
                  <div>
                    <div className="card mb-4">
                      <div className="card-body text-center">
                        <h4 className="f-700">Thumbnail</h4>
                        <div className="Product-thumbnail" onClick={triggerFile}>
                          <img
                            style={{ width: "100%", display: "block" }}
                            src="../assets/img/upload-image.png"
                            ref={imgRef}
                            alt=""
                          />
                        </div>
                        <p className="text-center">
                          Set the Post thumbnail image. Only *.png, *.jpg and
                          *.jpeg image files are accepted
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        ref={inputFileRef}
                        style={styles.input}
                        onChangeCapture={onFileChangeCapture}
                      />
                    </div>

                    <label className="form-label">Post Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Post Title"
                    />
                    <div className="mb-4 description-sec">
                      <label className="form-label">Post Description </label>

                      <Editor
                        apiKey="v0ip0qppa6tx5219zcux6zor3lpvn1yla3uwnme1btty213m"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        onEditorChange={handleEditorChange}
                        initialValue={""}
                        init={{
                          height: 500,
                          menubar: true,
                          plugins: [
                            "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                            "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                            "insertdatetime", "media", "table", "help", "wordcount", "file"
                          ],
                          toolbar:
                            "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist outdent indent | removeformat | image file | help",
                          content_style:
                            "body { font-family: Helvetica, Arial, sans-serif; font-size: 14px }",
                          images_upload_url: "https://backend.digitalstudyschool.com/api/blogs/uploadMedia",
                          file_picker_types: "image media",
                          file_picker_callback: function (cb, value, meta) {
                            const input = document.createElement("input");
                            input.setAttribute("type", "file");
                            input.setAttribute("accept", meta.filetype === "image" ? "image/*" : "video/*");

                            input.onchange = function () {
                              const file = this.files[0];
                              const formData = new FormData();
                              formData.append("file", file);

                              fetch("https://backend.digitalstudyschool.com/api/blogs/uploadMedia", {
                                method: "POST",
                                body: formData,
                              })
                              .then(response => response.json())
                              .then(data => {
                                if (data.location) {
                                  cb(data.location, { title: file.name, alt: file.name });
                                } else {
                                  toast.error(data.error || "Upload failed");
                                }
                              })
                              .catch(error => toast.error("Upload error: " + error.message));
                            };
                            input.click();
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {sPopup && (
                  <div className="popup_outer">
                    <div className="popup_inner">
                      <i className="fas fa-times" onClick={() => setSPopup(false)}></i>
                      <h2>Please Select Time & Date</h2>
                      <div style={{ position: 'relative' }}>
                        <i className="far fa-calendar-alt"></i>
                        <Datetime
                          onChange={handleDateChange}
                          inputProps={inputProps}
                          dateFormat="yyyy-MMM-DD"
                          timeFormat="hh:mm A"
                          isValidDate={isValidDate}
                          value={slot}
                        />
                      </div>
                      <div className="mt-4" style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          style={{ minWidth: '120px' }}
                          className="btn btn-primary ms-3"
                          onClick={handleSubmitSchedule}
                          disabled={loading}
                        >
                          {loading && (
                            <span className="spinner-border spinner-border-sm"></span>
                          )}
                          <span>Submit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-center btn-min-width p-4">
                  <button
                    type="button"
                    style={{ minWidth: '120px' }}
                    className="btn btn-primary me-3"
                    onClick={() => setSPopup(true)}
                    disabled={loading}
                  >
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Schedule</span>
                  </button>
                  <button
                    type="submit"
                    style={{ minWidth: '120px' }}
                    className="btn btn-primary ms-3"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBlogPost;
