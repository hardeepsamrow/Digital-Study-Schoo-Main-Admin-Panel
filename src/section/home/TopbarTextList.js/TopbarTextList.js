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

const TopbarTextList = () => {
  const [headingOne, SetHeadingOne] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);


  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    DataService.getTopBarContent("66dc40f3230010476e44f27a").then(
      (data) => {
        setData(data?.data?.data);
        SetHeadingOne(data?.data?.data?.text);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      text: headingOne,
    };
    DataService.addTopBarContent(data).then(
      () => {
        toast.success("Content Updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
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

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      // text: headingOne,
      text: editorRef.current.getContent(),
    };
    DataService.updateTopBarContent("66dc40f3230010476e44f27a", data).then(
      () => {
        toast.success("Content Updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
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
          <h4 className="mb-0 f-700">Add Top Bar Content</h4>
        </div>

        <div className="main-sec-scholar">
          <div className="label-field-sec">
            <label className="form-label">Heading</label>
            {/* <input
              type="text"
              className="form-control top-bar-heading"
              value={headingOne}
              onChange={(e) => SetHeadingOne(e.target.value)}
              //   placeholder="Post Title"
            /> */}
            <Editor
              apiKey="18egvot8qs0vrhnwbh3pckvbx1igb7p0z4sve1m8eblrgdj1"
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
        <div>
          <button
            class="btn btn-primary"
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

export default TopbarTextList;
