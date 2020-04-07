const constants = {};
constants.SYSTEM_USER_ID = 1;
/**
 * Color Constants.
 * @type {string}
 */
constants.COLOR_RED = "\x1b[31m";
constants.COLOR_GREEN = "\x1b[32m";

/**
 * Logging File Details.
 */
constants.LOG_FILE_NAME = 'pnc-logs.logs';

/**
 * Date Format.
 */
constants.DATE_FORMAT = "YYYY-MM-DD";
constants.DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
constants.TIME_ZONE = "Asia/Kolkata";

/**
 * Validation strings.
 */
constants.EMAIL_REGEX = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
   + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
constants.PASSWORD_REGEX = "(?=^.{6,16}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])" +
   "(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?&gt;.&lt;,])(?!.*\\s).*$";
constants.PHONE_NUMBER_PREFIX = "+91";
constants.DATE_REGEX = "[0-9]{4}-[0-9]{2}-[0-9]{2}";

/**
 * Header Data.
 */
constants.HEADERS = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
   'Access-Control-Max-Age': 2592000,
   'Access-Control-Allow-Headers': 'Content-Type,access-control-allow-origin,X-Requested-With'
};
constants.CONTENT_TYPE_TEXT = "Content-Type";
constants.CONTENT_TYPE_JSON = "application/json";

/**
 * Constants for Role Details.
 */
constants.ROLE_ADMIN = "Admin";
constants.ROLE_EMPLOYEE = "Employee";

/**
 * Request Keys.
 */
constants.API_TOKEN_KEY = "key";
constants.API_REQUEST_KEY = "request_Key";
constants.REQUEST_TYPE = "type";
/**
 * Status Values
 */
constants.STATUS_PROCESSING = 1;
constants.STATUS_COMPLETED = 2;
constants.STATUS_ERROR = 3;
constants.STATUS_PENDING = 4;
constants.STATUS_CONFIRM = 6;
constants.STATUS_REJECTED = 7;
constants.STATUS_AUTHORIZED = 8;
constants.STATUS_CAPTURED = 9;
constants.STAUTS_REFUNDED = 10;
constants.STATUS_CANCEL = 11;

/**
 * API Methods.
 */
constants.HTTP_POST = "post";
constants.HTTP_GET = "get";
constants.HTTP_PUT = "put";
constants.HTTP_OPTIONS = "options";

/**
 * Response Codes and messages.
 */
constants.BAD_REQUEST_CODE = 400;
constants.HTTP_NOT_FOUND_CODE = 404;
constants.FORBIDDEN_REQUEST_CODE = 403;
constants.INTERNAL_SERVER_ERROR_CODE = 500;
constants.HTTP_SUCCESS = 200;
constants.HTTP_ACCEPTED_OKAY = 201;
constants.HTTP_UNAUTHORIZED_CODE = 401;

constants.RESPONSE_KEY = "res";
constants.ERROR_MESSAGE = "Error";
constants.USER_DATA = "user_data";
constants.JW_TOKEN = "jw_token";
constants.BAD_REQUEST_MESSAGE = "Incorrect Request";
constants.FORBIDDEN_MESSAGE = "Incorrect Token or token expired.";
constants.INSUFFICIENT_DATA_MESSAGE = "Insufficient Data";
constants.INVALID_METHOD_MESSAGE = "Invalid Method";
constants.INVALID_PATH = "Invalid Path";
constants.INTERNAL_SERVER_ERROR_MESSAGE = "Internal Server Error";
constants.RESPONSE_KEY_ERROR = "error";
constants.RESPONSE_SUCESS_LEVEL_1 = "1";
constants.RESPONSE_SUCCESS_LEVEL_2 = "2";
constants.ERROR_LEVEL_KEY = "error_level";
constants.ERROR_LEVEL_1 = "1";
constants.ERROR_LEVEL_2 = "2";
constants.ERROR_LEVEL_3 = "3";
constants.ERROR_LEVEL_4 = "4";
/**
 * Messages.
 */
