import { AxiosMasterLoggerType } from "axios-master";
export declare function parseErr(error: unknown): string;
export declare const logAxios: (enabled: boolean, name: string) => (data: AxiosMasterLoggerType) => void;
export declare const host: {
    STAGING: "https://qrservice.tdbmlabs.mn";
    PROD: "https://qrservice.tdb.mn";
};
export declare const config: {
    username: string;
    password: string;
    terminalId: string;
    /** TDB банкны RTGS BIC код. Ихэвчлэн "TDBMNUB" */
    bankCode: string;
    host: string;
    token: string;
    logger: boolean;
};
/** QR code-оос Happy Wallet deeplink үүсгэх */
export declare const deeplink: (qrcode: string) => string;
declare const _default: {
    auth: {
        LOGIN: (body: {
            host: "PROD" | "STAGING";
            username: string;
            password: string;
            terminalId: string;
            bankCode?: string;
        }) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
    invoice: {
        CREATE: (body: {
            qrType: "dynamic" | "static";
            transactionType: 2 | 1 | 3;
            amount?: number;
            curCode?: string;
            accountNumber?: string;
            additional?: {
                phoneNumber?: string;
                loyaltyNumber?: string;
                referenceLabel?: string;
                storeLabel?: string;
                purposeTransaction?: string;
                customerLabel?: string;
                callbackUrl?: string;
            };
        }) => Promise<{
            success: boolean;
            message: string;
            data?: {
                qrcode: string;
                qrImage: string;
                invoiceNo: number;
                deeplink: string;
                miniAppDeeplinkUrl: string;
                type: number;
            };
        }>;
        GET: (invoiceNo: string | number) => Promise<{
            success: boolean;
            message: string;
            data?: {
                invoiceNo: number;
                amount: number;
                curCode: string;
                paymentId: number;
                terminalId: string;
                status: "failed" | "new" | "expired" | "paid" | "cancelled";
                txnDesc: string;
                callbackUrl: string;
                createDate: string;
                expireDate: string;
                qr: string;
                merchantName: string;
                paymentType: string;
            };
        }>;
        LIST: (params?: {
            terminalId?: string;
            startDate?: string;
            endDate?: string;
        }) => Promise<{
            success: boolean;
            message: string;
            data?: {
                invoiceNo: number;
                amount: number;
                curCode: string;
                paymentId: number;
                terminalId: string;
                status: "failed" | "new" | "expired" | "paid" | "cancelled";
                txnDesc: string;
                callbackUrl: string;
                createDate: string;
                expireDate: string;
                qr: string;
                merchantName: string;
                paymentType: string;
            }[];
        }>;
        CANCEL: (invoiceNo: string | number) => Promise<{
            success: boolean;
            message: string;
            data?: {
                invoiceNo: number;
                amount: number;
                curCode: string;
                paymentId: number;
                terminalId: string;
                status: "failed" | "new" | "expired" | "paid" | "cancelled";
                txnDesc: string;
                callbackUrl: string;
                createDate: string;
                expireDate: string;
                qr: string;
                merchantName: string;
                paymentType: string;
            };
        }>;
    };
    payment: {
        REVERSE: (body: {
            invoiceNo: string | number;
            terminalId?: string;
            amount: number;
        }) => Promise<{
            success: boolean;
            message: string;
            data?: {
                type: number;
                qrcode: string;
                qrImage: string;
                invoiceNo: number;
            };
        }>;
    };
};
export default _default;
export { default as invoice } from "./invoice";
export { default as payment } from "./payment";
