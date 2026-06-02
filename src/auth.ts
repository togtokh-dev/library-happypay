import axios from "axios";
import { axiosMasterMain } from "axios-master";
import { config, logAxios, parseErr } from "./";

type LoginResT = {
  success: boolean;
  msg: string;
  data: { token: string };
};

/**
 * HappyPay (TDB) эхлүүлэх — JWT token авч config-д хадгална.
 * Бүх дараагийн хүсэлтүүдийн өмнө нэг удаа дуудах шаардлагатай.
 */
const LOGIN = async (body: {
  host: string;
  /** Банкнаас олгосон нэвтрэх нэр */
  username: string;
  /** Банкнаас олгосон нэвтрэх нууц үг */
  password: string;
  /** Бүртгүүлсэн terminal ID */
  terminalId: string;
  /** TDB банкны RTGS BIC код (default: "TDBMNUB") */
  bankCode?: string;
}): Promise<{
  /** Хүсэлт амжилттай эсэх */
  success: boolean;
  /** Алдааны мэдэгдэл эсвэл "SUCCESS" */
  message: string;
}> => {
  try {
    config.host = body.host;
    config.username = body.username;
    config.password = body.password;
    config.terminalId = body.terminalId;
    if (body.bankCode) config.bankCode = body.bankCode;

    const res: LoginResT = await axiosMasterMain(
      {
        method: "POST",
        url: `${config.host}/api/v1/login`,
        data: { username: body.username, password: body.password },
        headers: { "Content-Type": "application/json" }
      },
      {
        name: "HAPPYPAY LOGIN",
        timeout: 20000,
        logger: logAxios(config.logger, "HAPPYPAY LOGIN")
      }
    );

    if (res.success && res.data?.token) {
      config.token = res.data.token;
      return { success: true, message: "SUCCESS" };
    }
    return { success: false, message: res.msg || "Login failed" };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

/** 401 хариу ирэх үед axios-master дотроос шинэ token авахад ашиглах refresh функц */
export const getToken = async (): Promise<string> => {
  try {
    const res = await axios.post<LoginResT>(
      `${config.host}/api/v1/login`,
      { username: config.username, password: config.password },
      { headers: { "Content-Type": "application/json" } }
    );
    const token = res.data?.data?.token;
    if (token) config.token = token;
    return token ?? "";
  } catch {
    return "";
  }
};

export default { LOGIN };
