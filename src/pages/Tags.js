import React from "react";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import Footer from "../common/Footer";
import AllTagsList from "../section/home/Tags/AllTagsList";

const Tags = () => {
  React.useEffect(() => {
    document.title = "All Tags";
  }, []);

  return (
    <div className="bg-grey h-100">
      <Header />

      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <AllTagsList/>
            </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default Tags;
