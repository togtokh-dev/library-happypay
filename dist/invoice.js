"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_master_1 = require("axios-master");
const _1 = require("./");
const auth_1 = require("./auth");
/** QR нэхэмжлэх үүсгэх — QR зураг болон deeplink-д шаардлагатай qrcode буцаана */
const CREATE = async (body) => {
    var _a, _b, _c;
    try {
        const res = await (0, axios_master_1.axiosMasterMain)({
            method: "POST",
            url: `${_1.config.host}/api/v1/invoice`,
            data: {
                qrType: body.qrType,
                transactionType: body.transactionType,
                qrGenerator: "TDBM",
                accountNumber: (_a = body.accountNumber) !== null && _a !== void 0 ? _a : "",
                amount: body.amount,
                bankCode: _1.config.bankCode,
                curCode: (_b = body.curCode) !== null && _b !== void 0 ? _b : "MNT",
                terminalId: _1.config.terminalId,
                additional: body.additional
            },
            headers: {
                Authorization: `Bearer ${_1.config.token}`,
                "Content-Type": "application/json"
            }
        }, {
            shouldRetry: true,
            shouldRetryStatus: [401],
            retryFunction: auth_1.getToken,
            name: "HAPPYPAY CREATE",
            timeout: 20000,
            logger: (0, _1.logAxios)(_1.config.logger, "HAPPYPAY CREATE")
        });
        if (res.success && ((_c = res.data) === null || _c === void 0 ? void 0 : _c.qrcode)) {
            return { success: true, message: "success", data: res.data };
        }
        return { success: false, message: res.msg || "Failed to create invoice" };
    }
    catch (error) {
        return { success: false, message: (0, _1.parseErr)(error) };
    }
};
/** Нэхэмжлэхийн төлөв болон дэлгэрэнгүй мэдээллийг invoiceNo-р лавлах */
const GET = async (invoiceNo) => {
    var _a;
    try {
        const res = await (0, axios_master_1.axiosMasterMain)({
            method: "GET",
            url: `${_1.config.host}/api/v1/invoice/${invoiceNo}`,
            headers: {
                Authorization: `Bearer ${_1.config.token}`,
                "Content-Type": "application/json"
            }
        }, {
            shouldRetry: true,
            shouldRetryStatus: [401],
            retryFunction: auth_1.getToken,
            name: "HAPPYPAY GET",
            timeout: 20000,
            logger: (0, _1.logAxios)(_1.config.logger, "HAPPYPAY GET")
        });
        if (res.success && ((_a = res.data) === null || _a === void 0 ? void 0 : _a.invoice)) {
            return { success: true, message: "success", data: res.data.invoice };
        }
        return { success: false, message: res.msg || "Invoice not found" };
    }
    catch (error) {
        return { success: false, message: (0, _1.parseErr)(error) };
    }
};
/** Нэхэмжлэхийн жагсаалт авах — terminalId, огноогоор шүүх боломжтой */
const LIST = async (params) => {
    var _a;
    try {
        const query = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.terminalId)
            query.set("terminalId", params.terminalId);
        if (params === null || params === void 0 ? void 0 : params.startDate)
            query.set("startDate", params.startDate);
        if (params === null || params === void 0 ? void 0 : params.endDate)
            query.set("endDate", params.endDate);
        const res = await (0, axios_master_1.axiosMasterMain)({
            method: "GET",
            url: `${_1.config.host}/api/v1/invoice?${query.toString()}`,
            headers: {
                Authorization: `Bearer ${_1.config.token}`,
                "Content-Type": "application/json"
            }
        }, {
            shouldRetry: true,
            shouldRetryStatus: [401],
            retryFunction: auth_1.getToken,
            name: "HAPPYPAY LIST",
            timeout: 20000,
            logger() { }
        });
        if (res.success) {
            return { success: true, message: "success", data: (_a = res.data) !== null && _a !== void 0 ? _a : [] };
        }
        return { success: false, message: res.msg || "Failed to fetch list" };
    }
    catch (error) {
        return { success: false, message: (0, _1.parseErr)(error) };
    }
};
/** Үүсгэсэн нэхэмжлэх цуцлах (төлөгдөөгүй байх ёстой) */
const CANCEL = async (invoiceNo) => {
    var _a;
    try {
        const res = await (0, axios_master_1.axiosMasterMain)({
            method: "POST",
            url: `${_1.config.host}/api/v1/invoice/${invoiceNo}/cancel`,
            headers: {
                Authorization: `Bearer ${_1.config.token}`,
                "Content-Type": "application/json"
            }
        }, {
            shouldRetry: true,
            shouldRetryStatus: [401],
            retryFunction: auth_1.getToken,
            name: "HAPPYPAY CANCEL INVOICE",
            timeout: 20000,
            logger() { }
        });
        if (res.success && ((_a = res.data) === null || _a === void 0 ? void 0 : _a.invoice)) {
            return { success: true, message: "success", data: res.data.invoice };
        }
        return { success: false, message: res.msg || "Failed to cancel invoice" };
    }
    catch (error) {
        return { success: false, message: (0, _1.parseErr)(error) };
    }
};
exports.default = { CREATE, GET, LIST, CANCEL };
