const router = require('express').Router();
const adminController = require('../controller/adminController.js');
const { uploadSingle, uploadMultiple } = require('../middleware/multer');
const auth = require('../middleware/auth');

//endpoint Sign In
router.get('/signin', adminController.viewSignin);
router.post('/signin', adminController.actionSignin);
router.use(auth);
//endpoint Logout
router.get('/logout', adminController.actionLogout);
//endpoint Dashboard
router.get('/dashboard', adminController.dashboard);
//endpoint Category
router.get('/category', adminController.category);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);
//endpoint Bank
router.get('/bank', adminController.bank);
router.post('/bank', uploadSingle, adminController.addBank);
router.put('/bank', uploadSingle, adminController.editBank);
router.delete('/bank/:id', adminController.deleteBank);
//endpoint Item
router.get('/item', adminController.item);
router.post('/item', uploadMultiple, adminController.addItem);
router.get('/item/view-item/:id', adminController.showImageItem);
router.get('/item/:id', adminController.editItem);
router.put('/item/:id', uploadMultiple, adminController.editItemSubmit);
router.delete('/item/:id', adminController.deleteItem);
//endpoint detail item
router.get('/item/show-detail-items/:itemId', adminController.detailItems);
//endpoint Feature
router.post('/item/add/feature', uploadSingle, adminController.addFeature);
router.put('/item/add/feature', uploadSingle, adminController.editFeature);
router.delete('/item/:itemId/feature/:id', adminController.deleteFeature);
//endpoint Activity
router.post('/item/add/activity', uploadSingle, adminController.addActivity);
router.put('/item/add/activity', uploadSingle, adminController.editActivity);
router.delete('/item/:itemId/activity/:id', adminController.deleteActivity);
//endpoint Booking
router.get('/booking', adminController.booking);
//endpoint Detail Booking
router.get('/booking/:id', adminController.bookingDetail);
router.put('/booking/:id/accept', adminController.actionAccept);
router.put('/booking/:id/reject', adminController.actionReject);

module.exports = router;
