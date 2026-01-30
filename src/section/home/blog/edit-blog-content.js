import React, { useEffect, useState, useRef } from "react";
import DataService from "../../../services/data.service";
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
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const inputFileRef = useRef();
  const imgRef = useRef();

  const onFileChangeCapture = (e) => {
    const file = e.target.files[0];
    setFile(e.target.files);
    const reader = new FileReader();
    const url = reader.readAsDataURL(file);
    reader.onloadend = function (theFile) {
      var image = new Image();
      image.src = theFile.target.result;
      imgRef.current.src = image.src;
    };
  };

  const triggerFile = () => {
    inputFileRef.current.click();
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
    getBlog();
  }, []);

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

      setCategory(data?.data?.data?.category?._id);
      setMetaDescription(data?.data?.data?.metaDescription);
      setUrl(data?.data?.data?.url);
      setTodos(data?.data?.data?.metaKeywords || []);
      setMetaTitle(data?.data?.data?.metaTitle);
      if (data?.data?.data?.schedulingDate) {
        // Set slot as string formatted
        // Backend stores as ISO possibly, so ensuring it's loaded as moment then formatted
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
  const userId = JSON.parse(localStorage.getItem("user"));
  const userIdString = userId && userId._id ? userId._id.toString() : "";

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
    data.append("metaTitle", metaTitle);
    data.append("metaDescription", metaDescription);
    data.append("url", url);

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
        toast.error(resMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
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
    data.append("metaTitle", metaTitle);
    data.append("metaDescription", metaDescription);
    data.append("url", url);
    data.append("status", "Pending");
    data.append("schedulingDate", slot);

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
        toast.error(resMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="d-flex w-100 justify-content-between align-items-center mb-4">
          <h4 className="mb-0 f-700">Edit Blog</h4>
        </div>
      </div>
      {/* <form className="mt-4 login" ref={form}> */}
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
              <h4 className="f-700">Blog Details</h4>
              <div className="card">
                <div className="card-body text=center">
                  {/* <h4 className="f-700">Product Details</h4> */}

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
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select an option</option>

                      {mastercategory && mastercategory?.length > 0
                        ? mastercategory?.map((item, i) => (
                          <>
                            <option value={item?._id}>{item?.name}</option>
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
                      {data && data?.length > 0
                        ? data?.map((item, i) => (
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
                            className="far fa-times-circle icon-cross-todo"
                          ></i>
                        </li>
                      ))}
                    </ul>
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
                    <div className="card-body text=center">
                      <h4 className="f-700">Thumbnail</h4>
                      <div
                        className="Product-thumbnail  "
                        onClick={triggerFile}
                      >
                        {dataMain?.image ? (
                          <>
                            <img
                              src={
                                "https://backend.digitalstudyschool.com" +
                                dataMain?.image?.url
                              }
                              ref={imgRef}
                              className="post-img"
                              alt="customer"
                              onError={(e) =>
                                (e.target.src = "../assets/img/noImage.jpg")
                              }
                            />
                          </>
                        ) : (
                          <img
                            // src="../assets/img/noImage.jpg"
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
                    <label className="form-label">
                      Post Description
                    </label>
                    <Editor
                      key={description ? "loaded-en" : "loading-en"}
                      apiKey="v0ip0qppa6tx5219zcux6zor3lpvn1yla3uwnme1btty213m"
                      initialValue={description}
                      onInit={(evt, editor) => (editorRef.current = editor)}
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

                        file_picker_types: "image",
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
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Schedule</span>
                </button>
                <button
                  type="button"
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
      {
        sPopup &&
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
      }
      {/* </form> */}
    </div >
  );
};

export default EditBlogPost;
