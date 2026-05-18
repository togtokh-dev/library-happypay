# DIGI PAY

<!-- ![Alt text](https://developer.qpay.mn/intro.png) -->

## Example

```bash
    import happypay from "@togtokh.dev/happypay";

    happypay.auth
    .TOKEN({
      host: "staging",
      client_id: "",
      client_secret: "",
      merchantId: "",
      merchantName: "",
      terminalId: "",
    })
    .then(async (r) => {
      console.log(r);
      const invoice = await happypay.invoice.CREATE({
        amount: 100,
        webHookUrl: "https://looktv.mn/home",
      });
      console.log(invoice);
      if (invoice.data?.invoiceId) {
        const info = await happypay.invoice.INFO(invoice.data?.invoiceId);
        console.log(info);
      }
    })
    .catch((e) => {
      console.log(e);
    });


```
