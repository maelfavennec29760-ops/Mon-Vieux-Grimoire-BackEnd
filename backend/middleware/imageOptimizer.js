const sharp = require('sharp')
const fs = require('fs').promises

exports.optimizeBookImage = async (req, res, next) => {
    try {
        if(!req.file){
            return next();
        }
        const imagePath = req.file.path
        const imageName = req.file.filename.substring(0, req.file.filename.lastIndexOf('.'));
        const newImageName = `${imageName}.webp`
        const newImagePath = `${req.file.destination}/${newImageName}`

        await sharp(imagePath).resize({width: 600}).webp().toFile(newImagePath)
        await fs.unlink(req.file.path); 
        req.file.filename = newImageName
        next()
    }
    catch (error) {
        res.status(500).json({ message: "Image optimization failed", error })
    }
}   