import DIGIPAY from "../src/index";

DIGIPAY.auth
  .TOKEN({
    host: "staging",
    client_id: "9jG3ONOXmAad1PUy49R1U7LJ1on7oT5U",
    client_secret: "rhCaKrXOoj2GmKpy",
    merchantId: "000000010010122",
    merchantName: "Panda test",
    terminalId: "KP002400",
  })
  .then(async (r) => {
    console.log(r);
    const invoice = await DIGIPAY.invoice.CREATE({
      amount: 100,
      webHookUrl: "https://looktv.mn/home",
    });
    console.log(invoice);
    if (invoice.data?.invoiceId) {
      const info = await DIGIPAY.invoice.INFO(invoice.data?.invoiceId);
      console.log(info);
    }
  })
  .catch((e) => {
    console.log(e);
  });
