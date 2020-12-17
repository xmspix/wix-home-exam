import React from 'react';
import './App.scss';
import {createApiClient, Order, Orders} from './api';
import PaginationProps from "./components/pagination";
import FiltersProps from "./components/filters";
import OrderDetailsProps from "./components/orderDetails";
import StatusDeliveryProps from "./components/statusDelivery";

export type AppState = {
	orders?: Orders,
	notDelivered?: Orders,
	search: string,
	fulfillment: string,
	payment: string,
	showMoreIndex?: number | null,
	page: number,
	lastPage?: Boolean,
	filteredOrders?: any[],
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		fulfillment: '',
		payment: '',
		page: 1,
	};

	searchDebounce: any = null;
	
	async componentDidMount() {	
		const {page, search, fulfillment, payment} = this.state;

		this.setState({
			orders: await api.getOrders(page, search, fulfillment, payment),
			notDelivered: await api.getOrders(page, search, "not-fulfilled", "paid")
		});
	}

	onSearch = async (value: string, newPage?: number) => {
		const {fulfillment, payment} = this.state;
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: value,
				orders: await api.getOrders(1, value, fulfillment, payment),
				showMoreIndex: null
			});
		}, 300);
	};

	render() {
		let {orders, page, notDelivered} = this.state;

		const CURRENT_RESULTS:any = orders && page !== orders?.totalPages ? orders?.orders.length * page : orders?.totalResults;
		const VIEWED_RESULTS:any = orders && page !== 1 ? (CURRENT_RESULTS + 1) - orders?.orders.length: page;
		const RESULT_MESSAGE:any = `Showing ${orders?.totalPages !== 0 ? VIEWED_RESULTS : 0} to ${CURRENT_RESULTS} of ${orders?.totalResults} results`;
		return (
			<main>
				<h1>Orders</h1>
					<StatusDeliveryProps 
						getAssetByStatus={(status: string) => App.getAssetByStatus(status)}
						handleNotDelivered={() => this.handleNotDelivered()}
						notDelivered={notDelivered}
					/>
				<header>
					<input type="search" placeholder="Search" onChange={(e) => this.onSearch(e.target.value)}/>
				</header>
				<FiltersProps 
					setFilter={(option: string, value: string) => this.setFilter(option, value)}
				/>
				{ 
					orders && orders.totalResults !==0 
						? <div className='results'> {RESULT_MESSAGE} </div> 
						: <div className='results'> Showing 0 results </div>
				}
				{ orders ? this.renderOrders(orders) : <h2>Loading...</h2>}

			</main>
		)
	}

	handleDelivery(e:any, orderID: number) {
		e.stopPropagation();

		const {orders, notDelivered} = this.state;

		let tmpOrders: any = {
			totalPages: orders?.totalPages,
			totalResults: orders?.totalResults,
			orders: orders?.orders.map((item: any) => {
			if(item.id === orderID){
				return {...item, fulfillmentStatus: App.changeStatus(item.fulfillmentStatus)}
			} else {
				return item
			}
		})}

		let tmpNotDelivered: any = {
			...notDelivered
		}

		const billingInfo = orders?.orders.filter(order => order.id === orderID)[0].billingInfo.status
		const checkFulfilled = orders?.orders.filter(order => order.id === orderID)[0].fulfillmentStatus

		if(billingInfo === "paid") {
			this.setState({
				orders: tmpOrders,
				notDelivered: {
					...tmpNotDelivered, 
					totalResults: checkFulfilled === "fulfilled" 
						? tmpNotDelivered.totalResults + 1 
						: tmpNotDelivered.totalResults - 1
				}
			})
		}
		
	}

	handleShowMore = async(order: Order) => {
		const { orders, showMoreIndex } = this.state;
		const setIndex = App.getIndex(order, orders?.orders)

		this.setState({
			showMoreIndex: setIndex === showMoreIndex ? null : setIndex
		})
	}

	setPage = async(page: number) => {
		const {search, fulfillment, payment} = this.state;

		this.setState({
			orders: await api.getOrders(page, search, fulfillment, payment),
			page: page,
			showMoreIndex: null,
			lastPage: false
		})

		if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
		}
	}

	setFilter = async(option: string, value: string) => {
		const {search, fulfillment, payment} = this.state
		switch (option) {
			case "fulfillment":
				this.setState({
					fulfillment: value,
					payment: payment,
					page: 1,
					orders: await api.getOrders(1, search, value, payment),
					showMoreIndex: null
				})
				break;
		
			case "payment":
				this.setState({
					fulfillment: fulfillment,
					payment: value,
					page: 1,
					orders: await api.getOrders(1, search, fulfillment, value),
					showMoreIndex: null
				})
				break;
		}
	}

	handleNotDelivered = () => {
		const {notDelivered} = this.state;
		this.setState({
			orders: notDelivered,
			showMoreIndex: null,
			fulfillment: "not-fulfilled",
			payment: "paid",
			page:1,
			search: ""
		})
		
		const clearSearchBox: any = document.querySelector("input[type='search']");
		clearSearchBox.value = "";

		const setSelectorFulfillment: any = document.querySelector("#fulfillment");
		setSelectorFulfillment.value = "not-fulfilled";
		const setSelectorPaid: any = document.querySelector("#payment");
		setSelectorPaid.value = "paid";
	}
	
	renderOrders = (orders: any) => {	
		const {page, showMoreIndex} = this.state;
		
		const filteredOrders = orders.orders
		
		return (
			<div className='orders'>				
				<PaginationProps 
					currentPage={page}
					totalPages={orders.totalPages} 
					setPage={(page: number) => this.setPage(page)}
				/>
				{filteredOrders.map((order: any) => (
					<div className={'orderCard'} onClick={()=> this.handleShowMore(order)} key={order.id}>
						<div className={'generalData'}>
							<h6>{order.id}</h6>
							<h4>{order.customer.name}</h4>
							<h5>Order Placed: {new Date(order.createdDate).toLocaleString("he").replace(/\./gi,"/")}</h5>
						</div>
						<div className={'fulfillmentData'}>
							<h4>{order.itemQuantity} Items</h4>
							<img src={App.getAssetByStatus(order.fulfillmentStatus)} alt={order.fulfillmentStatus}/>
							{order.fulfillmentStatus !== 'canceled' && order.billingInfo.status === "paid" &&
								<a onClick={(e)=>this.handleDelivery(e,order.id)}>Mark as {
									order.fulfillmentStatus === 'fulfilled' 
										? 'Not Delivered' 
										: 'Delivered'
									}									
								</a>
							}
						</div>
						<div className={'paymentData'}>
							<h4>{order.price.formattedTotalPrice}</h4>
							<img src={App.getAssetByStatus(order.billingInfo.status)}/>
						</div>
						<OrderDetailsProps
							showMoreIndex={showMoreIndex}
							getIndex={(order: any, orders: any)=>App.getIndex(order, orders)}
							order={order}
							orders={orders.orders}
						/>
					</div>
				))}
				<PaginationProps 
					currentPage={this.state.page}
					totalPages={orders.totalPages} 
					setPage={(page: number) => this.setPage(page)}
				/>
			</div>
		)
	};

	static getIndex( order: Order, orders?: Order[]) {
		return orders?.map((o,i) => {
			if(o.id===order.id) return i
		}).filter(n => typeof n === 'number')[0]
	}

	static changeStatus(status: string) {
		switch (status) {
			case 'fulfilled':
				return 'not-fulfilled'
			case 'not-fulfilled':
				return 'fulfilled'
		}
	}

	static getAssetByStatus(status: string) {
		switch (status) {
			case 'fulfilled':
				return require('./assets/package.png');
			case 'not-fulfilled':
				return require('./assets/pending.png');
			case 'canceled':
				return require('./assets/cancel.png');
			case 'paid':
				return require('./assets/paid.png');
			case 'not-paid':
				return require('./assets/not-paid.png');
			case 'refunded':
				return require('./assets/refunded.png');
		}
	}
}

export default App;
