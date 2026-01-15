import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import TopbarTextList from "../section/home/TopbarTextList.js/TopbarTextList";
const TopBarText = () => {
  React.useEffect(() => {
    document.title = "Top Bar Text";
  }, []);

  return (
    <div className="bg-grey h-100">
      <Header />

      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <TopbarTextList />
          </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default TopBarText;
