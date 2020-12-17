import React from 'react'
import {Orders} from '../../api';
import "./style.scss"

export interface OrderDetailsProps {
    showMoreIndex: any;
    getIndex: any;
    order: any;
    orders: Orders;
}
 
const OrderDetails: React.FunctionComponent<OrderDetailsProps> = ({showMoreIndex, getIndex, order, orders}) => {
    return (
        <div className={showMoreIndex === getIndex(order, orders) ? 'moreData' : 'hide'}>
            <h4>Items</h4>
            <div className="moreData__container">
                { order.items
                    .sort((a:any, b:any) => b.price - a.price)
                    .map((item: any, showMoreIndex: number) => (
                    <div className="orderDetails" key={showMoreIndex}>
                        <div className={"card"} >
                            <img src={item.images.medium} className={"card-img-top"} alt={item.name} />
                                <div className="card-header">
                                    <small>Price: ${item.price}</small>
                                    <small>Quantity: {item.quantity}</small>
                                </div>
                            <div className={"card-body"}>
                                <h4>{item.name}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default OrderDetails;