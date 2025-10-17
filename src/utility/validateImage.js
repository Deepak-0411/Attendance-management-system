import { toast } from "react-toastify";

 const validateImage = (file, maxSizeMB = 3) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const allowedTypes = ["image/jpeg", "image/png", , "image/webp"];

    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    const isValidExtension = allowedExtensions.includes(fileExtension);
    const isValidType = allowedTypes.includes(file.type);
    const isValidSize = file.size / 1024 / 1024 <= maxSizeMB;

    if (!isValidExtension || !isValidType) {
      toast.info(`Only images (${allowedExtensions.join(", ")}) are allowed!`);
      return false;
    }

    if (!isValidSize) {
      toast.info(`Image must be smaller than ${maxSizeMB} MB!`);
      return false;
    }

    return true;
  };

  export default validateImage;