import { v2 as cloudinary, ConfigOptions, UploadApiOptions } from 'cloudinary'

const CLOUDINARY_CONFIG: ConfigOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}

const CLOUDINARY_OPTIONS: UploadApiOptions = {
  folder: process.env.CLOUDINARY_FOLDER,
  resource_type: 'raw',
  format: 'txt',
  use_filename: true,
  unique_filename: false,
}

cloudinary.config(CLOUDINARY_CONFIG)

export const uploadFile = (file: string) => {
  cloudinary.uploader.upload(file, CLOUDINARY_OPTIONS, (err, result) => {
    if (err) {
      return Promise.reject()
    }

    return Promise.resolve(result)
  })
}
