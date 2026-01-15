import React, { useEffect,useState,Fragment } from "react";
import DataService from "../../services/data.service";
const SignUpFieldContent = () => {
    const [data, setData] = useState([]);
    const [vendorData, setVendorData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getData();
      }, []);
    const getData = () => {;
        DataService.getUserField().then((data) => {
            setLoading(false);
           setData(data?.data?.data);
           setVendorData(data?.data?.vendorData)
          setLoading(false);
        }).catch((error)=>{
            setLoading(false);
        });
      };
     const upateUserFiled = (event,field)=>{
        const postdata = {};
        postdata[field] = (event.target.checked)?'yes':'no';
        if(data){
            postdata.id = data.id
        }
        DataService.addUserField(postdata, 'user').then((data) => {
            setLoading(false);
        }).catch((error)=>{
            setLoading(false);
        });
     }
     const upateVendorFiled = (event,field)=>{
        const data = {};
        data[field] = (event.target.checked)?'yes':'no';
        if(vendorData){
            data.id = vendorData.id
        }
       
        DataService.addUserField(data, 'vendor').then((data) => {
            setLoading(false);
        }).catch((error)=>{
            setLoading(false);
        });
     }
    return (
        <div className="container-fluid">
            {!loading?
            <form>
                <div className="row">
                    <div className="col-md-12">

                        <div className="card card-highlight mb-5">
                            <div className="card-body p-4">
                                <h5 className="mb-4 f-700">User Sign up</h5>
                                <div className="row">
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">First Name</span>
                                        <label class="switch"><input 
                                        type="checkbox"
                                        defaultChecked={data?.first_name && data?.first_name==='yes'?true:false}
                                        onChange={(e)=>upateUserFiled(e, 'first_name')} /><span class="slider round"></span></label>
                                    </div>
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">Last Name</span>
                                        <label class="switch"><input 
                                        type="checkbox"
                                        defaultChecked={data?.last_name && data?.last_name==='yes'?true:false} 
                                        onChange={(e)=>upateUserFiled(e, 'last_name')} /><span class="slider round"></span></label>
                                    </div>
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">Mobile Number</span>
                                        <label class="switch"><input 
                                        type="checkbox" 
                                        defaultChecked={data?.mobile_number && data?.mobile_number==='yes'?true:false} 
                                        onChange={(e)=>upateUserFiled(e, 'mobile_number')}/><span class="slider round"></span></label>
                                    </div>
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">Email</span>
                                        <label class="switch"><input 
                                        type="checkbox"
                                        defaultChecked={data?.email && data?.email==='yes'?true:false} 
                                        onChange={(e)=>upateUserFiled(e, 'email')}/><span class="slider round"></span></label>
                                    </div>
                                    <div className="col-md-12 py-3 d-flex justify-content-between align-items-center">
                                        <span className="f-24">Password</span>
                                        <label class="switch"><input 
                                        type="checkbox"
                                        defaultChecked={data?.password && data?.password==='yes'?true:false}
                                        onChange={(e)=>upateUserFiled(e, 'password')} /><span class="slider round"></span></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                       <div className="card card-highlight mb-5">
                            <div className="card-body p-4">
                                <h5 className="mb-4 f-700">Vendor Sign up</h5>
                                <div className="row">
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">First Name</span>
                                        <label class="switch"><input 
                                        type="checkbox"  defaultChecked={vendorData?.first_name && vendorData?.first_name==='yes'?true:false}
                                        onChange={(e)=>upateVendorFiled(e, 'first_name')}/><span class="slider round"></span></label>
                                    </div>
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">Middle Name</span>
                                        <label class="switch"><input
                                        defaultChecked={vendorData?.middle_name && vendorData?.first_name==='yes'?true:false}
                                        onChange={(e)=>upateVendorFiled(e, 'middle_name')}
                                        type="checkbox" /><span class="slider round"></span></label>
                                    </div>
                                  
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">Last Name</span>
                                        <label class="switch"><input
                                        defaultChecked={vendorData?.last_name && vendorData?.last_name==='yes'?true:false}
                                        onChange={(e)=>upateVendorFiled(e, 'last_name')}
                                        type="checkbox" /><span class="slider round"></span></label>
                                    </div>
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">Company/Business Name</span>
                                        <label class="switch"><input 
                                        type="checkbox"
                                        defaultChecked={vendorData?.company_name && vendorData?.company_name==='yes'?true:false}
                                        onChange={(e)=>upateVendorFiled(e, 'company_name')}
                                         /><span class="slider round"></span></label>
                                    </div>
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">Website Link</span>
                                        <label class="switch"><input
                                        defaultChecked={vendorData?.link && vendorData?.link==='yes'?true:false}
                                        onChange={(e)=>upateVendorFiled(e, 'link')} 
                                        type="checkbox" /><span class="slider round"></span></label>
                                    </div>
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">Email</span>
                                        <label class="switch"><input
                                        defaultChecked={vendorData?.email && vendorData?.email==='yes'?true:false}
                                        onChange={(e)=>upateVendorFiled(e, 'email')} 
                                        type="checkbox" /><span class="slider round"></span></label>
                                    </div>
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">Phone Number</span>
                                        <label class="switch"><input
                                        defaultChecked={vendorData?.mobile_number && vendorData?.mobile_number==='yes'?true:false}
                                        onChange={(e)=>upateVendorFiled(e, 'mobile_number')}  
                                        type="checkbox" /><span class="slider round"></span></label>
                                    </div>
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">Address</span>
                                        <label class="switch"><input
                                        defaultChecked={vendorData?.address && vendorData?.address==='yes'?true:false}
                                        onChange={(e)=>upateVendorFiled(e, 'address')}
                                        type="checkbox" /><span class="slider round"></span></label>
                                    </div>
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">State</span>
                                        <label class="switch"><input
                                        defaultChecked={vendorData?.state && vendorData?.state==='yes'?true:false}
                                        onChange={(e)=>upateVendorFiled(e, 'state')}
                                        type="checkbox" /><span class="slider round"></span></label>
                                    </div>
                                    <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">City</span>
                                        <label class="switch"><input
                                        defaultChecked={vendorData?.city && vendorData?.city==='yes'?true:false}
                                        onChange={(e)=>upateVendorFiled(e, 'city')} 
                                        type="checkbox" /><span class="slider round"></span></label>
                                    </div>
                                    {/* <div className="col-md-12 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="f-24">Name of Referral</span>
                                        <label class="switch"><input type="checkbox" /><span class="slider round"></span></label>
                                    </div> */}
                                    {/* <div className="col-md-12 py-3 d-flex justify-content-between align-items-center">
                                        <span className="f-24">Document upload</span>
                                        <label class="switch"><input type="checkbox" /><span class="slider round"></span></label>
                                    </div> */}

                                </div>
                            </div>
                        </div>


                       
                    </div>
                </div>
            </form>
            :<div className="col-lg-6 m-auto">
                {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                )}
            </div>
}
        </div>
    );
};

export default SignUpFieldContent;