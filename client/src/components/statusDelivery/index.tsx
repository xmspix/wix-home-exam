import React from 'react'
import "./style.scss";

export interface StatusDeliveryProps {
    handleNotDelivered: any;
    notDelivered: any;
    getAssetByStatus: any;
}
 
const StatusDelivery: React.FunctionComponent<StatusDeliveryProps> = ({handleNotDelivered, notDelivered, getAssetByStatus}) => {
    return (
        <div className="status">
            <span className={"status__link"} onClick={()=>handleNotDelivered()}>Not delivered <strong>{notDelivered?.totalResults}</strong> orders</span>
            <img src={getAssetByStatus("not-fulfilled")} alt={"not-fulfilled"}/>				
        </div>
    );
}
 
export default StatusDelivery;