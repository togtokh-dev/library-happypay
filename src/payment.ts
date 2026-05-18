import { axiosMasterMain } from "axios-master";
import { config, parseErr } from "./";
import { getToken } from "./auth";

type TDBRes<T> = { success: boolean; msg: string; data: T };

type ReverseResDataT = {
  type: number;
  qrcode: string;
  qrImage: string;
  invoiceNo: number | null;
};

/**
 * Буцаалтын гүйлгээ — төлөгдсөн нэхэмжлэхийн дүнг буцаана.
 * invoiceNo, terminalId, amount шаардлагатай.
 */
const REVERSE = async (body: {
  /** Буцаалт хийх нэхэмжлэхийн дугаар */
  invoiceNo: number | string;
  /** Терминал дугаар (config.terminalId-г default болгоно) */
  terminalId?: string;
  /** Буцаалт хийх дүн */
  amount: number;
}): Promise<{
  /** Хүсэлт амжилттай эсэх */
  success: boolean;
  /** Алдааны мэдэгдэл эсвэл "success" */
  message: string;
  data?: ReverseResDataT;
}> => {
  try {
    const res: TDBRes<ReverseResDataT> = await axiosMasterMain(
      {
        method: "POST",
        url: `${config.host}/api/v1/payment/cancel`,
        data: {
          invoiceNo: body.invoiceNo,
          terminalId: body.terminalId ?? config.terminalId,
          amount: body.amount
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
        name: "HAPPYPAY REVERSE",
        timeout: 20000,
        logger() {}
      }
    );

    if (res.success) {
      return { success: true, message: "success", data: res.data };
    }
    return { success: false, message: res.msg || "Reverse failed" };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

export default { REVERSE };
