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

export const tempCoverImage =
    "https://images.unsplash.com/photo-1707343844152-6d33a0bb32c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export const tempAvatar =
    "https://images.unsplash.com/photo-1710432157519-e437027d2e8f?q=80&w=1862&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
