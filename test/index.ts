import HAPPYPAY, { deeplink } from "../src/index";

HAPPYPAY.auth
  .LOGIN({
    host: "STAGING",
    username: "your_username",
    password: "your_password",
    terminalId: "91200026",
  })
  .then(async (auth) => {
    console.log("LOGIN:", auth);
    if (!auth.success) return;

    // QR нэхэмжлэх үүсгэх
    const invoice = await HAPPYPAY.invoice.CREATE({
      qrType: "dynamic",
      transactionType: 1,
      amount: 1000,
      curCode: "MNT",
      additional: {
        purposeTransaction: "Test payment",
        callbackUrl: "https://yourdomain.mn/callback",
      },
    });
    console.log("CREATE:", invoice);

    if (invoice.data?.qrcode) {
      // Deeplink үүсгэх
      const link = deeplink(invoice.data.qrcode);
      console.log("DEEPLINK:", link);
    }

    if (invoice.data?.invoiceNo) {
      // Нэхэмжлэх мэдээлэл авах
      const info = await HAPPYPAY.invoice.GET(invoice.data.invoiceNo);
      console.log("GET:", info);

      // Нэхэмжлэхийн жагсаалт
      const list = await HAPPYPAY.invoice.LIST({
        terminalId: "91200026",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
      });
      console.log("LIST:", list);

      // Нэхэмжлэх цуцлах (төлөгдөөгүй үед)
      // const cancelled = await HAPPYPAY.invoice.CANCEL(invoice.data.invoiceNo);
      // console.log("CANCEL:", cancelled);

      // Буцаалтын гүйлгээ (төлөгдсөн үед)
      // const reversed = await HAPPYPAY.payment.REVERSE({
      //   invoiceNo: invoice.data.invoiceNo,
      //   amount: 1000,
      // });
      // console.log("REVERSE:", reversed);
    }
  })
  .catch((e) => {
    console.log(e);
  });
