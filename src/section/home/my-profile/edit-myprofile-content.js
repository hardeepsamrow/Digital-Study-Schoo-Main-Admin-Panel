import React, { useEffect, useState, useRef } from "react";
import DataService from "../../../services/data.service";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const styles = {
  input: {
    opacity: "0%", // dont want to see it
    position: "absolute", // does not mess with other elements
  },
};
const EditProfileContent = (props) => {
  const form = useRef();
  const hiddenButtonRef = useRef(null);
  const [phoneCode, setPhoneCode] = useState("254");
  const [userName, setUserName] = useState("");
  const [companyName, setcompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [link, setLink] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [referral, setReferral] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const inputFileRef = React.useRef();
  const imgRef = React.useRef();
  const navigate = useNavigate();
  //console.log(props)

  useEffect(() => { }, []);

  // const onFileChangeCapture = (e) => {
  //   /*Selected files data can be collected here.*/
  //   const file = e.target.files[0];
  //   console.log(file, "file");
  //   setFile(e.target.files);
  //   const reader = new FileReader();
  //   const url = reader.readAsDataURL(file);
  //   reader.onloadend = function (theFile) {
  //     console.log(theFile);
  //     var image = new Image();
  //     image.src = theFile.target.result;
  //     imgRef.current.src = image.src;
  //   };
  // };

  const onChangeFirstName = (e) => {
    const data = e.target.value;
    setFirstName(data);
  };

  const onChangeEmail = (e) => {
    const data = e.target.value;
    setEmail(data);
  };
  const onChangeNumber = (e) => {
    const data = e.target.value;
    setPhone(data);
  };

  const triggerFile = () => {
    inputFileRef.current.click();
  };

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
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   //const data = new FormData();
  //   if (file && file.length > 0) {
  //     data.append("image", file[0]);
  //   }
  //   if (firstName) {
  //     data.append("first_name", firstName);
  //   }
  //   if (lastName) {
  //     data.append("last_name", lastName);
  //   }
  //   if (middleName) {
  //     data.append("middle_name", middleName);
  //   }
  //   if (link) {
  //     data.append("website_link", link);
  //   }

  //   if (address) {
  //     data.append("address", address);
  //   }
  //   if (state) {
  //     data.append("state", state);
  //   }
  //   if (city) {
  //     data.append("city", city);
  //   }
  //   if (referral) {
  //     data.append("referral_name", referral);
  //   }

  //   if (email) {
  //     data.append("email", email);
  //   }

  //   if (phone) {
  //     data.append("phone", phone);
  //   }

  //   if (companyName) {
  //     data.append("company_name", companyName);
  //   }

  //   DataService.updateUser(data, props?.data?.id).then(
  //     () => {
  //       setLoading(false);
  //       toast.success("Request completed successfully!", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     },
  //     (error) => {
  //       const resMessage =
  //         (error.response &&
  //           error.response.data &&
  //           error.response.data.message) ||
  //         error.message ||
  //         error.toString();
  //       setLoading(false);
  //       toast.error(resMessage, {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //       setLoading(false);
  //     }
  //   );
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {};
    data.name = firstName;
    data.email = email;
    data.phoneNo = phone;

    DataService.updateProfile(props?.data[0]?._id, data).then(
      () => {
        setLoading(false);
        toast.success("Request completed successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        navigate("/my-profile");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
        toast.error(resMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    );
  };

  return (
    <>
      <div className="MyprofileBanner">
        {/* <div className="profile-info">
          <figure className="mb-0 Myprofile-img" onClick={triggerFile}>
            {props?.data?.images ? (
              <img
                ref={imgRef}
                src={
                  "https://digital-study-school-website-nbgr.vercel.app" +
                  props?.data?.images[0]?.url
                }
                alt="profie image"
              />
            ) : (
              <img
                ref={imgRef}
                src="../assets/img/pro-img.jpg"
                alt="profie image"
              />
            )}
          </figure>
          <input
            type="file"
            ref={inputFileRef}
            style={styles.input}
            onChangeCapture={onFileChangeCapture}
          />

          <div className="profile-detail">
            <h4 className="text-white mb-1">{props?.data?.user_nicename}</h4>
          </div>
        </div> */}
      </div>
      <div className="main-content">
        <div className="container-fluid">
          <ToastContainer></ToastContainer>
          <form onSubmit={handleSubmit} className="mt-4 login" ref={form}>
            <div className="row">
              <div className="d-flex w-100 justify-content-between align-items-center mb-4">
                <h4 className="mb-0 f-700">Edit Profile</h4>
              </div>

              <div className="col-md-6 mb-4">
                <input
                  type="text"
                  onChange={onChangeFirstName}
                  defaultValue={props?.data[0]?.name}
                  className="form-control"
                  placeholder="Name"
                />
              </div>

              <div className="col-md-6 mb-4">
                <input
                  type="email"
                  reuired
                  onChange={onChangeEmail}
                  defaultValue={props?.data[0]?.email}
                  className="form-control"
                  placeholder="Email*"
                />
              </div>
              <div className="col-md-6 mb-4">
                <input
                  type="number"
                  reuired
                  onChange={onChangeNumber}
                  defaultValue={props?.data[0]?.phoneNo}
                  className="form-control"
                  placeholder="Number*"
                />
              </div>

              {/* <div className="col-md-6 mb-4">
                <input
                  type="text"
                  onChange={onChangeFirstName}
                  defaultValue={props?.data?.first_name}
                  className="form-control"
                  placeholder="First Name"
                />
              </div>
              <div className="col-md-6 mb-4">
                <input
                  type="text"
                  onChange={onChangeMiddleName}
                  defaultValue={props?.data?.middle_name}
                  className="form-control"
                  placeholder="Middle Name"
                />
              </div>
              <div className="col-md-6 mb-4">
                <input
                  type="text"
                  onChange={onChangeLastName}
                  defaultValue={props?.data?.last_name}
                  className="form-control"
                  placeholder="Last Name"
                />
              </div>
              <div className="col-md-6 mb-4">
                <input
                  type="text"
                  className="form-control"
                  onChange={onChangeCompanyName}
                  placeholder="Company/Business Name"
                />
              </div>
              <div className="col-md-6 mb-4">
                <input
                  type="text"
                  onChange={onChangeLink}
                  defaultValue={props?.data?.website_link}
                  className="form-control"
                  placeholder="Website Link"
                />
              </div>
              <div className="col-md-6 mb-4">
                <input
                  type="email"
                  reuired
                  onChange={onChangeEmail}
                  defaultValue={props?.data?.email}
                  className="form-control"
                  placeholder="Email*"
                />
              </div>
              <div className="col-md-6 mb-4">
                <div className="flex_country_code">
                  <div className="flex_countryone">
                    <PhoneInput
                      country={"ke"}
                      value={phoneCode}
                      defaultCountry="US"
                      onChange={setPhoneCode}
                    />
                  </div>
                  <div className="flex_countrytwo">
                    <input
                      type="text"
                      onChange={onChangePhone}
                      defaultValue={props?.data?.phone}
                      className="form-control"
                      required
                      maxLength={10}
                      placeholder="Mobile*"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <input
                  type="text"
                  required
                  onChange={onChangeAddress}
                  defaultValue={props?.data?.address}
                  className="form-control"
                  placeholder="Address*"
                />
              </div>
              <div className="col-md-6 mb-4">
                <input
                  type="text"
                  onChange={onChangeState}
                  defaultValue={props?.data?.state}
                  className="form-control"
                  placeholder="State*"
                />
              </div>
              <div className="col-md-6 mb-4">
                <input
                  type="text"
                  className="form-control"
                  onChange={onChangeCity}
                  defaultValue={props?.data?.city}
                  placeholder="City*"
                />
              </div> */}
              {/* <div className="col-md-6 mb-4">
<input
type="text"
onChange={onChangereferral}
defaultValue={props?.data?.referral_name}
className="form-control"
placeholder="Name of Referral" />
</div> */}
              {/* <div className="col-md-6 mb-4"> */}
              {/* <div className="upload-box ">
                                    <i><svg width="47" height="39" viewBox="0 0 47 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M32 27.5L24 19.5L16 27.5" stroke="#F4AC3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M24 19.5V37.5" stroke="#F4AC3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M40.7799 32.28C42.7306 31.2165 44.2716 29.5337 45.1597 27.4972C46.0477 25.4607 46.2323 23.1864 45.6843 21.0334C45.1363 18.8803 43.8869 16.971 42.1333 15.6069C40.3796 14.2427 38.2216 13.5014 35.9999 13.5H33.4799C32.8745 11.1585 31.7462 8.98464 30.1798 7.14195C28.6134 5.29927 26.6496 3.83567 24.4361 2.86118C22.2226 1.8867 19.817 1.42669 17.4002 1.51573C14.9833 1.60478 12.6181 2.24057 10.4823 3.3753C8.34649 4.51003 6.49574 6.11417 5.06916 8.06713C3.64259 10.0201 2.6773 12.271 2.24588 14.6508C1.81446 17.0305 1.92813 19.477 2.57835 21.8065C3.22856 24.136 4.3984 26.2877 5.99992 28.1" stroke="#F4AC3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M32 27.5L24 19.5L16 27.5" stroke="#F4AC3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    </i>

                                    <div className="ms-3">
                                        <h5>Select a file or drag and drop here</h5>
                                        <p className="mb-0 text-secondary">JPG, PNG or PDF, file size no more than 10MB</p>
                                    </div>
                                
                                    <div className="upload-btn-wrapper ms-auto ms-3">
                                        <button className="btn-file">Select file</button>
                                        <input
                                            type="file"
                                            ref={inputFileRef}
                                            onChangeCapture={onFileChangeCapture} />
                                    </div>
                                </div> */}
              {/* <input
                  type="file"
                  ref={inputFileRef}
                  style={styles.input}
                  onChangeCapture={onFileChangeCapture}
                />
              </div> */}

              <div className="col-md-12">
                <button className="btn btn-primary" disabled={loading}>
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Save</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfileContent;
