"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_master_1 = require("axios-master");
const _1 = require("./");
const auth_1 = require("./auth");
/**
 * Буцаалтын гүйлгээ — төлөгдсөн нэхэмжлэхийн дүнг буцаана.
 * invoiceNo, terminalId, amount шаардлагатай.
 */
const REVERSE = async (body) => {
    var _a;
    try {
        const res = await (0, axios_master_1.axiosMasterMain)({
            method: "POST",
            url: `${_1.config.host}/api/v1/payment/cancel`,
            data: {
                invoiceNo: body.invoiceNo,
                terminalId: (_a = body.terminalId) !== null && _a !== void 0 ? _a : _1.config.terminalId,
                amount: body.amount
            },
            headers: {
                Authorization: `Bearer ${_1.config.token}`,
                "Content-Type": "application/json"
            }
        }, {
            shouldRetry: true,
            shouldRetryStatus: [401],
            retryFunction: auth_1.getToken,
            name: "HAPPYPAY REVERSE",
            timeout: 20000,
            logger() { }
        });
        if (res.success) {
            return { success: true, message: "success", data: res.data };
        }
        return { success: false, message: res.msg || "Reverse failed" };
    }
    catch (error) {
        return { success: false, message: (0, _1.parseErr)(error) };
    }
};
exports.default = { REVERSE };
