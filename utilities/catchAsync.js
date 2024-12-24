// this a function used to handle errors inside asynchronous functions
// it takes a function as a parameter 
// If an error occured then we catch it and call the next middleware

module.exports = function(fn) {
  return ( req, res, next) => {
    fn( req, res, next).catch(next)
  }
}