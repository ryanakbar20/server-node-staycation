const Traveler = require('../models/Member');
const Treasure = require('../models/Activity');
const City = require('../models/Item');
const Category = require('../models/Category');
const Member = require('../models/Member');
const Booking = require('../models/Booking');

module.exports = {
  landingPage: async (req, res) => {
    try {
      const traveler = await Traveler.find();
      const treasure = await Treasure.find();
      const city = await City.find();

      const mostPicked = await City.find()
        .select('_id title imageId country city price unit')
        .limit(5)
        .populate({ path: 'imageId', select: '_id imageUrl' })
        .populate({ path: 'categoryId', select: '_id name' });

      const categories = await Category.find()
        .select('_id name itemId')
        .limit(3)
        .populate({
          path: 'itemId',
          select: '_id title imageId country city isPopular sumBooking',
          perDocumentLimit: 4,
          options: { sort: { sumBooking: -1 } },
          populate: {
            path: 'imageId',
            select: '_id imageUrl',
            perDocumentLimit: 1,
          },
        });

      for (let i = 0; i < categories.length; i++) {
        for (let x = 0; x < categories[i].itemId.length; x++) {
          const item = await City.findOne({ _id: categories[i].itemId[x]._id });
          item.isPopular = false;
          await item.save();
          if (categories[i].itemId[0] === categories[i].itemId[x]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      const testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: 'images/testimonial2.jpg',
        name: 'Happy Family',
        rate: 4.55,
        content:
          'What a great trip with my family and I should try again next time soon ...',
        familyName: 'Angga',
        familyOccupation: 'Product Designer',
      };

      res.status(200).json({
        hero: {
          travelers: traveler.length,
          treasures: treasure.length,
          cities: city.length,
        },
        mostPicked,
        categories,
        testimonial,
      });
    } catch (error) {
      console.log(`${error.message}`);
      res.status(500).json('Error Internal Server');
    }
  },
  detailPage: async (req, res) => {
    const { id } = req.params;
    try {
      const item = await City.findOne({ _id: id })
        .populate({ path: 'imageId', select: '_id imageUrl' })
        .populate({ path: 'featureId', select: '_id qty name imageUrl' })
        .populate({ path: 'activityId', select: '_id type name imageUrl' })
        .populate({ path: 'categoryId', select: '_id name' });

      const testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: 'images/testimonial1.jpg',
        name: 'Happy Family',
        rate: 4.55,
        content:
          'What a great trip with my family and I should try again next time soon ...',
        familyName: 'Angga',
        familyOccupation: 'Product Designer',
      };

      res.status(200).json({
        ...item._doc,
        testimonial,
      });
    } catch (error) {
      console.log(`${error.message}`);
      res.status(500).json('Error Internal Server');
    }
  },
  bookingPage: async (req, res) => {
    try {
      const {
        idItem,
        duration,
        // price,
        bookingStartDate,
        bookingEndDate,
        firstName,
        lastName,
        email,
        phoneNumber,
        accountHolder,
        bankFrom,
      } = req.body;

      if (!req.file) {
        res.status(500).json('IMAGE NOT FOUND');
      }

      if (
        idItem === undefined ||
        duration === undefined ||
        // price === undefined ||
        bookingStartDate === undefined ||
        bookingEndDate === undefined ||
        firstName === undefined ||
        lastName === undefined ||
        email === undefined ||
        phoneNumber === undefined ||
        accountHolder === undefined ||
        bankFrom === undefined
      ) {
        res.status(404).json('Lengkapi Semua Field');
      }

      const item = await City.findOne({ _id: idItem });
      item.sumBooking += 1;
      await item.save();

      let total = item.price * duration;
      let tax = total * 0.1;
      let invoice = Math.floor(1000000 + Math.random() * 9000000);

      const member = await Member.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
      });

      const newBooking = {
        bookingStartDate: bookingStartDate,
        bookingEndDate: bookingEndDate,
        invoice,
        date: new Date(),
        itemId: {
          _id: item.id,
          title: item.title,
          price: item.price,
          duration: duration,
        },
        total: (total += tax),
        memberId: member.id,
        payments: {
          proofPayment: `images/${req.file.filename}`,
          bankFrom: bankFrom,
          accountHolder: accountHolder,
        },
      };

      const booking = await Booking.create(newBooking);

      res.status(200).json({ booking });
    } catch (error) {
      console.log(`${error.message}`);
      res.status(500).json(`Error Internal Server ${error.message}`);
    }
  },
};
