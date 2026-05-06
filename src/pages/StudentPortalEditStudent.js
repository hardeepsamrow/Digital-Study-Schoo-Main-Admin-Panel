import React from "react";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import Footer from "../common/Footer";
import EditStudent from "../section/home/student-portal/EditStudent";

const StudentPortalEditStudent = () => {
  return (
    <div className="bg-grey h-100">
      <Header />
      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <EditStudent />
          </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default StudentPortalEditStudent;
