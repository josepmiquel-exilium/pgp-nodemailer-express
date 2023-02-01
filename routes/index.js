const router = require('express').Router();

const emailController = require('../controllers/emailController');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/contactform', emailController.contactForm);

module.exports = router;
