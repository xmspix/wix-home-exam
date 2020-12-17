import express from 'express';
import bodyParser = require('body-parser');
const {products} = require('./products.json');

const app = express();
const allOrders: any[] = require('./orders.json');

const PORT = 3232;
const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

app.get('/api/orders', (req, res) => {
	const search = <string>req.query.search;
	const fulfillment = <string>req.query.fulfillment;
	const payment = <string>req.query.payment;
	const page = <number>(req.query.page || 1);
	// const orders: any[] = allOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	
	const combinedData = allOrders.map(order => ({ 
		...order, 
		items: order.items.map((items: any) => ({
				...items, 
				...products[items.id]
		}))
	}))
	.filter((order) => fulfillment ? order.fulfillmentStatus.toLowerCase() === fulfillment : order)
	.filter((order) => payment ? order.billingInfo.status.toLowerCase() === payment : order)
	.filter((order) => 
		order.customer.name.toLowerCase().includes(search.toLowerCase())
		|| order.items.find((item: any) => item.name.toLowerCase().includes(search.toLowerCase())))		
			
	res.send({
		totalPages: Math.ceil(combinedData.length / PAGE_SIZE), 
		totalResults: combinedData.length,
		orders: combinedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
	});
});

app.get('/api/items/:itemId', (req, res) => {
	const itemId = <string>(req.params.itemId);
	const size = <string>(req.query.size || 'large');
	const product = products[itemId];
	res.send({
		id: itemId,
		name: product.name,
		price: product.price,
		image: product.images[size]
	});
});

app.listen(PORT);
console.log('Listening on port', PORT);
