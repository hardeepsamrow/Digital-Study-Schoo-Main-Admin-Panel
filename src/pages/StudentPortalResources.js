import React from "react";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import Footer from "../common/Footer";
import ResourcesList from "../section/home/student-portal/ResourcesList";

const StudentPortalResources = () => {
  return (
    <div className="bg-grey h-100">
      <Header />
      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <ResourcesList />
          </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default StudentPortalResources;
