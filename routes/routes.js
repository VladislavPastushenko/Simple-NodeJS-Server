

const Router = require('../functionality/router');
const controller = require('../controller/controller');
const router = new Router()
const publicFiles = require('../routes/publicFiles')

router.get('/', controller.getIndex)

for (let i=0; i < publicFiles.length; i++) {
    router.get(`/${publicFiles[i]}`, controller.getPublicFile)
}

router.get('/vendors', controller.getVendors)

router.post('/place-order', controller.placeOrder)

router.post('/place-item', controller.placeItem)

router.get('/orders', controller.ordersData)


module.exports = router