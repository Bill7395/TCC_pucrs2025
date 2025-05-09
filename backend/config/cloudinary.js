const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'doojyevce',
  api_key: '829865847351115',
  api_secret: 'C2Go7IPnLgOM67yDwyP2U1N255c'
});

module.exports = cloudinary;