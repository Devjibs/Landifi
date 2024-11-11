export default () => ({
  secrets: {
    jwtSecret: process.env.JWT_SECRET,
  },
  emailAuth: {
    host: process.env.EMAIL_HOST,
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
});
