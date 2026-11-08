import { AxiosMasterLoggerType } from "axios-master";
export declare function parseErr(error: unknown): string;
export declare const logAxios: (enabled: boolean, name: string) => (data: AxiosMasterLoggerType) => void;
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
            host: string;
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
            transactionType: 1 | 2 | 3;
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
                invoiceNo: number | null;
                deeplink: string;
                miniAppDeeplinkUrl: string;
                type: number;
            };
        }>;
        GET: (invoiceNo: number | string) => Promise<{
            success: boolean;
            message: string;
            data?: {
                invoiceNo: number;
                amount: number;
                curCode: string;
                paymentId: number | null;
                terminalId: string;
                status: "new" | "paid" | "failed" | "cancelled" | "expired";
                txnDesc: string | null;
                callbackUrl: string | null;
                createDate: string;
                expireDate: string;
                qr: string | null;
                merchantName: string;
                paymentType: string | null;
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
                paymentId: number | null;
                terminalId: string;
                status: "new" | "paid" | "failed" | "cancelled" | "expired";
                txnDesc: string | null;
                callbackUrl: string | null;
                createDate: string;
                expireDate: string;
                qr: string | null;
                merchantName: string;
                paymentType: string | null;
            }[];
        }>;
        CANCEL: (invoiceNo: number | string) => Promise<{
            success: boolean;
            message: string;
            data?: {
                invoiceNo: number;
                amount: number;
                curCode: string;
                paymentId: number | null;
                terminalId: string;
                status: "new" | "paid" | "failed" | "cancelled" | "expired";
                txnDesc: string | null;
                callbackUrl: string | null;
                createDate: string;
                expireDate: string;
                qr: string | null;
                merchantName: string;
                paymentType: string | null;
            };
        }>;
    };
    payment: {
        REVERSE: (body: {
            invoiceNo: number | string;
            terminalId?: string;
            amount: number;
        }) => Promise<{
            success: boolean;
            message: string;
            data?: {
                type: number;
                qrcode: string;
                qrImage: string;
                invoiceNo: number | null;
            };
        }>;
    };
};
export default _default;
export { default as invoice } from "./invoice";
export { default as payment } from "./payment";
