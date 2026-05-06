import React from "react";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import Footer from "../common/Footer";
import AddResource from "../section/home/student-portal/AddResource";

const StudentPortalAddResource = () => {
  return (
    <div className="bg-grey h-100">
      <Header />
      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <AddResource />
          </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default StudentPortalAddResource;
