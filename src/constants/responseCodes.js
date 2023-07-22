const responseCodes = Object.freeze({
  OK: {
    message: "عملیات موفقیت آمیز بود",
    status: 200,
  },
  CREATED: {
    message: "عملیات موفقیت آمیز بود",
    status: 201,
  },
  EMPTY_INPUT_BODY: {
    message: "دیتای ورودی نامعتبر است",
    status: 400,
  },
  JSON_SYNTAX_ERROR: {
    message: "دیتای ورودی نامعتبر است",
    devMessage: "JSON syntax error",
    status: 400,
  },
  INVALID_ID_PARAM: {
    // message: "",
    devMessage: "invalid id param",
    status: 400,
  },
  ACCESS_TOKEN_REQUIRED: {
    message: "عدم احراز هویت",
    // devMessage: "access token required",
    status: 401,
  },
  ACCESS_TOKEN_INVALID: {
    message: "عدم احراز هویت",
    // devMessage: "access token invalid",
    status: 401,
  },
  ACCESS_TOKEN_EXPIRED: {
    message: "عدم احراز هویت",
    // devMessage: "access token expired",
    status: 401,
  },
  LOGIN_FAILED: {
    message: "ورود ناموفق",
    devMessage: "username or password is incorrect",
    status: 401,
  },
  USER_NOT_FOUND: {
    message: "کاربری با این مشخصات یافت نشد",
    status: 404,
  },
  EMAIL_ALREADY_EXISTS: {
    message: "ایمیل وارد شده قبلا ثبت شده است",
    status: 409,
  },
  PAYLOAD_TOO_LARGE: {
    message: "خطا ۴۱۳",
    devMessage: "payload too large",
    status: 413,
  },
  INPUT_DATA_INVALID: {
    message: "دیتای ورودی نامعتبر است",
    status: 422,
  },
  DATABASE_ERROR: {
    message: "خطای پایگاه داده",
    status: 500,
  },
  SERVER_ERROR: {
    message: "خطای سرور",
    status: 500,
  },
  ROUTE_NOT_IMPLEMENTED: {
    message: "مسیر پیاده سازی نشده است",
    devMessage: "route not implemented",
    status: 501,
  },
});

module.exports = responseCodes;
