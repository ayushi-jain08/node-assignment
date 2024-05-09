import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.NAME,
    api_key: process.env.KEY,
    api_secret: process.env.SECRET,
});

export default cloudinary