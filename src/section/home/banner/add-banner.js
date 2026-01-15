import React, {useEffect, useState, useRef } from "react";
import DataService from "../../../services/data.service";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router';
import { format } from 'date-fns'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const styles = {
    input: {
        opacity: '0%', // dont want to see it
        position: 'absolute' // does not mess with other elements 
    }
}
const AddBannerDetail = () => {
    const form = useRef();
    const [name, setName] = useState("");
    const [bannerUrl, setBannerUrl] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [fromDate, setFromdate] = useState("");
    const [toDate, setTodate] = useState("");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const inputFileRef = React.useRef(); 
    const imgRef = React.useRef(); 
    const navigate = useNavigate();
    const params= useParams();

    useEffect(() => {
    }, []);
    const triggerFile = () => {
        /*Collecting node-element and performing click*/
        inputFileRef.current.click();
    };
    const onFileChangeCapture = ( e)=> {
        /*Selected files data can be collected here.*/
        const file = e.target.files[0]
        setFile(e.target.files)
        const reader = new FileReader();
        const url = reader.readAsDataURL(file);
        reader.onloadend = function (theFile) {
            var image = new Image();
            image.src = theFile.target.result;
            imgRef.current.src = image.src  

          }
      };
    const onChangeName = (e) => {
        const name = e.target.value;
        setName(name);
    };
    const onChangeUrl = (e) => {
        const bannerUrl = e.target.value;
        setBannerUrl(bannerUrl);
    };
    const onChangeDescription = (e) => {
        const description = e.target.value;
        setDescription(description);
    }
    
    const onChangeFromDate = (e) => {
        const data = e.target.value;
        setFromdate(data);
    };
    const onChangeToDate = (e) => {
        const date = e.target.value;
        setTodate(date);
    };
      const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");
        const data = new FormData();
        if(file && file.length>0){
            data.append('image', file[0])
        }else{
            toast.error('Banner image is required, Please upload image!', {
                position: toast.POSITION.TOP_RIGHT
            }); 
            return; 
        }
        setLoading(true);
        data.append('title',name);
        data.append('url',bannerUrl)
        data.append('description',description)
        data.append('from_date',fromDate);
        data.append('to_date',toDate)
        data.append('type', params.type)
        
        DataService.addBanner(data).then(
            () => {
              navigate("/banner/"+(params.type == 5 ? 2 : params.type == 6 ? 4 : params.type));
              window.location.reload();
            },
            (error) => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.msg) ||
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
        <div className="container-fluid">
            <ToastContainer></ToastContainer>
            <div className="row">
                <div className="d-flex w-100 justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 f-700">Add Banner</h4>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 login" ref={form}>
                <div className="row">
                    <div className="col-xxl-3 col-lg-4">
                        <div className="card mb-4">
                            <div className="card-body text=center">
                                <h4 className="f-700">Banner image</h4>
                                <div className="Delete-image"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.410582 0.410749C0.736019 0.0853125 1.26366 0.0853125 1.58909 0.410749L5.99984 4.82149L10.4106 0.410749C10.736 0.0853125 11.2637 0.0853125 11.5891 0.410749C11.9145 0.736186 11.9145 1.26382 11.5891 1.58926L7.17835 6.00001L11.5891 10.4108C11.9145 10.7362 11.9145 11.2638 11.5891 11.5893C11.2637 11.9147 10.736 11.9147 10.4106 11.5893L5.99984 7.17852L1.58909 11.5893C1.26366 11.9147 0.736019 11.9147 0.410582 11.5893C0.0851447 11.2638 0.0851447 10.7362 0.410582 10.4108L4.82133 6.00001L0.410582 1.58926C0.0851447 1.26382 0.0851447 0.736186 0.410582 0.410749Z" fill="black" />
                                </svg>
                                </div>
                                <div className="Product-thumbnail" onClick={triggerFile}>
                                    <img  style={{width : '100%'}} src="../assets/img/img-placeholder.svg" className="w-100" ref={imgRef}/>
                                </div>
                                <p className="text-center">Set the Banner image. Only
                                    *.png, *.jpg and *.jpeg image files
                                    are accepted</p>
                                <p className="text-center">{params.type == 1 ? 'Recommended Size: 850 X 600' : ""}</p>
                                <p className="text-center">{params.type == 2 ? 'Recommended Size: 350 X 275' : ""}</p>
                                <p className="text-center">{params.type == 3 ? 'Recommended Size: 1500 X 350' : ""}</p>
                                <p className="text-center">{params.type == 4 ? 'Recommended Size: 750 X 250' : ""}</p>
                                <p className="text-center">{params.type == 5 ? 'Recommended Size: 350 X 275' : ""}</p>
                                <p className="text-center">{params.type == 6 ? 'Recommended Size: 750 X 250' : ""}</p>
                            </div>
                            <input
                                    type="file"
                                    ref={inputFileRef}
                                    style={styles.input}
                                    accept="image/*"
                                    onChangeCapture={onFileChangeCapture}
                                />
                        </div>
                    </div>
                    <div className="col-xxl-9 col-lg-8 ps-xxl-5 ps-md-3 ps-0">
                        <div className="card mb-5">
                            <div className="card-body p-4">

                                <div className="mb-4">
                                    <label className="form-label">Banner Title </label>
                                    <input 
                                    type="text"
                                    onChange={onChangeName}
                                    onBlur={onChangeName}
                                    className="form-control" 
                                    placeholder="Banner Title" />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label className="form-label">Valid Date</label>
                                        <input 
                                        type="date" 
                                        onChange={onChangeFromDate}
                                        className="form-control" 
                                        min={format(new Date(), 'yyyy-MM-dd')}
                                        placeholder="From" />
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="form-label">&nbsp;</label>
                                        <input 
                                        type="date" 
                                        min={format(new Date(), 'yyyy-MM-dd')}
                                        onChange={onChangeToDate}
                                        className="form-control" 
                                        placeholder="To" />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">URL </label>
                                    <input 
                                    type="text"
                                    onChange={onChangeUrl}
                                    onBlur={onChangeUrl}
                                    className="form-control" 
                                    placeholder="URL" />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Description </label>

                                    <textarea 
                                    class="form-control" 
                                    placeholder="Description"
                                    onChange={onChangeDescription} 
                                    onBlur={onChangeDescription}
                                    rows={"5"} id="floatingTextarea2" ></textarea>
                                </div>
                                <div className="d-flex justify-content-end btn-min-width">
                                <button className="btn btn-primary" disabled={loading}>
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>Save</span>
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddBannerDetail;