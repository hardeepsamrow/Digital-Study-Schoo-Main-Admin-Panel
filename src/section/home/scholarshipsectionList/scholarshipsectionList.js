import React, { useEffect, useState, useRef } from "react";
import DataService from "../../../services/data.service";
import { json, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";

const styles = {
  input: {
    opacity: "0%",
    position: "absolute",
  },
};

const ScholarShipSectionList = () => {
  const [file, setFile] = useState(null);
  const inputFileRef = useRef();
  const imgRef = useRef();
  const editorRef = useRef(null);

  const [headingOne, SetHeadingOne] = useState("");
  const [data, setData] = useState([]);
  const [headingTwo, SetHeadingTwo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const onFileChangeCapture = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    setFile(files);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (theFile) {
      var image = new Image();
      image.src = theFile.target.result;
      imgRef.current.src = image.src;
    };
  };
  const triggerFile = () => {
    inputFileRef.current.click();
  };

  const getData = () => {
    DataService.gerScholarShipContent("66dc0866ceb6f06cc285615e").then(
      (data) => {
        setData(data?.data?.data);
        SetHeadingOne(data?.data?.data?.text);
        SetHeadingTwo(data?.data?.data?.price);
        setFile(data?.data?.data?.image?.url);
        setLoading(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    if (file && file.length > 0) {
      data.append("image", file[0]);
    }
    data.append("text", headingOne);
    data.append("price", headingTwo);
    // data.append("text", editorRef.current.getContent());
    DataService.AddScholarShipContent(data).then(
      () => {
        toast.success("Content Updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // setTimeout(() => {
        //   navigate("/blogs");
        // }, 2000);
      },

      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
      }
    );
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    if (file && file.length > 0) {
      data.append("image", file[0]);
    }
    // data.append("text", headingOne);
    data.append("text", editorRef.current.getContent());
    data.append("price", headingTwo);
    DataService.updateScholarShipContent("66dc0866ceb6f06cc285615e", data).then(
      () => {
        toast.success("Content Updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // setTimeout(() => {
        //   navigate("/blogs");
        // }, 2000);
        setLoading(false);
      },

      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
      }
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <div className="top-heading-sec-scholar">
          <h4 className="mb-0 f-700">Add ScholarShip Form Content</h4>
        </div>

        <div className="main-sec-scholar">
          <div className="inner-sec-scholar">
            <div className="left-side-inner-scholar">
              <div className="card-body text-center">
                <h4 className="f-400">Thumbnail</h4>
                <div className="Product-thumbnail" onClick={triggerFile}>
                  {data?.image ? (
                    <>
                      <img
                        src={
                          "https://backend.digitalstudyschool.com" +
                          data?.image?.url
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
                      src="../assets/img/img-placeholder.svg"
                      alt="post_image"
                    />
                  )}
                </div>
                <p className="text-center mt-5">
                  Set the Form thumbnail image. Only *.png, *.jpg and *.jpeg
                  image files are accepted
                </p>
                <input
                  type="file"
                  ref={inputFileRef}
                  style={styles.input}
                  onChangeCapture={onFileChangeCapture}
                />
              </div>
            </div>
            {/* <div className="right-side-inner-scholar">
              <div className="label-field-sec">
                <label className="form-label">Heading One</label>
                <input
                  type="text"
                  className="form-control"
                  value={headingOne}
                  onChange={(e) => SetHeadingOne(e.target.value)}
                  //   placeholder="Post Title"
                />
              </div>
              <div className="label-field-sec">
                <label className="form-label">Heading Two</label>
                <input
                  type="text"
                  className="form-control"
                  value={headingTwo}
                  onChange={(e) => SetHeadingTwo(e.target.value)}
                  //   placeholder="Post Title"
                />
              </div>
            </div> */}
            <Editor
              apiKey="v0ip0qppa6tx5219zcux6zor3lpvn1yla3uwnme1btty213m"
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={headingOne}
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
        <div className="bottom-btn-sec-scholar">
          <button
            className="btn btn-primary"
            onClick={handleUpdateSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ScholarShipSectionList;
