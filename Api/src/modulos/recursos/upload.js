const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const configureMulter = (destinationDirectory) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/${destinationDirectory}/`);
        },
        filename: (req, file, cb) => {
            const uniqueIdentifier = uuidv4();
            const fileExtension = file.originalname.split('.').pop();
            const randomNumber = Math.floor(Math.random() * 1000000);
            const filename = `${Date.now()}-${uniqueIdentifier}-${randomNumber}.${fileExtension}`;
            cb(null, filename);
        }
    });

    const fileFilter = (req, file, cb) => {
        cb(null, file.mimetype.startsWith('image/'));
    };

    const upload = multer({ storage, fileFilter });

    return upload;
};

module.exports = configureMulter;
