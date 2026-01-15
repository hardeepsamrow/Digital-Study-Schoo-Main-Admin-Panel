import React, { useState, useEffect } from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import DataService from "../services/data.service";

const GoogleIndexing = () => {
    const [url, setUrl] = useState('');
    const [bulkUrls, setBulkUrls] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [mode, setMode] = useState('single'); // 'single' or 'bulk'
    const [bulkResults, setBulkResults] = useState([]);

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

    const handleBulkIndexRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setBulkResults([]);

        // Parse URLs from textarea (one per line)
        const urls = bulkUrls
            .split('\n')
            .map(u => u.trim())
            .filter(u => u.length > 0);

        if (urls.length === 0) {
            setMessage({ type: 'error', text: 'Please enter at least one URL.' });
            setLoading(false);
            return;
        }

        const results = [];
        let successCount = 0;
        let failCount = 0;

        for (const urlToIndex of urls) {
            try {
                const response = await DataService.requestIndexing({ url: urlToIndex });
                if (response.data.success) {
                    results.push({ url: urlToIndex, status: 'success', message: 'Indexed successfully' });
                    successCount++;
                } else {
                    results.push({ url: urlToIndex, status: 'error', message: response.data.message || 'Failed' });
                    failCount++;
                }
            } catch (error) {
                const errorMsg = error.response?.data?.message || error.message || 'Failed';
                results.push({ url: urlToIndex, status: 'error', message: errorMsg });
                failCount++;
            }
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        setBulkResults(results);
        setMessage({
            type: successCount > 0 ? 'success' : 'error',
            text: `Completed: ${successCount} successful, ${failCount} failed out of ${urls.length} URLs.`
        });
        setLoading(false);
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

                        {/* Mode Selector */}
                        <div className="row justify-content-center mt-4">
                            <div className="col-md-9">
                                <div className="btn-group w-100 mb-3" role="group">
                                    <button
                                        type="button"
                                        className={`btn ${mode === 'single' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setMode('single')}
                                    >
                                        <i className="fas fa-link mr-2"></i> Single URL
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${mode === 'bulk' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setMode('bulk')}
                                    >
                                        <i className="fas fa-list mr-2"></i> Bulk URLs
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Single URL Mode */}
                        {mode === 'single' && (
                            <div className="row justify-content-center">
                                <div className="col-md-9">
                                    <div className="card border-0 shadow-sm p-4">
                                        <h4 className="mb-4 text-gray-800">Manual Indexing Request</h4>
                                        <p className="text-muted mb-4">
                                            Enter the full URL of the page or blog post you want Google to index immediately.
                                        </p>

                                        <form onSubmit={handleIndexRequest}>
                                            <div className="form-group mb-3">
                                                <label htmlFor="url" className="form-label font-weight-bold">Page URL</label>
                                                <input
                                                    type="url"
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
                                                style={{ backgroundColor: '#2C5F2D', borderColor: '#2C5F2D' }}
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
                                                className={`alert mt-4 ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}
                                                role="alert"
                                            >
                                                {message.type === 'success' ? <i className="fas fa-check-circle mr-2"></i> : <i className="fas fa-exclamation-circle mr-2"></i>}
                                                {message.text}
                                            </div>
                                        )}

                                        <div className="mt-4 pt-3 border-top">
                                            <small className="text-muted">
                                                <i className="fas fa-info-circle mr-1"></i>
                                                Note: This sends a request to Google's Indexing API. Use this for time-sensitive content.
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bulk URL Mode */}
                        {mode === 'bulk' && (
                            <div className="row justify-content-center">
                                <div className="col-md-9">
                                    <div className="card border-0 shadow-sm p-4">
                                        <h4 className="mb-4 text-gray-800">Bulk Indexing Request</h4>
                                        <p className="text-muted mb-4">
                                            Enter multiple URLs (one per line) to request indexing for all of them at once.
                                        </p>

                                        <form onSubmit={handleBulkIndexRequest}>
                                            <div className="form-group mb-3">
                                                <label htmlFor="bulkUrls" className="form-label font-weight-bold">URLs (one per line)</label>
                                                <textarea
                                                    className="form-control"
                                                    id="bulkUrls"
                                                    value={bulkUrls}
                                                    onChange={(e) => setBulkUrls(e.target.value)}
                                                    placeholder={"https://digitalstudyschool.com/blog/post-1\nhttps://digitalstudyschool.com/blog/post-2\nhttps://digitalstudyschool.com/blog/post-3"}
                                                    rows="10"
                                                    required
                                                    style={{ padding: '10px', fontFamily: 'monospace' }}
                                                />
                                                <small className="form-text text-muted">
                                                    {bulkUrls.split('\n').filter(u => u.trim().length > 0).length} URLs entered
                                                </small>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="btn btn-primary btn-lg w-100"
                                                style={{ backgroundColor: '#2C5F2D', borderColor: '#2C5F2D' }}
                                            >
                                                {loading ? (
                                                    <span><i className="fas fa-spinner fa-spin mr-2"></i> Processing...</span>
                                                ) : (
                                                    'Request Bulk Indexing'
                                                )}
                                            </button>
                                        </form>

                                        {message && (
                                            <div
                                                className={`alert mt-4 ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}
                                                role="alert"
                                            >
                                                {message.type === 'success' ? <i className="fas fa-check-circle mr-2"></i> : <i className="fas fa-exclamation-circle mr-2"></i>}
                                                {message.text}
                                            </div>
                                        )}

                                        {/* Results Table */}
                                        {bulkResults.length > 0 && (
                                            <div className="mt-4">
                                                <h5 className="mb-3">Results:</h5>
                                                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                    <table className="table table-sm table-bordered">
                                                        <thead className="thead-light" style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa' }}>
                                                            <tr>
                                                                <th style={{ width: '60%' }}>URL</th>
                                                                <th style={{ width: '15%' }}>Status</th>
                                                                <th style={{ width: '25%' }}>Message</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {bulkResults.map((result, index) => (
                                                                <tr key={index}>
                                                                    <td style={{ fontSize: '12px', wordBreak: 'break-all' }}>{result.url}</td>
                                                                    <td>
                                                                        {result.status === 'success' ? (
                                                                            <span className="badge badge-success">
                                                                                <i className="fas fa-check"></i> Success
                                                                            </span>
                                                                        ) : (
                                                                            <span className="badge badge-danger">
                                                                                <i className="fas fa-times"></i> Failed
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td style={{ fontSize: '12px' }}>{result.message}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-4 pt-3 border-top">
                                            <small className="text-muted">
                                                <i className="fas fa-info-circle mr-1"></i>
                                                Note: Processing multiple URLs may take some time. Please be patient.
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                    <Footer />
                </div>
            </section>
        </div>
    );
};

export default GoogleIndexing;
