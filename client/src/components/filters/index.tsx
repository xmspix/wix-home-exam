import React from 'react';
import "./style.scss";

export interface FiltersProps {
    setFilter: any;
}
 
const Filters: React.FunctionComponent<FiltersProps> = ({setFilter}) => {
    return (
        <div className="filters">
			<label htmlFor="">Filter by:</label>
            <div className="filters__container">
                <div className={"filter"}>
                    <label htmlFor="fulfillment">Fulfillment:</label>
                    <select id={"fulfillment"} onChange={(e)=>setFilter("fulfillment", e.target.value)}>
                        <option value="">All</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="not-fulfilled">Not fulfilled</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>

                <div className={"filter"}>
                    <label htmlFor="payment">Payment:</label>
                    <select id={"payment"} onChange={(e)=>setFilter("payment",e.target.value)}>
                        <option value="">All</option>
                        <option value="paid">Paid</option>
                        <option value="not-paid">Not paid</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>
            </div>
		</div>
    );
}
 
export default Filters;