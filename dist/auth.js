"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const axios_1 = require("axios");
const axios_master_1 = require("axios-master");
const _1 = require("./");
/**
 * HappyPay (TDB) эхлүүлэх — JWT token авч config-д хадгална.
 * Бүх дараагийн хүсэлтүүдийн өмнө нэг удаа дуудах шаардлагатай.
 */
const LOGIN = async (body) => {
    var _a;
    try {
        _1.config.host = _1.host[body.host];
        _1.config.username = body.username;
        _1.config.password = body.password;
        _1.config.terminalId = body.terminalId;
        if (body.bankCode)
            _1.config.bankCode = body.bankCode;
        const res = await (0, axios_master_1.axiosMasterMain)({
            method: "POST",
            url: `${_1.config.host}/api/v1/login`,
            data: { username: body.username, password: body.password },
            headers: { "Content-Type": "application/json" }
        }, {
            name: "HAPPYPAY LOGIN",
            timeout: 20000,
            logger: (0, _1.logAxios)(_1.config.logger, "HAPPYPAY LOGIN")
        });
        if (res.success && ((_a = res.data) === null || _a === void 0 ? void 0 : _a.token)) {
            _1.config.token = res.data.token;
            return { success: true, message: "SUCCESS" };
        }
        return { success: false, message: res.msg || "Login failed" };
    }
    catch (error) {
        return { success: false, message: (0, _1.parseErr)(error) };
    }
};
/** 401 хариу ирэх үед axios-master дотроос шинэ token авахад ашиглах refresh функц */
const getToken = async () => {
    var _a, _b;
    try {
        const res = await axios_1.default.post(`${_1.config.host}/api/v1/login`, { username: _1.config.username, password: _1.config.password }, { headers: { "Content-Type": "application/json" } });
        const token = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.token;
        if (token)
            _1.config.token = token;
        return token !== null && token !== void 0 ? token : "";
    }
    catch (_c) {
        return "";
    }
};
exports.getToken = getToken;
exports.default = { LOGIN };
