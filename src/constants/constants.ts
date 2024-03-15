export const DATABASE = {
    db_name: "VideoApp" as string,
    uri: process.env.MONGODB_URI as string,
};

export const CLOUDINARY = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    apiSecret: process.env.CLOUDINARY_API_SECRET as string,
};

export const TOKEN = {
    secret: process.env.TOKEN_SECRET as string,
    expiresIn: process.env.TOKEN_SECRET_EXPIRY as string,
};
