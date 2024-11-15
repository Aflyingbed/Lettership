const cloudinary = require("cloudinary");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function getTransformations(mimeType) {
  if (mimeType === "image/gif") {
    return [{ width: 110, height: 110, crop: "fill", quality: "auto" }];
  }
  if (
    mimeType === "image/png" ||
    mimeType === "image/jpeg" ||
    mimeType === "image/jpg"
  ) {
    return [
      {
        width: 110,
        height: 110,
        crop: "fill",
        gravity: "face",
        quality: "auto",
      },
    ];
  }
  throw new Error("Please upload an image file (JPEG, PNG, or GIF)");
}

async function uploadPicture(file) {
  const mimeType = file.mimetype;
  const transformations = getTransformations(mimeType);

  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${mimeType};base64,${b64}`;

  const result = await cloudinary.v2.uploader.upload(dataURI, {
    folder: "members_profile_pictures",
    transformation: transformations,
  });

  return result.secure_url;
}

function checkAndPushImageErrors(image) {
  const imageErrors = [];

  const validMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
  if (!validMimeTypes.includes(image.mimetype)) {
    imageErrors.push({
      msg: "Please upload an image file (JPEG, PNG, or GIF)",
      path: "profilePicture",
    });
  }

  if (image.size > 10 * 1024 * 1024) {
    imageErrors.push({
      msg: "File size exceeds 10 MB limit",
      path: "profilePicture",
    });
  }

  return imageErrors;
}

module.exports = {
  uploadPicture,
  checkAndPushImageErrors,
};
