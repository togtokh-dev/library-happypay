type ReverseResDataT = {
    type: number;
    qrcode: string;
    qrImage: string;
    invoiceNo: number | null;
};
declare const _default: {
    REVERSE: (body: {
        /** Буцаалт хийх нэхэмжлэхийн дугаар */
        invoiceNo: number | string;
        /** Терминал дугаар (config.terminalId-г default болгоно) */
        terminalId?: string;
        /** Буцаалт хийх дүн */
        amount: number;
    }) => Promise<{
        /** Хүсэлт амжилттай эсэх */
        success: boolean;
        /** Алдааны мэдэгдэл эсвэл "success" */
        message: string;
        data?: ReverseResDataT;
    }>;
};
export default _default;
