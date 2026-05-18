import { axiosMasterMain } from "axios-master";
import { config, parseErr } from "./";
import { getToken } from "./auth";

type TDBRes<T> = { success: boolean; msg: string; data: T };

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

/** QR нэхэмжлэх үүсгэх — QR зураг болон deeplink-д шаардлагатай qrcode буцаана */
const CREATE = async (
  body: CreateBodyT
): Promise<{
  /** Хүсэлт амжилттай эсэх */
  success: boolean;
  /** Алдааны мэдэгдэл эсвэл "success" */
  message: string;
  /** qrcode (raw), qrImage (base64), invoiceNo агуулсан объект */
  data?: CreateResDataT;
}> => {
  try {
    const res: TDBRes<CreateResDataT> = await axiosMasterMain(
      {
        method: "POST",
        url: `${config.host}/api/v1/invoice`,
        data: {
          qrType: body.qrType,
          transactionType: body.transactionType,
          qrGenerator: "TDBM",
          accountNumber: body.accountNumber ?? "",
          amount: body.amount,
          bankCode: config.bankCode,
          curCode: body.curCode ?? "MNT",
          terminalId: config.terminalId,
          additional: body.additional
        },
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json"
        }
      },
      {
        shouldRetry: true,
        shouldRetryStatus: [401],
        retryFunction: getToken,
        name: "HAPPYPAY CREATE",
        timeout: 20000,
        logger() {}
      }
    );

    if (res.success && res.data?.qrcode) {
      return { success: true, message: "success", data: res.data };
    }
    return { success: false, message: res.msg || "Failed to create invoice" };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

/** Нэхэмжлэхийн төлөв болон дэлгэрэнгүй мэдээллийг invoiceNo-р лавлах */
const GET = async (
  invoiceNo: number | string
): Promise<{
  /** Хүсэлт амжилттай эсэх */
  success: boolean;
  /** Алдааны мэдэгдэл эсвэл "success" */
  message: string;
  /** Нэхэмжлэхийн бүрэн мэдээлэл (status, amount, paymentId гэх мэт) */
  data?: InvoiceT;
}> => {
  try {
    const res: TDBRes<{ invoice: InvoiceT }> = await axiosMasterMain(
      {
        method: "GET",
        url: `${config.host}/api/v1/invoice/${invoiceNo}`,
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json"
        }
      },
      {
        shouldRetry: true,
        shouldRetryStatus: [401],
        retryFunction: getToken,
        name: "HAPPYPAY GET",
        timeout: 20000,
        logger() {}
      }
    );

    if (res.success && res.data?.invoice) {
      return { success: true, message: "success", data: res.data.invoice };
    }
    return { success: false, message: res.msg || "Invoice not found" };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

/** Нэхэмжлэхийн жагсаалт авах — terminalId, огноогоор шүүх боломжтой */
const LIST = async (params?: {
  terminalId?: string;
  /** ISO эсвэл энгийн формат: "2025-07-04" эсвэл "2025-07-04T09:48:36" */
  startDate?: string;
  /** ISO эсвэл энгийн формат: "2025-07-04" эсвэл "2025-07-04T09:48:36" */
  endDate?: string;
}): Promise<{
  /** Хүсэлт амжилттай эсэх */
  success: boolean;
  /** Алдааны мэдэгдэл эсвэл "success" */
  message: string;
  /** Нэхэмжлэхийн массив */
  data?: InvoiceT[];
}> => {
  try {
    const query = new URLSearchParams();
    if (params?.terminalId) query.set("terminalId", params.terminalId);
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);

    const res: TDBRes<InvoiceT[]> = await axiosMasterMain(
      {
        method: "GET",
        url: `${config.host}/api/v1/invoice?${query.toString()}`,
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json"
        }
      },
      {
        shouldRetry: true,
        shouldRetryStatus: [401],
        retryFunction: getToken,
        name: "HAPPYPAY LIST",
        timeout: 20000,
        logger() {}
      }
    );

    if (res.success) {
      return { success: true, message: "success", data: res.data ?? [] };
    }
    return { success: false, message: res.msg || "Failed to fetch list" };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

/** Үүсгэсэн нэхэмжлэх цуцлах (төлөгдөөгүй байх ёстой) */
const CANCEL = async (
  invoiceNo: number | string
): Promise<{
  /** Хүсэлт амжилттай эсэх */
  success: boolean;
  /** Алдааны мэдэгдэл эсвэл "success" */
  message: string;
  /** Цуцлагдсан нэхэмжлэхийн мэдээлэл */
  data?: InvoiceT;
}> => {
  try {
    const res: TDBRes<{ invoice: InvoiceT }> = await axiosMasterMain(
      {
        method: "POST",
        url: `${config.host}/api/v1/invoice/${invoiceNo}/cancel`,
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json"
        }
      },
      {
        shouldRetry: true,
        shouldRetryStatus: [401],
        retryFunction: getToken,
        name: "HAPPYPAY CANCEL INVOICE",
        timeout: 20000,
        logger() {}
      }
    );

    if (res.success && res.data?.invoice) {
      return { success: true, message: "success", data: res.data.invoice };
    }
    return { success: false, message: res.msg || "Failed to cancel invoice" };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

export default { CREATE, GET, LIST, CANCEL };
