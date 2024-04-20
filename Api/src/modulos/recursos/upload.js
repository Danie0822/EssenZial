// upload.js
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const configureMulter = (destinationDirectory) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${destinationDirectory}/`);
        },
        filename: function (req, file, cb) {
            const uniqueIdentifier = uuidv4();
            const fileExtension = file.originalname.split('.').pop();
            const randomNumber = Math.floor(Math.random() * 1000000); 
            const filename = Date.now() + '-' + uniqueIdentifier + '-' + randomNumber + '.' + fileExtension;
            cb(null, filename);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    };

    const upload = multer({ storage: storage, fileFilter: fileFilter });

    return upload;
};

module.exports = configureMulter;
