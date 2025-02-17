const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

//here we define en axtension based on joi.string()
// because joi by default doesn't escape html tags. 
// we must add this in order to prevent XSS attacks 

const extension = (Joi)  => ({
  type: 'string', // this is the type of the extension, meaning it works on string input
  base: Joi.string(), // the base of our extension, we just extend it
  messages: {
   escapeHTML : "{{#label}} must not include html" // this is the message, we display 
  },
  rules: { 
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],  // no html tags are allowed 
          allowedAttributes: {} // no attributes are allowed 
        });
        if (clean !== value) return helpers.error('escapeHTML', { value }); // we check if the sanitized version in the same 
        return clean;                                                       // as the value
        }
      }
    }
})

// here we tell Joi to use our extension 
// we basically extend Joi
const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema =  Joi.object({
  name: Joi.string().required().escapeHTML(),
  location: Joi.string().required().escapeHTML(),
  //image: Joi.string().required(),
  description: Joi.string().required().escapeHTML(),
  price: Joi.number().required(), 
  reivews : Joi.array(),
  deleteImages : Joi.array()
}).required();

module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML()
}).required()