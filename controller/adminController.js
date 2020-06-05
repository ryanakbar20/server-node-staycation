const fs = require('fs-extra');
const path = require('path');
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const Users = require('../models/Users');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const bcrypt = require('bcryptjs');

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user == null || req.session.user == undefined) {
        res.render('index', {
          title: 'Staycation | Sign In',
          alert,
        });
      } else {
        res.redirect('/admin/dashboard');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/signin');
    }
  },
  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username: username });
      if (!user) {
        req.flash('alertMessage', `Username yang anda masukan salah`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/signin');
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        req.flash('alertMessage', `Password yang anda masukan salah`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/signin');
      }
      req.session.user = {
        id: user._id,
        username: user.username,
      };
      res.redirect('/admin/dashboard');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/signin');
    }
  },
  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect('/admin/signin');
  },
  dashboard: async (req, res) => {
    try {
      const member = await Member.find();
      const item = await Item.find();
      const category = await Category.find();
      const booking = await Booking.find();
      res.render('admin/dashboard', {
        title: 'Staycation | Dashboard',
        user: req.session.user,
        member,
        item,
        category,
        booking,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/dashboard');
    }
  },
  category: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/category', {
        category,
        alert,
        title: 'Staycation | Category',
        user: req.session.user,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash('alertMessage', 'Success Add Category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },
  editCategory: async (req, res) => {
    try {
      const { name, id } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash('alertMessage', 'Success Update Category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await category.remove();
      req.flash('alertMessage', 'Success Delete Category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },
  bank: async (req, res) => {
    try {
      const bank = await Bank.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/bank', {
        title: 'Staycation | Bank',
        bank,
        alert,
        user: req.session.user,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },
  addBank: async (req, res) => {
    try {
      const { nameBank, nomorRekening, name } = req.body;
      await Bank.create({
        nameBank,
        nomorRekening,
        name,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash('alertMessage', 'Success Add New Bank');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/bank');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },
  editBank: async (req, res) => {
    try {
      const { nameBank, nomorRekening, name, id } = req.body;
      const bank = await Bank.findOne({ _id: id });

      if (req.file == undefined) {
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.name = name;
        await bank.save();
        req.flash('alertMessage', 'Success Update Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank');
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.name = name;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        req.flash('alertMessage', 'Success Update Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      req.flash('alertMessage', 'Success Delete Bank');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/bank');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },
  item: async (req, res) => {
    try {
      const item = await Item.find()
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate({ path: 'categoryId', select: 'id name' });
      const category = await Category.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/item', {
        title: 'Staycation | Item',
        category,
        alert,
        item,
        action: 'value',
        user: req.session.user,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },
  addItem: async (req, res) => {
    try {
      const { title, price, city, about, categoryId } = req.body;
      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });
        const itemList = {
          title,
          price,
          city,
          description: about,
          categoryId: category._id,
        };
        const item = await Item.create(itemList);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          (await item).save();
        }
      }
      req.flash('alertMessage', 'Success Add Item');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/item');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },
  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        path: 'imageId',
        select: 'id imageUrl',
      });
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/item', {
        title: 'Staycation | Item',
        alert,
        item,
        action: 'show-image',
        user: req.session.user,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },
  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: 'imageId',
          select: 'id imageUrl',
        })
        .populate({
          path: 'categoryId',
          select: 'id name',
        });
      const category = await Category.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/item', {
        title: 'Staycation | Item',
        alert,
        item,
        category,
        action: 'edit-item',
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },
  editItemSubmit: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, price, city, categoryId, about } = req.body;
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate({ path: 'categoryId', select: 'id name' });
      if (req.files.length > 0) {
        for (let i = 0; i <= item.imageId.length; i++) {
          const saveImage = await Image.findOne({ _id: item.imageId[i]._id });
          await fs.unlink(path.join(`public/${saveImage.imageUrl}`));
          saveImage.imageUrl = `images/${req.files[i].filename}`;
          await saveImage.save();
          item.title = title;
          item.price = price;
          item.city = city;
          item.categoryId = categoryId;
          item.description = about;
          await item.save();
          req.flash('alertMessage', 'Success Update Item');
          req.flash('alertStatus', 'success');
          res.redirect('/admin/item');
        }
      } else {
        item.title = title;
        item.price = price;
        item.city = city;
        item.categoryId = categoryId;
        item.description = about;
        await item.save();
        req.flash('alertMessage', 'Success Update Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },
  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        path: 'imageId',
        select: 'id imageUrl',
      });
      for (let i = 0; i < item.imageId.length; i++) {
        await fs.unlink(path.join(`public/${item.imageId[i].imageUrl}`));
        const image = await Image.findOne({ _id: item.imageId[i].id });
        await image.remove();
      }

      await item.remove();
      req.flash('alertMessage', 'Success Delete Item');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/item');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },
  detailItems: async (req, res) => {
    const { itemId } = req.params;
    const feature = await Feature.find({ itemId: itemId });
    const activity = await Activity.find({ itemId: itemId });
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };
    res.render('admin/item/detail_items', {
      title: 'Staycation | Detail Items',
      alert,
      itemId,
      feature,
      activity,
      user: req.session.user,
    });
  },
  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;

    try {
      if (!req.file) {
        req.flash('alertMessage', 'Image not found');
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: feature._id });
      await item.save();
      req.flash('alertMessage', 'Success Add Feature');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-items/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-items/${itemId}`);
    }
  },
  editFeature: async (req, res) => {
    const { id, name, qty, itemId } = req.body;
    try {
      const feature = await Feature.findOne({ _id: id });
      if (req.file == undefined) {
        feature.name = name;
        feature.qty = qty;
        await feature.save();
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.name = name;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();
      }
      req.flash('alertMessage', 'Success Edit Feature');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-items/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-items/${itemId}`);
    }
  },
  deleteFeature: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const feature = await Feature.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId }).populate('featureId');
      for (let i = 0; i < item.featureId.length; i++) {
        if (item.featureId[i]._id.toString() === feature._id.toString()) {
          item.featureId.pull({ _id: feature._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.remove();
      req.flash('alertMessage', 'Success Delete Feature');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-items/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-items/${itemId}`);
    }
  },
  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body;
    try {
      const item = await Item.findOne({ _id: itemId });
      if (!req.file) {
        req.flash('alertMessage', `Image not found`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-items/${itemId}`);
      }
      const activity = await Activity.create({
        name,
        type,
        imageUrl: `images/${req.file.filename}`,
        itemId: itemId,
      });
      item.activityId.push({ _id: activity._id });
      await item.save();
      req.flash('alertMessage', 'Success Add Activity');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-items/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-items/${itemId}`);
    }
  },
  editActivity: async (req, res) => {
    const { id, name, type, itemId } = req.body;
    try {
      const activity = await Activity.findOne({ _id: id });
      if (req.file == undefined) {
        activity.name = name;
        activity.type = type;
        await activity.save();
      } else {
        await fs.unlink(path.join(`public/images/${activity.imageUrl}`));
        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`;
        await activity.save();
      }
      req.flash('alertMessage', 'Success Edit Activity');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-items/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-items/${itemId}`);
    }
  },
  deleteActivity: async (req, res) => {
    const { itemId, id } = req.params;
    try {
      const activity = await Activity.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId });
      for (let i = 0; i < item.activityId.length; i++) {
        if (item.activityId[i] == activity.id) {
          item.activityId.pull({ _id: activity._id });
          await item.save();
        }
        await fs.unlink(path.join(`public/images/${activity.imageUrl}`));
        await activity.remove();
        req.flash('alertMessage', 'Success Delete Activity');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-items/${itemId}`);
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-items/${itemId}`);
    }
  },
  booking: async (req, res) => {
    try {
      const booking = await Booking.find()
        .sort({ date: -1 })
        .populate('memberId')
        .populate('bankId');
      res.render('admin/booking', {
        title: 'Staycation | Booking',
        user: req.session.user,
        booking,
      });
    } catch (error) {
      res.redirect('/admin/booking');
    }
  },
  bookingDetail: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id })
        .populate('memberId')
        .populate('bankId');

      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/Booking/detail_booking', {
        title: 'Staycation | Detail Booking',
        booking,
        user: req.session.user,
        alert,
      });
    } catch (error) {
      res.redirect('/admin/booking');
    }
  },
  actionAccept: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = 'Accept';
      await booking.save();
      req.flash('alertMessage', 'Success Accept Booking');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/booking/${id}`);
    }
  },
  actionReject: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = 'Reject';
      await booking.save();
      req.flash('alertMessage', 'Success Reject Booking');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/booking/${id}`);
    }
  },
};
