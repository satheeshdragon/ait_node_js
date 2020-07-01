const mongoose = require('mongoose');


const customerSchema = new mongoose.Schema({
	customer_name:{
		type      : String,
		required  : true,
	},
	phone:{
		type      : String,
		required  : true,
	},
	email:{
		type      : String,
		required  : true,
	},
	address:{
		type      : String,
		required  : true,
	},
},{
	timestamps:true,
});

module.exports = Customer = mongoose.model('Customer',customerSchema);