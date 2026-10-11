import "dotenv/config";

const config = {
  port: process.env.PORT || 5000,
  app_url: process.env.APP_URL || "http://localhost:5000",
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 10,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || "access_secret",
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "refresh_secret",
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  stripe_secret_key: process.env.STRIPE_SECRET_KEY || "",
  stripe_product_id: process.env.STRIPE_PRODUCT_ID || "",
  stripe_product_price_id: process.env.STRIPE_PRODUCT_PRICE_ID || "",
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET || "",
};

export default config;