constants.WELCOME_MESSAGE = "Welcome to Petcoset API.";
constants.OTP_MESSAGE = "Your Petcoset OTP is: ";

/**
 * Core-Service Keys
 */
constants.CORE_SERVICE_USER_NAME = "user_name";
constants.CORE_SERVICE_PASSWORD = "password";
constants.CORE_CUSTOMER_CREATE = "Create";
constants.ENCRYPTION_KEY_KEY = "ENCRYPTED_KEY";
constants.DB_HOST_KEY = "DB_HOST";
constants.DB_PASSWORD_KEY = "DB_PASSWORD";
constants.CORE_RESPONSE = "res";
constants.CORE_ERROR = "error";
constants.CORE_ERROR_LEVEL = "errorLevel";
constants.CORE_SUCCESS_LEVEL = "successLevel";
constants.CORE_TYPE = "type";
constants.CORE_DATA = "data";
constants.CORE_TOKEN = "jwToken_auth";

/**
 * Core services Module Keys
 */
constants.CORE_CUSTOMER_CREATE = "createCustomer";
constants.CORE_CUSTOMER_GET = "getCustomer";
constants.CORE_CUSTOMER_UPDATE = "updateCustomer";
constants.CORE_API_TOKEN_CHECK = "checkApiToken";
constants.CORE_API_LOG = "logAPIStatus";
constants.CORE_VENDOR_CREATE = "createVendor";
constants.CORE_VENDOR_GET = "getVendor";
constants.CORE_CREATE_SERVICE = "createService";
constants.CORE_GET_SERVICE = "getService";
constants.CORE_AUTH_CHECK = "authCheck";
constants.CORE_AUTH_OTP_REQEUST = "reqOTP";
constants.CORE_AUTH_OTP_VALIDATE = "checkOTP";
constants.CORE_SUBCRIPTION_CREATE = "subscriptionCreate";
constants.CORE_SUBCRIPTION_SEARCH = "subscriptionSearch";
constants.CORE_BOOKING_CREATE_SUBS_SERVICE = "createBooking";
constants.CORE_BOOKING_SUBSCRIPTION = "createSubscription";
constants.CORE_BOOKING_SERVICE = "createServiceBooking";
constants.CORE_BOOKING_SEARCH = "searchBooking";
/**
 * SP Names.
 */
constants.SP_CREATE_CUSTOMER = "sp_CustomerRegistration";
constants.SP_GET_CUSTOMER = "sp_CustomerSearch";
constants.SP_CHECK_API_TOKEN = "sp_checkApiToken";
constants.SP_LOG_API_STATUS = "sp_LogApiStatus";
constants.SP_CREATE_VENDOR = "sp_VendorRegistration";
constants.SP_GET_VENDOR = "sp_VendorSearch";
constants.SP_SERVICE_REGISTRATION = "sp_ServicesRegistration";
constants.SP_SERVICE_SEARCH = "sp_SearchServices";
constants.SP_LOGIN = "sp_LoginGeneric";
constants.SP_SUBSCRIPTION_REGISTRATION = "sp_SubscriptionRegistration";
constants.SP_SUBSCRIPTION_SEARCH = "sp_SearchSubscription";
constants.SP_BOOKING_SUBS_SERVICE = "sp_SubscriptionServiceBooking";
constants.SP_SUBSCRIPTION_BOOKING = "sp_SubscriptionServiceBookingOnly";
constants.SP_PAYMENT_CREATE = "sp_PaymentUpdateInsert";
constants.SP_OTP = "sp_OtpCreateCheck";

/**
 * General Keys
 */
constants.RAZOR_PAY_ID = "key_id";
constants.RAZOR_PAY_SECRET = "key_secret";
constants.AWS_KEY_ID = "accessKeyId";
constants.AWS_SECRET_KEY = "secretAccessKey";

/**
 * Column Names
 */
constants.COLUMN_CREATED_BY = "created_by";
constants.COLUMN_CREATED = "created";
constants.COLUMN_MODIFIED_BY = "modified_by";
constants.COLUMN_MODIFIED = "modified";
constants.EMPLOYEE_ID = "employee_id";

