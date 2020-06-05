const apiController = require('../controller/apiController');
const router = require('express').Router();
const { uploadSingle } = require('../middleware/multer');

router.get('/landing-page', apiController.landingPage);
router.get('/detail-page/:id', uploadSingle, apiController.detailPage);
router.post('/booking-page', uploadSingle, apiController.bookingPage);

module.exports = router;
