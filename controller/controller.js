const url = require('url');
const { getVendorsFullData } = require('../utills/getVendorsData');

const getIndex =  async (req, res) => {
    res.sendHtmlFile('../public/orderform.html');
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
        for (let i in data) {
            delete data[i].supplies
        }
        res.send(data)
    }
}



module.exports = {
    getIndex,
    getPublicFile,
    getVendors,
}