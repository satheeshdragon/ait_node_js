const router = require('express').Router();
let Customer = require('../models/customer.model');
const fs = require('fs')
const jwt = require("jsonwebtoken")

router.route('/').get(isAuthorized,(req,res) => {
	Customer.find()
		.then(customer => res.json(customer))
		.catch(err => res.status(400).json('Error: ' +err));
});

router.route('/jwts').get((req,res) => {
	let privateKey = fs.readFileSync('./private.pem', 'utf8');
    let token = jwt.sign({ "body": "stuff" }, privateKey, { algorithm: 'HS256'});
    res.send(token);
});

router.route('/add').post(isAuthorized,(req,res) => {

	const customer_name    = req.body.customer_name;
	const phone            = Number(req.body.phone);
	const email            = req.body.email;
	const address          = req.body.address;

	const newCustomer = new Customer({
		customer_name,
		phone,
		email,
		address,
	});

	newCustomer.save()
		.then(() => res.json('Customer Added'))
		.catch(err => res.status(400).json('Error: ' +err));
});


router.route('/:id').get(isAuthorized,(req,res) => {
	Customer.findById(req.params.id)
		.then(customer => res.json(customer))
		.catch(err => res.status(400).json('Error: ' +err));
});

router.route('/delete/:id').delete(isAuthorized,(req,res) => {
	Customer.findByIdAndDelete(req.params.id)
		.then(() => res.json('Customer Deleted'))
		.catch(err => res.status(400).json('Error: ' +err));
});


router.route('/update/:id').post(isAuthorized,(req,res) => {
	Customer.findById(req.params.id)
		.then(customer => {
			customer.customer_name    = req.body.customer_name;
			customer.phone            = Number(req.body.phone);
			customer.email            = req.body.email;
			customer.address          = req.body.address;

			customer.save()
			 .then(() => res.json('Customer Updated'))
			 .catch(err => res.status(400).json('Error: ' +err));
		}
		)
		.catch(err => res.status(400).json('Error: ' +err));
});


function isAuthorized(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        // retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization.split(" ")[1];
        
        let privateKey = fs.readFileSync('./private.pem', 'utf8');
        // Here we validate that the JSON Web Token is valid and has been 
        // created using the same private pass phrase
        jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
            
            // if there has been an error...
            if (err) {  
                // shut them out!
                res.status(500).json({ error: "Not Authorized" });
            }
            // if the JWT is valid, allow them to hit
            // the intended endpoint
            return next();
        });
    } else {
        // No authorization header exists on the incoming
        // request, return not authorized
        res.status(500).json({ error: "Not Authorized" });
    }
}



module.exports = router;