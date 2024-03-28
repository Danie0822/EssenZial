const multer = require('multer');

// Configuración de multer para guardar archivos de imagen
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + '-' + file.originalname;
        const filePath = filename;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    // Aceptar solo archivos de imagen
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
