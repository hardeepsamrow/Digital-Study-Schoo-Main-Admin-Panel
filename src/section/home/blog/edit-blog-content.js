import React, { useEffect, useState, useRef } from "react";
import DataService from "../../../services/data.service";
import AuthService from "../../../services/auth.service";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
const styles = {
  input: {
    opacity: "0%",
    position: "absolute",
  },
};
const MAX_COUNT = 5;
let inputProps = {
  placeholder: "Date (YYYY-MM-DD)",
};
const serverUrl = "https://backend.digitalstudyschool.com";

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

const EditBlogPost = () => {
  const params = useParams();
  const form = useRef();
  const [name, setName] = useState("");
  const [slot, setSlot] = useState("");
  const [sPopup, setSPopup] = useState(false);

  const [url, setUrl] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [dataMain, setDataMain] = useState([]);
  const [mastercategory, setAData] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setfilteredData] = useState([]);
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");
  const [innerCategoryName, setInnerCategoryName] = useState("");
  const [authors, setAuthors] = useState([]);
  const [authorId, setAuthorId] = useState("");
  const editorRef = useRef(null);

  // SEO Optimization states
  const [focusKeyword, setFocusKeyword] = useState("");
  const [seoResults, setSeoResults] = useState(null);
  const [duplicateResults, setDuplicateResults] = useState(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const inputFileRef = useRef();
  const imgRef = useRef();

  const onFileChangeCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (e) => {
    const selectedTags = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(selectedTags);
  };
  useEffect(() => {
    getCategory();
    getAllTag();
    getAllAuthors();
    getBlog();
  }, []);

  const getAllAuthors = () => {
    DataService.getAllAuthors().then((res) => {
      setAuthors(res.data.data);
    });
  };

  const getBlog = () => {
    DataService.getBlogById(params.id).then((data) => {
      setDataMain(data?.data?.data);

      let desc = { EN: "", PU: "" };
      let head = { EN: "", PU: "" };

      try {
        desc = JSON.parse(data?.data?.data?.description);
        if (typeof desc !== 'object') desc = { EN: data?.data?.data?.description, PU: "" };
      } catch (e) {
        desc = { EN: data?.data?.data?.description || "", PU: "" };
      }

      try {
        head = JSON.parse(data?.data?.data?.title);
        if (typeof head !== 'object') head = { EN: data?.data?.data?.title, PU: "" };
      } catch (e) {
        head = { EN: data?.data?.data?.title || "", PU: "" };
      }

      setName(head?.EN || "");
      setDescription(desc?.EN || "");

      setCategory(data?.data?.data?.category?._id || data?.data?.data?.category || "");
      setInnerCategoryName(data?.data?.data?.innerCategory?._id || data?.data?.data?.innerCategory || "");
      setMetaDescription(data?.data?.data?.metaDescription);
      setUrl(data?.data?.data?.url);
      setCanonicalUrl(data?.data?.data?.canonicalUrl || "");
      setAuthorId(data?.data?.data?.author?._id || data?.data?.data?.author || "");
      setTodos(data?.data?.data?.metaKeywords || []);
      setMetaTitle(data?.data?.data?.metaTitle);
      if (data?.data?.data?.schedulingDate) {
        const sDate = moment(data?.data?.data?.schedulingDate);
        if (sDate.isValid()) {
          setSlot(sDate.format("YYYY-MM-DDTHH:mm:ss"));
        } else {
          setSlot(data?.data?.data?.schedulingDate);
        }
      }
      setSelectedOptions(
        data?.data?.data?.tag
          ? data?.data?.data?.tag?.map((item) => item?._id)
          : ""
      );
      setLoading(false);
    });
  };
  const getCategory = () => {
    DataService.getCategory().then((data) => {
      setAData(data.data.data);
    });
  };
  const isValidDate = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current.isSameOrAfter(today);
  };
  const handleDateChange = (date) => {
    if (moment.isMoment(date)) {
      setSlot(date.format("YYYY-MM-DDTHH:mm:ss"));
    } else {
      setSlot(date);
    }
  };
  const getAllTag = () => {
    DataService.getTags(data).then((data) => {
      setData(data.data.data);
      setfilteredData(data.data.data);
      setLoading(false);
    });
  };
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const desc = {
      EN: editorRef.current?.getContent() || description || "",
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
    data.append("description", JSON.stringify(desc));
    data.append("title", JSON.stringify(head));
    if (selectedOptions?.length > 0) {
      selectedOptions.forEach((tag, i) => {
        data.append(`tag[${i}]`, tag);
      });
    }
    data.append("category", category);
    if (innerCategoryName) {
      data.append("innerCategory", innerCategoryName);
    }
    data.append("metaTitle", metaTitle);
    data.append("metaDescription", metaDescription);
    data.append("url", url);
    data.append("canonicalUrl", canonicalUrl);
    data.append("author", authorId);

    DataService.updateBlog(data, params.id).then(
      () => {
        toast.success("Blog Updated Successfully!!");
        setTimeout(() => {
          navigate("/blogs");
        }, 2000);
      },

      (error) => {
        const resMessage = error?.response?.data?.message;
        setLoading(false);
        toast.error(resMessage);
      }
    );
  };

  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    if (loading) return;
    if (!slot) {
      toast.error("Please select a valid date/time.");
      return;
    }
    setLoading(true);
    const desc = {
      EN: editorRef.current?.getContent() || description || "",
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
    data.append("description", JSON.stringify(desc));
    data.append("title", JSON.stringify(head));
    if (selectedOptions?.length > 0) {
      selectedOptions.forEach((tag, i) => {
        data.append(`tag[${i}]`, tag);
      });
    }
    data.append("category", category);
    if (innerCategoryName) {
      data.append("innerCategory", innerCategoryName);
    }
    data.append("metaTitle", metaTitle);
    data.append("metaDescription", metaDescription);
    data.append("url", url);
    data.append("canonicalUrl", canonicalUrl);
    data.append("author", authorId);
    data.append("status", "Pending");
    const isoDate = moment(slot).toISOString();
    data.append("schedulingDate", isoDate);

    DataService.updateBlog(data, params.id).then(
      () => {
        toast.success("Blog Scheduled Successfully!!");
        setTimeout(() => {
          navigate("/blogs");
        }, 2000);
      },

      (error) => {
        const resMessage = error?.response?.data?.message;
        setLoading(false);
        toast.error(resMessage);
      }
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid">
        <div className="row">
          <div className="d-flex w-100 justify-content-between align-items-center mb-4">
            <h4 className="mb-0 f-700">Edit Blog</h4>
          </div>
        </div>

        <div className="row">
          <div className="col-xxl-3 col-lg-4">
            <div className="card">
              <div className="card-body text-center">
                <h4 className="f-700">Blog Details</h4>
                <div className="card">
                  <div className="card-body text-center">
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
                        Current: {canonicalUrl || (url ? `https://digitalstudyschool.com/blog/${url}` : 'Auto-generated')}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        required
                        className="form-select"
                        value={innerCategoryName || category}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedCat = mastercategory.find(c => c._id === selectedId);
                          if (selectedCat) {
                            if (selectedCat.parentCategory) {
                              setCategory(selectedCat.parentCategory?._id || selectedCat.parentCategory);
                              setInnerCategoryName(selectedCat._id);
                            } else {
                              setCategory(selectedCat._id);
                              setInnerCategoryName("");
                            }
                          } else {
                            setCategory("");
                            setInnerCategoryName("");
                          }
                        }}
                      >
                        <option value="">Select an option</option>
                        {(() => {
                          const topLevel = mastercategory.filter(c => !c.parentCategory);
                          const children = mastercategory.filter(c => c.parentCategory);
                          
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
                        {data && data?.length > 0
                          ? data?.map((item, i) => (
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
                            <div className="mb-4 mt-3">
                              <div className="d-flex justify-content-between mb-1">
                                <span className="fw-bold" style={{ color: '#495057' }}>SEO Score</span>
                                <span className="fw-bold" style={{ color: seoResults.seo.score > 70 ? '#198754' : (seoResults.seo.score > 40 ? '#ffc107' : '#dc3545') }}>
                                  {seoResults.seo.score}/100
                                </span>
                              </div>
                              <div className="progress" style={{ height: '10px', backgroundColor: '#e9ecef', borderRadius: '10px' }}>
                                <div className={`progress-bar ${seoResults.seo.score > 70 ? 'bg-success' : (seoResults.seo.score > 40 ? 'bg-warning' : 'bg-danger')}`} style={{ width: `${seoResults.seo.score}%`, borderRadius: '10px' }}></div>
                              </div>
                            </div>

                            <div className="mb-4">
                              <div className="d-flex justify-content-between mb-1">
                                <span className="fw-bold" style={{ color: '#495057' }}>Readability: {seoResults.readability.label}</span>
                                <span className="fw-bold" style={{ color: seoResults.readability.color || '#6c757d' }}>
                                  {seoResults.readability.score}/100
                                </span>
                              </div>
                              <div className="progress" style={{ height: '10px', backgroundColor: '#e9ecef', borderRadius: '10px' }}>
                                <div className="progress-bar" style={{ backgroundColor: seoResults.readability.color || '#6c757d', width: `${seoResults.readability.score}%`, borderRadius: '10px' }}></div>
                              </div>
                            </div>

                            <div className="mb-4">
                              <div className="d-flex justify-content-between mb-1">
                                <span className="fw-bold" style={{ color: '#495057' }}>UX Score</span>
                                <span className="fw-bold" style={{ color: seoResults.ux.score > 70 ? '#198754' : '#ffc107' }}>
                                  {seoResults.ux.score}/100
                                </span>
                              </div>
                              <div className="progress" style={{ height: '10px', backgroundColor: '#e9ecef', borderRadius: '10px' }}>
                                <div className={`progress-bar ${seoResults.ux.score > 70 ? 'bg-success' : 'bg-warning'}`} style={{ width: `${seoResults.ux.score}%`, borderRadius: '10px' }}></div>
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
                            <div className="mt-4 p-3 animation-fade-in" style={{ border: '2px dashed #dee2e6', borderRadius: '8px', backgroundColor: '#fff' }}>
                              <h6 className="fw-bolder text-dark mb-3 text-uppercase letter-spacing-1" style={{ fontSize: '0.85rem' }}>Plagiarism Report</h6>
                              {duplicateResults.internal?.length > 0 ? (
                                <div>
                                   <div className="d-flex align-items-center text-danger fw-bold mb-3" style={{ fontSize: '1.05rem' }}>
                                     <i className="fas fa-exclamation-triangle fa-2x me-3"></i> 
                                     Warning: We found similar content on your site!
                                   </div>
                                   <div className="list-group list-group-flush mb-3">
                                     {duplicateResults.internal.map((item, idx) => (
                                       <div key={idx} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-bottom">
                                         <div className="d-flex flex-column">
                                           <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{item.title}</span>
                                           {item.titleMatch && <span className="text-danger small fw-bold mt-1"><i className="fas fa-ban me-1"></i> Exact Title Match</span>}
                                           {!item.titleMatch && <span className="text-muted small mt-1">Found a match in body text</span>}
                                         </div>
                                         <span className="badge rounded-pill bg-danger shadow-sm px-3 py-2" style={{ fontSize: '0.9rem' }}>{item.similarityScore}% Match</span>
                                       </div>
                                     ))}
                                   </div>
                                   <div className="small fw-semibold text-muted bg-light p-2 rounded">
                                     <i className="fas fa-info-circle me-1"></i> You should significantly rewrite this content or change the title to avoid SEO duplicate penalties from Google.
                                   </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center py-2">
                                  <i className="fas fa-check-circle fa-3x text-success me-3"></i> 
                                  <div>
                                    <div className="text-success fw-bold" style={{ fontSize: '1.2rem' }}>Excellent! 100% Unique internally.</div>
                                    <div className="small fw-normal text-muted mt-1">No matching content found across your database. Safe to publish!</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                      </div>
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
                        <div
                          className="Product-thumbnail"
                          onClick={triggerFile}
                        >
                          {dataMain?.image ? (
                            <img
                              src={"https://backend.digitalstudyschool.com" + dataMain?.image?.url}
                              ref={imgRef}
                              className="post-img"
                              alt="customer"
                              onError={(e) => (e.target.src = "../assets/img/noImage.jpg")}
                            />
                          ) : (
                            <img
                              src="../assets/img/img-placeholder.svg"
                              ref={imgRef}
                              alt="post_image"
                            />
                          )}
                        </div>
                        <p className="text-center">
                          Set the Banner image. Only .png, .jpg and *.jpeg image
                          files are accepted
                        </p>
                      </div>
                      <input
                        type="file"
                        ref={inputFileRef}
                        style={styles.input}
                        accept="image/*"
                        onChangeCapture={onFileChangeCapture}
                      />
                    </div>

                    <label className="form-label">Post Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Post Title"
                    />
                    <div className="mb-4">
                      <label className="form-label">Post Description</label>
                      <Editor
                        key={description ? "loaded-en" : "loading-en"}
                        apiKey="v0ip0qppa6tx5219zcux6zor3lpvn1yla3uwnme1btty213m"
                        initialValue={description}
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        onEditorChange={handleEditorChange}
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

                <div className="d-flex justify-content-center btn-min-width p-4">
                  <button
                    type="button"
                    style={{ minWidth: '120px' }}
                    className="btn btn-primary me-3"
                    onClick={() => setSPopup(true)}
                    disabled={loading}
                  >
                    {loading && <span className="spinner-border spinner-border-sm"></span>}
                    <span>Schedule</span>
                  </button>
                  <button
                    type="button"
                    style={{ minWidth: '120px' }}
                    className="btn btn-primary ms-3"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading && <span className="spinner-border spinner-border-sm"></span>}
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
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
                {loading && <span className="spinner-border spinner-border-sm"></span>}
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditBlogPost;
