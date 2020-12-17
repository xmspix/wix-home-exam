import axios from 'axios';

export type Customer = {
	name: string;
}

export type BillingInfo = {
	status: string;
}

export type Price = {
	formattedTotalPrice: string;
}

export type Order = {
	id: number;
	createdDate: string;
	fulfillmentStatus: string;
	billingInfo: BillingInfo;
	customer: Customer;
	itemQuantity: number;
	price: Price;
	items: [Item];
}

export type Item = {
	id: string;
	name: string;
	price: number;
	image: string;
}

export type Orders = {
	totalPages: number;
	totalResults: number;
	orders: [Order];
}

export type ApiClient = {
	getOrders: (page: number, search?: string, fulfillment?: string, payment?: string) => Promise<any>;
	getItem: (itemId: string) => Promise<Item>;
}

export const createApiClient = (): ApiClient => {
	return {
		getOrders: (page: number, search?: string, fulfillment?: string, payment?: string) => {
			return axios.get(`http://localhost:3232/api/orders?page=${page}&search=${search}&fulfillment=${fulfillment}&payment=${payment}`).then((res) => res.data);
		},
		getItem: (itemId: string) => {
			return axios.get(`http://localhost:3232/api/items/${itemId}`).then((res) => res.data);
		}
	}
};