constants.CUSTOMER_ID = "customer_id";
constants.CUSTOMER_FIRST_NAME = "first_name";
constants.CUSTOMER_LAST_NAME = "last_name";
constants.CUSTOMER_EMAIL = "email";
constants.CUSTOMER_PASSWORD = "password";
constants.CUSTOMER_PHONE_NUMBER = "phone_number";
constants.CUSTOMER_GENDER = "gender";
constants.CUSTOMER_ADDRESS_1 = "address_1";
constants.CUSTOMER_ADDRESS_2 = "address_2";
constants.CUSTOMER_CITY = "city";
constants.CUSTOMER_STATE = "state";
constants.CUSTOMER_COUNTRY = "country";
constants.CUSTOMER_PINCODE = "pincode";
constants.CUSTOMER_REFERAL_CODE = "referral_code";
constants.CUSTOMER_USED_REFERAL_CODE = "used_referral_code";
constants.IS_VALID = "isValid";
constants.OTP = "otp";

constants.VENDOR_ID = "vendor_id";
constants.VENDOR_FIRST_NAME = "first_name";
constants.VENDOR_LAST_NAME = "last_name";
constants.VENDOR_EMAIL = "email";
constants.VENDOR_PHONE_NUMBER = "phone_number";
constants.VENDOR_GENDER = "gender";
constants.VENDOR_ADDRESS_1 = "address_1";
constants.VENDOR_ADDRESS_2 = "address_2";
constants.VENDOR_CITY = "city";
constants.VENDOR_STATE = "state";
constants.VENDOR_COUNTRY = "country";
constants.VENDOR_PINCODE = "pincode";

constants.DOCUMENT_HOLDER_ID = "document_holder_id";
constants.DOCUMENT_HOLDER_TYPE = "document_holder_type";
constants.DOCUMENT_TYPE = "document_type";
constants.DOCUMENT_ID_NUMBER = "document_id_number";

constants.API_PATH = "path";
constants.API_LOGGER_TOKEN = "api_token";
constants.API_LOGGER_RESPONSE_CODE = "response_code";
constants.API_LOGGER_STATUS = "api_status";

constants.SERVICE_NAME = "service_name";
constants.SERVICE_ID = "service_id";
constants.SERVICE_TYPE = "service_type";

constants.AUTH_EMAIL = "email_id";
constants.AUTH_PASSWORD = "password";

constants.SUBSCRIPTION_NAME = "subscription_name";
constants.SUBSCRIPTION_AMOUNT = "subscription_amount";
constants.SUBSCRIPTION_START_DATE = "start_date";
constants.SUBSCRIPTION_END_DATE = "end_date";
constants.SUBSCRIPTION_SERVICE_DETAILS = "service_details";
constants.SUBSCRIPTION_PRICE_START = "price_start";
constants.SUBSCRIPTION_PRICE_END = "price_end";

constants.BOOKING_ID = "booking_id";
constants.BOOKING_TYPE_SERVICE = "service_booking";
constants.BOOKING_TYPE_SUBSCRIPTION = "subscription_booking";
constants.BOOKING_TYPE_SUBSCRIPTION_SERVICE = "subscription_service_booking";
constants.BOOKING_TYPE = "booking_type";
constants.BOOKING_CUSTOMER_ID = "customer_id";
constants.BOOKING_SUBSCRIPTION_ID = "subscription_id";
constants.BOOKING_SERVICE_ID = "service_id";
constants.BOOKING_EMPLOYEE_ID = "employee_id";
constants.BOOKING_VENDOR_ID = "vendor_id";
constants.BOOKING_TOTAL_AMOUNT = "total_amount";

constants.PAYMENT_BOOKING_ID = "booking_id";
constants.PAYMENT_TRANSACTION_ID = "transaction_id";
constants.PAYMENT_AMOUNT = "payment_amount";
constants.PAYMENT_STATUS_ID = "payment_status_id";


/**
 * exporting the constants.
 */
module.exports = constants;
