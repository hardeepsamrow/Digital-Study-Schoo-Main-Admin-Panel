import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import DataService from "../services/data.service";
const Sidebar = () => {
  const [user, setUser] = useState({});
  const [data, setData] = useState({});

  const [isOpen, setIsOpen] = useState(false);
  const url = window.location.href;
  useEffect(() => {
    const userData = AuthService.getCurrentUser();
    setUser(userData);
    // getUser();
  }, []);

  // const userId = JSON.parse(localStorage.getItem("user"));
  // const userIdString = userId && userId._id ? userId._id.toString() : "";

  // const getUser = () => {
  //   DataService.getProfile().then((data) => {
  //     setData(data.data.data);
  //   });
  // };
  const toggle = (event) => {
    if (event.target.classList.contains("open")) {
      event.target.classList.remove("open");
      event.target.classList.add("close");
    } else {
      event.target.classList.add("open");
      event.target.classList.remove("close");
    }

    setIsOpen(!isOpen);
  };
  return (
    <div className="sidebar">
      {/* <Link className="profile d-flex align-items-center">
        <figure className="mb-0 Myprofile-img">
          {data?.images ? (
            <img
              src={
                "https://digital-study-school-website-nbgr.vercel.app" + data?.images[0]?.url
              }
              alt="profie image"
            />
          ) : (
            <img src="../assets/img/pro-img.jpg" alt="profie image" />
          )}
          <img src="../assets/img/pro-img.jpg" alt="profie image" />
        </figure>
        <div className="profile-detail ps-2">
          <h6 className="mb-1 text-dark-grey">Hello {data?.user_nicename}</h6>
        </div>
      </Link> */}

      <nav className="mt-4">
        <ul>
          <li className={url.includes("categories") ? "active" : ""}>
            <Link
              className={
                url.includes("categories") || url.includes("Add Section")
                  ? "open"
                  : "close"
              }
              onClick={(e) => toggle(e)}
            >
              <i class="fas fa-th-large side-bar-main-icon"></i>
              <span>Add Section</span>
              <i className="ms-auto">
                <svg
                  width="7"
                  height="14"
                  viewBox="0 0 7 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.146447 0.646447C0.341709 0.451184 0.658291 0.451184 0.853553 0.646447L6.85355 6.64645C7.04882 6.84171 7.04882 7.15829 6.85355 7.35355L0.853553 13.3536C0.658291 13.5488 0.341709 13.5488 0.146447 13.3536C-0.0488155 13.1583 -0.0488155 12.8417 0.146447 12.6464L5.79289 7L0.146447 1.35355C-0.0488155 1.15829 -0.0488155 0.841709 0.146447 0.646447Z"
                    fill="#2C5F2D"
                  />
                </svg>
              </i>
            </Link>

            <ul className="ps-4">
              <li
                className={
                  url.includes("categories") || url.includes("categories")
                    ? "active"
                    : ""
                }
              >
                <Link
                  className={
                    url.includes("categories") || url.includes("categories")
                      ? "open"
                      : "close"
                  }
                  onClick={(e) => toggle(e)}
                >
                  <i class="fas fa-th side-bar-main-icon"></i>
                  <span> All Category</span>
                  <i className="ms-auto">
                    <svg
                      width="7"
                      height="14"
                      viewBox="0 0 7 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0.146447 0.646447C0.341709 0.451184 0.658291 0.451184 0.853553 0.646447L6.85355 6.64645C7.04882 6.84171 7.04882 7.15829 6.85355 7.35355L0.853553 13.3536C0.658291 13.5488 0.341709 13.5488 0.146447 13.3536C-0.0488155 13.1583 -0.0488155 12.8417 0.146447 12.6464L5.79289 7L0.146447 1.35355C-0.0488155 1.15829 -0.0488155 0.841709 0.146447 0.646447Z"
                        fill="#2C5F2D"
                      />
                    </svg>
                  </i>
                </Link>

                <ul className="ps-4">
                  <li>
                    <Link to={"/all-categories"}>Category</Link>
                  </li>
                  {/* <li>
                    <Link to={"/add-category"}>Add Category</Link>
                  </li> */}
                </ul>
              </li>
              <li className={url.includes("tag") ? "active" : ""}>
                <Link
                  className={url.includes("tag") ? "open" : "close"}
                  onClick={(e) => toggle(e)}
                >
                  <i class="fas fa-tags side-bar-main-icon"></i>
                  <span>Tags</span>
                  <i className="ms-auto">
                    <svg
                      width="7"
                      height="14"
                      viewBox="0 0 7 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0.146447 0.646447C0.341709 0.451184 0.658291 0.451184 0.853553 0.646447L6.85355 6.64645C7.04882 6.84171 7.04882 7.15829 6.85355 7.35355L0.853553 13.3536C0.658291 13.5488 0.341709 13.5488 0.146447 13.3536C-0.0488155 13.1583 -0.0488155 12.8417 0.146447 12.6464L5.79289 7L0.146447 1.35355C-0.0488155 1.15829 -0.0488155 0.841709 0.146447 0.646447Z"
                        fill="#2C5F2D"
                      />
                    </svg>
                  </i>
                </Link>

                <ul className="ps-4">
                  <li>
                    <Link to={"/all-tags"}>All Tags</Link>
                  </li>
                  {/* <li>
                    <Link to={"/add-tag"}>Add Tags</Link>
                  </li> */}
                </ul>
              </li>
            </ul>
          </li>
          <li className={url.includes("blog") ? "active" : ""}>
            <Link
              className={url.includes("blog") ? "open" : "close"}
              onClick={(e) => toggle(e)}
            >
              <i class="fas fa-book-open side-bar-main-icon"></i>
              <span>Blogs</span>
              <i className="ms-auto">
                <svg
                  width="7"
                  height="14"
                  viewBox="0 0 7 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.146447 0.646447C0.341709 0.451184 0.658291 0.451184 0.853553 0.646447L6.85355 6.64645C7.04882 6.84171 7.04882 7.15829 6.85355 7.35355L0.853553 13.3536C0.658291 13.5488 0.341709 13.5488 0.146447 13.3536C-0.0488155 13.1583 -0.0488155 12.8417 0.146447 12.6464L5.79289 7L0.146447 1.35355C-0.0488155 1.15829 -0.0488155 0.841709 0.146447 0.646447Z"
                    fill="#2C5F2D"
                  />
                </svg>
              </i>
            </Link>
            <ul className="ps-4">
              <li>
                <Link to={"/blogs"}>All Blogs</Link>
              </li>
              <li>
                <Link to={"/add-blog"}>Add Blog </Link>
              </li>
              {/* <li><Link to={"/add-blog"} >Add Blog in Arabic</Link></li>
              <li><Link to={"/add-blog"} >Add Blog in French</Link></li>
              <li><Link to={"/add-blog"} >Add Blog in Espanol</Link></li> */}
            </ul>
          </li>
          <li className={url.includes("contact-form") ? "active" : ""}>
            <Link
              className={url.includes("contact-form") ? "open" : "close"}
              onClick={(e) => toggle(e)}
            >
              <i class="fas fa-id-card-alt side-bar-main-icon"></i>
              <span>Contact Form</span>
              <i className="ms-auto">
                <svg
                  width="7"
                  height="14"
                  viewBox="0 0 7 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.146447 0.646447C0.341709 0.451184 0.658291 0.451184 0.853553 0.646447L6.85355 6.64645C7.04882 6.84171 7.04882 7.15829 6.85355 7.35355L0.853553 13.3536C0.658291 13.5488 0.341709 13.5488 0.146447 13.3536C-0.0488155 13.1583 -0.0488155 12.8417 0.146447 12.6464L5.79289 7L0.146447 1.35355C-0.0488155 1.15829 -0.0488155 0.841709 0.146447 0.646447Z"
                    fill="#2C5F2D"
                  />
                </svg>
              </i>
            </Link>
            <ul className="ps-4">
              <li>
                <Link to={"/contact-form"}>All Contact Form</Link>
              </li>
              <li>
                <Link to={"/scholarship-form"}>All ScholarShip Form</Link>
              </li>
            </ul>
          </li>
          <li className={url.includes("pdf-form-submissions") ? "active" : ""}>
            <Link
              className={url.includes("pdf-form-submissions") ? "open" : "close"}
              to={"/pdf-form-submissions"}
            >
              <i class="fas fa-id-card-alt side-bar-main-icon"></i>
              <span>PDF Form Submissions</span>
            </Link>
          </li>
          <li className={url.includes("contact-form") ? "active" : ""}>
            <Link
              className={url.includes("contact-form") ? "open" : "close"}
              to={"/scholarShip-section"}
            >
              <i class="fas fa-id-card-alt side-bar-main-icon"></i>
              <span>Scholarship Section</span>
            </Link>
          </li>
          <li className={url.includes("top-bar-text") ? "active" : ""}>
            <Link
              className={url.includes("top-bar-text") ? "open" : "close"}
              to={"/top-bar-text"}
            >
              <i class="fas fa-id-card-alt side-bar-main-icon"></i>
              <span>Top Bar Text</span>
            </Link>
          </li>
          <li className={url.includes("google-indexing") ? "active" : ""}>
            <Link
              className={url.includes("google-indexing") ? "open" : "close"}
              to={"/google-indexing"}
            >
              <i class="fab fa-google side-bar-main-icon"></i>
              <span>Google Indexing</span>
            </Link>
          </li>

        </ul>
        <ul>
          <li className={url.includes("profile") ? "active" : ""}>
            <Link
              className={url.includes("profile") ? "open" : "close"}
              onClick={(e) => toggle(e)}
            >
              <i class="fas fa-user-edit side-bar-main-icon"></i>
              <span>Settings</span>
              <i className="ms-auto">
                <svg
                  width="7"
                  height="14"
                  viewBox="0 0 7 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.146447 0.646447C0.341709 0.451184 0.658291 0.451184 0.853553 0.646447L6.85355 6.64645C7.04882 6.84171 7.04882 7.15829 6.85355 7.35355L0.853553 13.3536C0.658291 13.5488 0.341709 13.5488 0.146447 13.3536C-0.0488155 13.1583 -0.0488155 12.8417 0.146447 12.6464L5.79289 7L0.146447 1.35355C-0.0488155 1.15829 -0.0488155 0.841709 0.146447 0.646447Z"
                    fill="#1C939C"
                  />
                </svg>
              </i>
            </Link>
            <ul className="ps-4">
              <li>
                <Link to={"/my-profile"}>View Profile</Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
