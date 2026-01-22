import React, { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DataService from "../../../services/data.service";
import { ToastContainer, toast } from "react-toastify";

const SendEmailList = () => {
  const editorRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [data, setData] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    DataService.getContactFormById(params?.id).then((data) => {
      setData(data?.data?.data?.contact);
      setEmail(data?.data?.data?.contact?.email);
      setLoading(false);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnLoading(true);
    if (!subject || !editorRef.current?.getContent()) {
      toast.error("Please fill out all required fields.");
      setBtnLoading(false);
      return;
    }
    const editorContent = editorRef.current
      ? editorRef.current.getContent()
      : "";
    const data = {
      subject: subject,
      text: editorContent,
      to: email,
    };
    DataService.emailSend(data)
      .then(() => {
        toast.success("Email Send Successfully!!!");
        setTimeout(() => {
          navigate("/contact-form");
        }, 2000);
        setBtnLoading(false);
        setLoading(false);
        setSubject("");
        if (editorRef.current) {
          editorRef.current.setContent("");
        }
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setBtnLoading(false);
        setLoading(false);
        toast.error(resMessage);
      });
  };

  return (
    <>
      <ToastContainer />
      <div>
        <h4 class="f-700 mb-4">Email Send</h4>
      </div>
      <div className="main-sec-email-send">
        <div className="inner-sec-email-send">
          <div className="label-field-email  mb-2 ">
            <label>Email</label>
          </div>

          <div className="label-field-email mb-2">
            <input type="email" value={email} />
          </div>
          <div className="label-field-email  mb-2">
            <label>Subject</label>
          </div>
          <div className="label-field-email  mb-2">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="label-field-email  mb-2">
            <label>
              Text
              {/* <span className="red-required">*</span> */}
            </label>
            <div className="d-flex">
              <div className="texteditior-sec-email">
                <Editor
                  apiKey="v0ip0qppa6tx5219zcux6zor3lpvn1yla3uwnme1btty213m"
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
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </div>
            </div>
            <div className="botton-btn-eamil">
              <button
                className="btn-secondary"
                disabled={btnLoading}
                onClick={handleSubmit}
              >
                {btnLoading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  "Send Email"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendEmailList;
