

const Router = require('../functionality/router');
const controller = require('../controller/controller');
const router = new Router()



router.get('/index', controller.getIndex)
router.get('/test', controller.getIndex)

router.post('/', controller.create)

module.exports = router