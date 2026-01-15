import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import AllOrders from "../section/home/all-orders";
import MyProfileBanner from "../section/home/my-profile/my-profile-banner";
import MyProfileDetail from "../section/home/my-profile/my-profile-detail";
import EditProfileContent from "../section/home/my-profile/edit-myprofile-content";
const EditProfile = () => {
  React.useEffect(() => {
    document.title = "Edit Profile";
  }, []);

  return (
    <div className="bg-grey h-100">
      <Header />
      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
         <EditProfileContent/> 
          <Footer />
        </div>
      </section>


    </div>
  );
};

export default EditProfile;