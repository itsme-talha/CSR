const express = require('express');
const multer = require('multer');
// Yahan humne 'submitDonation' aur 'myDonations' import kiye hain
const { submitDonation, getMyDonations } = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Image save karne ke liye Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// POST route: Donor ki nai donation banane ke liye (multer ke sath)
router.post('/', protect, authorize('DONOR'), upload.single('receipt'), submitDonation);

// GET route: Donor ki apni purani donations dekhne ke liye
router.get('/my-donations', protect, authorize('DONOR'), getMyDonations);

router.get('/my-history', protect, authorize('DONOR'), getMyDonations);

module.exports = router;