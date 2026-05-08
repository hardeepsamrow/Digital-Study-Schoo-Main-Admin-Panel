import React from "react";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import Footer from "../common/Footer";
import AddStudent from "../section/home/student-portal/AddStudent";

const StudentPortalAddStudent = () => {
  return (
    <div className="bg-grey h-100">
      <Header />
      <section className="content-area">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <AddStudent />
          </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default StudentPortalAddStudent;
