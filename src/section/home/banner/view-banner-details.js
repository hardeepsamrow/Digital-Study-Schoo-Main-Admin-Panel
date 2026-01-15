import React, {useEffect, useState, useRef } from "react";
import DataService from "../../../services/data.service";
import { useParams } from "react-router-dom";
import { format } from 'date-fns'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const ViewBannerDetail = () => {
    const form = React.useRef()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [disabled, setDisabled] = useState(true);
    const params = useParams();
    //console.log(props)

    useEffect(() => {
        getData()
    }, []);
    const getData = async() => {
        setLoading(true);
        await DataService.getBannerDetail(params.id).then((data) => {
            setData(data?.data?.data);
            setLoading(false);
        }).catch((error)=>{
            const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                toast.error(resMessage, {
                    position: toast.POSITION.TOP_RIGHT
                });
        });
        
    }
    const onChangeStatus = (e) => {
        const data = e.target.value;
        setStatus(data);
        setDisabled(false);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        if(status){
            data.append('status', status)
        }      
        DataService.updateBanner(params?.id, data).then(
            () => {
                getData();
                setLoading(false);
                toast.success('Data updated successfully!', {
                    position: toast.POSITION.TOP_RIGHT
                });
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                toast.error(resMessage, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        );
    };
    return (
        
        <div className="row">
            <ToastContainer></ToastContainer>
            <div className="col-md-12">
                <div className="row">
                    <div className="d-flex w-100 justify-content-between align-items-center mb-4">
                        <h4 className="mb-0 f-700">Banner Details</h4>
                    </div>
                </div>
                {!loading?
                            <div className="row">
                            <div className="col-md-8">
                                <table class="table table-bordered tf-12 product-detail">
                                    <thead class="table-secondary">
                                        <tr>
                                            <th scope="col" class="f-700">Banner Name</th>
                                            <th scope="col">{data?.title}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="f-700">Valid Date</td>
                                            <td>{(data?.to_date)? format(new Date(data?.to_date), 'MMM dd, yyyy'):""}</td>
                                        </tr>
                                        <tr>
                                            <td class="f-700">Banner Description</td>
                                            <td>{data?.description}</td>
                                        </tr>
                                    
                                    </tbody>
                                </table>

                                <div className="row mt-5">
                                <div className="col-xl-3 col-md-5 col-12">
                                    <form onSubmit={handleSubmit} ref={form}>
                                                    <div class="mb-3">
                                                            <label class="form-label">Change Status</label>
                                                            <select key={data?.status} defaultValue={data?.status} className="form-select" onChange={onChangeStatus}>
                                                                <option value="active">Active</option>
                                                                <option value="inactive">Inactive</option>
                                                                
                                                            </select>
                                                        </div>  
                                                <div class="mb-3">
                                                <button disabled={disabled || loading} className="btn btn-primary">
                                                        {loading && (
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                        )}
                                                        <span>Update</span>
                                                    </button>
                                                </div>
                                    </form>
                                </div>
                          </div>
                            </div>

                            <div className="col-md-4">
                            {(data.file_path ? 
                                        <img src={"https://api.yourbasket.co.ke/"+data.file_path} className="w-100" alt={data.first_name} />
                                    : ""
                                    )}
                            </div>
                        </div>:<span className="spinner-border spinner-border-sm"></span>
                }
                
            </div>
        </div>
    );
};

export default ViewBannerDetail;