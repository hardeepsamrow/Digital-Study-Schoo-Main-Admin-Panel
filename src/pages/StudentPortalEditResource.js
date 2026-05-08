import React from "react";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import Footer from "../common/Footer";
import EditResource from "../section/home/student-portal/EditResource";

const StudentPortalEditResource = () => {
  return (
    <div className="bg-grey h-100">
      <Header />
      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <EditResource />
          </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default StudentPortalEditResource;
