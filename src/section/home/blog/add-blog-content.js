import React, { useEffect, useState, useRef } from "react";
import DataService from "../../../services/data.service";
import { json, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { ToastContainer, toast } from "react-toastify";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const styles = {
  input: {
    opacity: "0%",
    position: "absolute",
  },
};
let inputProps = {
  placeholder: "Date",
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
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const editorRef = useRef(null);


  const navigate = useNavigate();

  const inputFileRef = useRef();
  const imgRef = useRef();
  const handleEditorInit = (evt, editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (content, editor) => {
    setDescription(content);
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
    const formattedDate = formatDate(date);
    setSlot(formattedDate);
  };
  const formatDate = (date) => {
    const formattedDate = new Date(date);

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    };

    const year = formattedDate.getFullYear();
    const month = formattedDate.toLocaleString("en-US", { month: "2-digit" });
    const day = formattedDate.toLocaleString("en-US", { day: "2-digit" });
    const time = formattedDate.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const correctedDate = `${year}-${month}-${day} ${time}`;
    setCorrected(correctedDate);
    return correctedDate;
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
    data.append("metaTitle", metaTitle);
    data.append("metaDescription", metaDescription);
    data.append("url", url);
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
    data.append("metaTitle", metaTitle);
    data.append("metaDescription", metaDescription);
    data.append("url", url);
    data.append("status", "Scheduled");
    data.append("schedulingDate", new Date(slot).toISOString());
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
              <div className="card-body text=center">
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
                  <label className="form-label">Categories</label>
                  <select
                    required
                    className="form-select"
                    onChange={(e) => setCategoryName(e.target.value)}
                  >
                    <option value="">Select an option</option>

                    {category && category.length > 0
                      ? category.map((item, i) => (
                        <>
                          <option key={item._id} value={item._id}>
                            {item.name}
                          </option>
                        </>
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
                        <>
                          <option value={item?._id}>{item?.name}</option>
                        </>
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
                          class="far fa-times-circle icon-cross-todo"
                        ></i>
                      </li>
                    ))}
                  </ul>
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
                      <div className="card-body text=center">
                        <h4 className="f-700">Thumbnail</h4>
                        <div className="Product-thumbnail" onClick={triggerFile}>
                          <img
                            style={{ width: "100%" }}
                            // src="https://backend.digitalstudyschool.com/"
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
                      // onChange={(e) => setName(e.target.value)}
                      onChange={handleNameChange}
                      placeholder="Post Title"
                    />
                    <div className="mb-4 description-sec">
                      <label className="form-label">Post Description </label>

                      <Editor
                        apiKey="v0ip0qppa6tx5219zcux6zor3lpvn1yla3uwnme1btty213m"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={""}
                        init={{
                          height: 500,
                          menubar: true,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                            "file",
                          ],
                          toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist outdent indent | " +
                            "removeformat | image file | help",
                          content_style:
                            "body { font-family: Helvetica, Arial, sans-serif; font-size: 14px }",
                          images_upload_url:
                            "https://backend.digitalstudyschool.com/api/EnNews/images",
                          file_picker_types: "image",
                        }}
                      />
                    </div>
                  </div>
                </div>
                {sPopup &&
                  <div className="popup_outer">
                    <div className="popup_inner">
                      <i className="fas fa-times" onClick={() => setSPopup(false)}></i>
                      <h2>Please Select Time & Date</h2>
                      <div style={{ position: 'relative' }}>
                        <i class="far fa-calendar-alt"></i>
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
                }
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
        {/* </form> */}
      </div>
    </>
  );
};

export default AddBlogPost;
