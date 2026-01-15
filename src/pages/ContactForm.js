import React from "react";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import Footer from "../common/Footer";
import ContactFormList from "../section/home/contact-formList/ContactFormList";

const ContactForm = () => {
  React.useEffect(() => {
    document.title = "All Contact Form";
  }, []);

  return (
    <div className="bg-grey h-100">
      <Header />

      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <ContactFormList/>
            </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default ContactForm;
