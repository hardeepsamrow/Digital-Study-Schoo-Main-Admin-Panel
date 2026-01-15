import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import ScholarShipSectionList from "../section/home/scholarshipsectionList/scholarshipsectionList";
const ScholarShipSection = () => {
  React.useEffect(() => {
    document.title = "ScholarShip Section";
  }, []);

  return (
    <div className="bg-grey h-100">
      <Header />

      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <ScholarShipSectionList />
          </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default ScholarShipSection;
