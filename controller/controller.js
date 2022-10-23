const url = require('url');
const { getOrdersData } = require('../utills/getOrdersData');
const { getVendorsFullData } = require('../utills/getVendorsData');
const { placeItemToFile } = require('../utills/placeItemToFile');
const { placeOrderToFile } = require('../utills/placeOrderToFile');

const getIndex =  async (req, res) => {
    res.sendHtmlFile('../public/index.html');
}

const getPublicFile =  async (req, res) => {
    res.sendFile('../public' + req.url);
}

const getVendors =  async (req, res) => {
    const data = await getVendorsFullData()

    const query = url.parse(req.url,true).query

    if (query.id) {
        const foundVendor = data.find(el => el.id === parseInt(query.id))
        res.send(foundVendor)
    }
    else {
        // for (let i in data) {
        //     delete data[i].supplies
        // }
        res.send(data)
    }
}

const placeOrder =  async (req, res) => {
    const orderData = req.body

    placeOrderToFile(orderData)
    .then(response => {
        res.send('ok')
    })
    .catch(err => {
        console.error(err)
    })
}


const placeItem =  async (req, res) => {
    const itemData = req.body

    placeItemToFile(itemData)
    .then(response => {
        res.send('ok')
    })
    .catch(err => {
        console.error(err)
    })
}

const ordersData = async (req, res) => {
    const orders = await getOrdersData()
    const query = url.parse(req.url,true).query
    if (query.vendorId) {
        const filteredOrders = orders.filter(el => el.vendorId === query.vendorId)
        res.send(filteredOrders)
    }
    else {
        res.send(orders)
    }
}



module.exports = {
    getIndex,
    getPublicFile,
    getVendors,
    placeOrder,
    ordersData,
    placeItem
}