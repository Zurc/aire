require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const PORT = process.env.PORT || 8080
const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_PASS = process.env.GMAIL_PASS

// init app
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const path = require('path');
const router = express.Router();

// home route
app.get('/', (req, res) => {
	res.render('index');
});

// POST route from contact form
app.post('/contact', function (req, res) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS
    }
	});
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: GMAIL_USER,
    subject: 'New message from contact form at tylerkrys.ca',
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
	};
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
			console.log(error);
      res.render('contact-failure');
    }
    else {
			res.render('contact-success');
    }
  });
});

// store all static files in the public directory
app.use(express.static(__dirname + '/public'));

app.use('/', router);
// start server
app.listen(PORT, () => {
	console.log('App listening on port 8080');
})