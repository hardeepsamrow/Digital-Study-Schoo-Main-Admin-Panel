import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import VideoReviewsList from "../section/home/videoReviews/VideoReviewsList";

const VideoReviews = () => {
  React.useEffect(() => {
    document.title = "Student Video Reviews";
  }, []);

  return (
    <div className="bg-grey h-100">
      <Header />
      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <VideoReviewsList />
          </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default VideoReviews;
