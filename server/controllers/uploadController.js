const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const AppError = require('../utils/AppError');

// @desc    Upload image
// @route   POST /api/upload/image
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a file.', 400));
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'learnai/images',
      resource_type: 'image',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Upload video
// @route   POST /api/upload/video
exports.uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a file.', 400));
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'learnai/videos',
      resource_type: 'video',
      chunk_size: 6000000, // 6MB chunks for large files
    });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
    });
  } catch (error) {
    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};
