import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Loginpage from "./pages/login";
import Dashboard from "./pages/dashboard";
import Otp from "./pages/otp";
import ForgotPassword from "./pages/forgot-password";
import { RestrictedAccess } from "./private-component/RestrictedAccess";
import SignUpFields from "./pages/signup-field";
import MyProfile from "./pages/myprofile";
import Notification from "./pages/notification";
import Blogs from "./pages/blog";

import AddBlog from "./pages/add-blog";
import EditBlog from "./pages/edit-blog";
import Forgot from "./pages/Forgot";
import Resetpassword from "./pages/reset-password";
import ContactForm from "./pages/ContactForm";
import Category from "./pages/category";
import AddCategory from "./pages/AddCategory";
import AddTag from "./pages/AddTag";
import Tags from "./pages/Tags";
import EditTag from "./pages/EditTag";
import EditCategory from "./pages/EditCategory";
import ViewContactForm from "./pages/ViewContactForm";
import SendEmail from "./pages/SendEmail";
import ScholarShipSection from "./pages/scholarshipsection";
import ScholarShipForm from "./pages/ScholarShipForm";
import ViewScholarShipForm from "./pages/ViewScholarShipForm";
import TopBarText from "./pages/topbartext";
import PDFFormList from "./section/home/pdf-form/PDFFormList";
import GoogleIndexing from "./pages/GoogleIndexing";
export default function App() {
  return (
    <HashRouter onUpdate={() => window.scrollTo(0, 0)}>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route exact path="/Login" element={<Loginpage />} />
        <Route exact path="/otp" element={<Otp />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password/:token" element={<Resetpassword />} />
        <Route element={<RestrictedAccess />}>
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/sign-up-fields" element={<SignUpFields />} />
          <Route exact path="/my-profile" element={<MyProfile />} />
          <Route exact path="/edit-profile/:id" element={<MyProfile />} />
          <Route exact path="/notification" element={<Notification />} />
          <Route exact path="/blogs" element={<Blogs />} />
          <Route exact path="/add-blog" element={<AddBlog />} />
          <Route exact path="/edit-blog/:id" element={<EditBlog />} />
          <Route exact path="/contact-form" element={<ContactForm />} />
          <Route exact path="/all-categories" element={<Category />} />
          <Route exact path="/add-category" element={<AddCategory />} />
          <Route exact path="/edit-category/:id" element={<EditCategory />} />
          <Route exact path="/all-tags" element={<Tags />} />
          <Route exact path="/add-tag" element={<AddTag />} />
          <Route exact path="/edit-tag/:id" element={<EditTag />} />
          <Route exact path="/view-contact-form/:id" element={<ViewContactForm />} />
          <Route exact path="/send-email/:id" element={<SendEmail />} />
          <Route exact path="/scholarShip-section" element={<ScholarShipSection />} />
          <Route exact path="/scholarship-form" element={<ScholarShipForm />} />
          <Route exact path="/pdf-form-submissions" element={<PDFFormList />} />
          <Route exact path="/view-scholarship-form/:id" element={<ViewScholarShipForm />} />
          <Route exact path="/top-bar-text" element={<TopBarText />} />
          <Route exact path="/google-indexing" element={<GoogleIndexing />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
