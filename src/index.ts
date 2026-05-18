import { AxiosMasterLoggerType } from "axios-master";
import auth from "./auth";
import invoice from "./invoice";
import payment from "./payment";

export function parseErr(error: unknown): string {
  if (typeof error === "string" && error.trim()) return error;

  if (typeof error === "object" && error !== null) {
    const err = error as any;

    if (typeof err.response === "object" && err.response !== null) {
      const data = err.response.data;
      if (typeof data === "string" && data.trim()) return data;
      if (typeof data === "object" && data !== null) {
        return (
          data.msg ||
          data.message ||
          data.error ||
          data.error_description ||
          JSON.stringify(data)
        );
      }
      return `HTTP ${err.response.status ?? "error"}`;
    }

    if (err.code === "ECONNABORTED") return "Request timed out";
    if (err.code === "ERR_NETWORK" || err.message === "Network Error")
      return "Network error";

    if (typeof err.message === "string" && err.message.trim())
      return err.message;
  }

  return "Unexpected error";
}

export const logAxios =
  (enabled: boolean, name: string) => (data: AxiosMasterLoggerType) => {
    if (!enabled) return;
    console.log(
      `[${name}]`,
      JSON.stringify(
        {
          time: data?.json?.time,
          request: data?.json?.request,
          response: `${data?.json?.response ?? ""}`,
          responseBody: data?.json?.responseBody,
          statusCode: data?.json?.statusCode
        },
        null,
        2
      )
    );
  };

export const host: {
  STAGING: "https://qrservice.tdbmlabs.mn";
  PROD: "https://qrservice.tdb.mn";
} = {
  STAGING: "https://qrservice.tdbmlabs.mn",
  PROD: "https://qrservice.tdb.mn"
};

export const config: {
  username: string;
  password: string;
  terminalId: string;
  /** TDB банкны RTGS BIC код. Ихэвчлэн "TDBMNUB" */
  bankCode: string;
  host: string;
  token: string;
  logger: boolean;
} = {
  username: "",
  password: "",
  terminalId: "",
  bankCode: "TDBMNUB",
  host: "https://qrservice.tdbmlabs.mn",
  token: "",
  logger: true
};

/** QR code-оос Happy Wallet deeplink үүсгэх */
export const deeplink = (qrcode: string): string =>
  `tdbwalletTest://qrcode?data=${encodeURIComponent(qrcode)}`;

export default { auth, invoice, payment };
export { default as invoice } from "./invoice";
export { default as payment } from "./payment";
