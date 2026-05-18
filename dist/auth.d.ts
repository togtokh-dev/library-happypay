/** 401 хариу ирэх үед axios-master дотроос шинэ token авахад ашиглах refresh функц */
export declare const getToken: () => Promise<string>;
declare const _default: {
    LOGIN: (body: {
        /** "test" = https://qrservice.tdbmlabs.mn, "preprod" = https://preprod-happypay.tdbm.mn */
        host: "PROD" | "STAGING";
        /** Банкнаас олгосон нэвтрэх нэр */
        username: string;
        /** Банкнаас олгосон нэвтрэх нууц үг */
        password: string;
        /** Бүртгүүлсэн terminal ID */
        terminalId: string;
        /** TDB банкны RTGS BIC код (default: "TDBMNUB") */
        bankCode?: string;
    }) => Promise<{
        /** Хүсэлт амжилттай эсэх */
        success: boolean;
        /** Алдааны мэдэгдэл эсвэл "SUCCESS" */
        message: string;
    }>;
};
export default _default;
