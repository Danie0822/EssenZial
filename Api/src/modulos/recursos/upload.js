const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Importar la función uuidv4 de la biblioteca uuid

// Configuración de multer para guardar archivos de imagen
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueIdentifier = uuidv4();
        const fileExtension = file.originalname.split('.').pop();
        const filename = Date.now() + '-' + uniqueIdentifier + '.' + fileExtension;
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

module.exports = upload;
