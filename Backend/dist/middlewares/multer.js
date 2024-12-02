import { v4 as uuid } from "uuid";
import multer from "multer";
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        const id = uuid();
        const extName = file.originalname.split(".").pop();
        const fileName = `${id}.${extName}`;
        callback(null, fileName);
    },
});
export const singleUpload = multer({ storage }).single("photo");
