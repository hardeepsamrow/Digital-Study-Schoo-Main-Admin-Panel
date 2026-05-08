import React from "react";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import Footer from "../common/Footer";
import StudentsList from "../section/home/student-portal/StudentsList";

const StudentPortalStudents = () => {
  return (
    <div className="bg-grey h-100">
      <Header />
      <section className="content-area">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <StudentsList />
          </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default StudentPortalStudents;
