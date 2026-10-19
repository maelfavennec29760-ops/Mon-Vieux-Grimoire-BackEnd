const sharp = require('sharp');
const path = require('path');

exports.optimizeBookImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }
        const imageName = `${Date.now()}-${path.parse(req.file.originalname).name}.webp`;
        const imagePath = path.join('uploads', 'books', imageName);
        await sharp(req.file.buffer)
            .resize({ width: 600 })
            .webp()
            .toFile(imagePath);
            req.file.filename = imageName;
            next();
        } catch (error) {
         res.status(500).json({ error });
    }
};
