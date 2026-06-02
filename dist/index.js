"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payment = exports.invoice = exports.deeplink = exports.config = exports.logAxios = exports.parseErr = void 0;
const auth_1 = require("./auth");
const invoice_1 = require("./invoice");
const payment_1 = require("./payment");
function parseErr(error) {
    var _a;
    if (typeof error === "string" && error.trim())
        return error;
    if (typeof error === "object" && error !== null) {
        const err = error;
        if (typeof err.response === "object" && err.response !== null) {
            const data = err.response.data;
            if (typeof data === "string" && data.trim())
                return data;
            if (typeof data === "object" && data !== null) {
                return (data.msg ||
                    data.message ||
                    data.error ||
                    data.error_description ||
                    JSON.stringify(data));
            }
            return `HTTP ${(_a = err.response.status) !== null && _a !== void 0 ? _a : "error"}`;
        }
        if (err.code === "ECONNABORTED")
            return "Request timed out";
        if (err.code === "ERR_NETWORK" || err.message === "Network Error")
            return "Network error";
        if (typeof err.message === "string" && err.message.trim())
            return err.message;
    }
    return "Unexpected error";
}
exports.parseErr = parseErr;
const logAxios = (enabled, name) => (data) => {
    var _a, _b, _c, _d, _e, _f;
    if (!enabled)
        return;
    console.log(`[${name}]`, JSON.stringify({
        time: (_a = data === null || data === void 0 ? void 0 : data.json) === null || _a === void 0 ? void 0 : _a.time,
        request: (_b = data === null || data === void 0 ? void 0 : data.json) === null || _b === void 0 ? void 0 : _b.request,
        response: `${(_d = (_c = data === null || data === void 0 ? void 0 : data.json) === null || _c === void 0 ? void 0 : _c.response) !== null && _d !== void 0 ? _d : ""}`,
        responseBody: (_e = data === null || data === void 0 ? void 0 : data.json) === null || _e === void 0 ? void 0 : _e.responseBody,
        statusCode: (_f = data === null || data === void 0 ? void 0 : data.json) === null || _f === void 0 ? void 0 : _f.statusCode
    }, null, 2));
};
exports.logAxios = logAxios;
exports.config = {
    username: "",
    password: "",
    terminalId: "",
    bankCode: "TDBMNUB",
    host: "https://qrservice.tdbmlabs.mn",
    token: "",
    logger: true
};
/** QR code-оос Happy Wallet deeplink үүсгэх */
const deeplink = (qrcode) => `tdbwalletTest://qrcode?data=${encodeURIComponent(qrcode)}`;
exports.deeplink = deeplink;
exports.default = { auth: auth_1.default, invoice: invoice_1.default, payment: payment_1.default };
var invoice_2 = require("./invoice");
Object.defineProperty(exports, "invoice", { enumerable: true, get: function () { return invoice_2.default; } });
var payment_2 = require("./payment");
Object.defineProperty(exports, "payment", { enumerable: true, get: function () { return payment_2.default; } });
