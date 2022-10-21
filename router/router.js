

const Router = require('../functionality/Router');
const controller = require('./controller');
const router = new Router()



router.get('/', controller.get)

router.post('/', controller.create)

module.exports = router