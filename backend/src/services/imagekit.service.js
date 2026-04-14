import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export async function uploadImage(fileBuffer, fileName) {
    const response = await imagekit.upload({
        file: fileBuffer,          // Buffer from multer memoryStorage
        fileName: fileName,        // e.g. "chat-image-12345.jpg"
        folder: "/chat-images",    // organizes uploads in ImageKit dashboard
    });
    return response.url;           // ← was missing! always returned undefined before
}
export default imagekit;