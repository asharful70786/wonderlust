const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//accessing the cloudinary account
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})

//cloudinay ar which folder a file store hba
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust-dev',
      alloweredFormats : ["png" , "jpg" , "pdf" , "jpeg"],  //format allowed
    },
  });

module.exports = {cloudinary , storage}  ;