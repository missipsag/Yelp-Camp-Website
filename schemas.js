const Joi = require("joi");



module.exports.campgroundSchema =  Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(), 
  reivews : Joi.array()
}).required();

module.exports.reviewSchema = Joi.object({
  
    
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
 
  
}).required()