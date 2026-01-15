import React, { useState, useEffect } from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import DataService from "../services/data.service";

const GoogleIndexing = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        document.title = "Google Indexing | Digital Study School";
    }, []);

    const handleIndexRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await DataService.requestIndexing({ url });

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Indexing requested successfully!' });
                setUrl('');
            } else {
                setMessage({ type: 'error', text: response.data.message || 'Failed to request indexing.' });
            }
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || 'Failed to request indexing. Please try again.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-grey h-100">
            <Header />
            <section className="content-area mt-4">
                <Sidebar />
                <div className="Right-content">
                    <div className="main-content">
                        <div className="hp_title">
                            <h2>Google Indexing</h2>
                        </div>

                        <div className="row justify-content-center mt-5">
                            <div className="col-md-9">
                                <div className="card border-0 shadow-sm p-4">
                                    <h4 className="mb-4 text-gray-800">Manual Indexing RPC</h4>
                                    <p className="text-muted mb-4">
                                        Enter the full URL of the page or blog post you want Google to see immediately.
                                    </p>

                                    <form onSubmit={handleIndexRequest}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="url" className="form-label font-weight-bold">Page URL</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="url"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                placeholder="https://digitalstudyschool.com/blog/example-post"
                                                required
                                                style={{ padding: '10px' }}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn btn-primary btn-lg w-100"
                                            style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
                                        >
                                            {loading ? (
                                                <span><i className="fas fa-spinner fa-spin mr-2"></i> Submitting...</span>
                                            ) : (
                                                'Request Indexing'
                                            )}
                                        </button>
                                    </form>

                                    {message && (
                                        <div
                                            className={`alert mt-4 ${message.type === 'success' ? 'alert-success' : 'alert-danger'
                                                }`}
                                            role="alert"
                                        >
                                            {message.type === 'success' ? <i className="fas fa-check-circle mr-2"></i> : <i className="fas fa-exclamation-circle mr-2"></i>}
                                            {message.text}
                                        </div>
                                    )}

                                    <div className="mt-4 pt-3 border-top">
                                        <small className="text-muted">
                                            <i className="fas fa-info-circle mr-1"></i>
                                            Note: This sends a request to Google's Indexing API. Use this for time-sensitive content like job postings or news.
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <Footer />
                </div>
            </section>
        </div>
    );
};

export default GoogleIndexing;
