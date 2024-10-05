export default () => ({
  secrets: {
    jwtSecret: process.env.JWT_SECRET,
  },
  emailAuth: {
    host: process.env.EMAIL_HOST,
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
});
