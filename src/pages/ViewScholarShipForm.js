import React from "react";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import Footer from "../common/Footer";
import ViewScholarShipFormList from "../section/home/ScholarShipFormList/ViewScholarShipFormList";

const ViewScholarShipForm = () => {
  React.useEffect(() => {
    document.title = "View Contact Form";
  }, []);

  return (
    <div className="bg-grey h-100">
      <Header />

      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <ViewScholarShipFormList/>
            </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default ViewScholarShipForm;
