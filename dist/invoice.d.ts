type InvoiceAdditionalT = {
    phoneNumber?: string;
    loyaltyNumber?: string;
    referenceLabel?: string;
    storeLabel?: string;
    purposeTransaction?: string;
    customerLabel?: string;
    /** Төлбөр амжилттай болсон үед TDB-аас дуудагдах URL */
    callbackUrl?: string;
};
type CreateBodyT = {
    /** Дүн тодорхой үед "dynamic", тодорхойгүй үед "static" */
    qrType: "dynamic" | "static";
    /** 1: Purchase, 2: Transfer, 3: Payment */
    transactionType: 1 | 2 | 3;
    /** Гүйлгээний дүн (qrType "dynamic" үед шаардлагатай) */
    amount?: number;
    /** Валютийн код, жишээ: "MNT" */
    curCode?: string;
    /** transactionType 2 үед орлого хүлээн авах дансны дугаар */
    accountNumber?: string;
    additional?: InvoiceAdditionalT;
};
type CreateResDataT = {
    /** QR мэдээлэл raw текст хэлбэрээр */
    qrcode: string;
    /** Base64 PNG зураг (data:image/png;base64,...) */
    qrImage: string;
    invoiceNo: number | null;
    deeplink: string;
    miniAppDeeplinkUrl: string;
    type: number;
};
type InvoiceT = {
    invoiceNo: number;
    amount: number;
    curCode: string;
    paymentId: number | null;
    terminalId: string;
    /** new, paid, failed, cancelled, expired */
    status: "new" | "paid" | "failed" | "cancelled" | "expired";
    txnDesc: string | null;
    callbackUrl: string | null;
    createDate: string;
    expireDate: string;
    qr: string | null;
    merchantName: string;
    paymentType: string | null;
};
declare const _default: {
    CREATE: (body: CreateBodyT) => Promise<{
        /** Хүсэлт амжилттай эсэх */
        success: boolean;
        /** Алдааны мэдэгдэл эсвэл "success" */
        message: string;
        /** qrcode (raw), qrImage (base64), invoiceNo агуулсан объект */
        data?: CreateResDataT;
    }>;
    GET: (invoiceNo: number | string) => Promise<{
        /** Хүсэлт амжилттай эсэх */
        success: boolean;
        /** Алдааны мэдэгдэл эсвэл "success" */
        message: string;
        /** Нэхэмжлэхийн бүрэн мэдээлэл (status, amount, paymentId гэх мэт) */
        data?: InvoiceT;
    }>;
    LIST: (params?: {
        terminalId?: string;
        /** ISO эсвэл энгийн формат: "2025-07-04" эсвэл "2025-07-04T09:48:36" */
        startDate?: string;
        /** ISO эсвэл энгийн формат: "2025-07-04" эсвэл "2025-07-04T09:48:36" */
        endDate?: string;
    }) => Promise<{
        /** Хүсэлт амжилттай эсэх */
        success: boolean;
        /** Алдааны мэдэгдэл эсвэл "success" */
        message: string;
        /** Нэхэмжлэхийн массив */
        data?: InvoiceT[];
    }>;
    CANCEL: (invoiceNo: number | string) => Promise<{
        /** Хүсэлт амжилттай эсэх */
        success: boolean;
        /** Алдааны мэдэгдэл эсвэл "success" */
        message: string;
        /** Цуцлагдсан нэхэмжлэхийн мэдээлэл */
        data?: InvoiceT;
    }>;
};
export default _default;
