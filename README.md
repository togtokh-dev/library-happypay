# @togtokh.dev/happypay

Худалдаа Хөгжлийн Банк (TDB) — HappyPay QR төлбөрийн Node.js/TypeScript library.

## Суулгах

```bash
npm install @togtokh.dev/happypay
```

## Орчин

| Нэр | URL |
|---|---|
| `STAGING` | `https://qrservice.tdbmlabs.mn` |
| `PROD` | `https://qrservice.tdb.mn` |

---

## Хэрэглэх

### 1. Нэвтрэх (LOGIN)

```typescript
import HAPPYPAY from "@togtokh.dev/happypay";

const auth = await HAPPYPAY.auth.LOGIN({
  host: "STAGING",          // "STAGING" | "PROD"
  username: "your_username",
  password: "your_password",
  terminalId: "91200026",
  bankCode: "TDBMNUB",      // заавал биш, default: "TDBMNUB"
});
```

---

### 2. QR нэхэмжлэх үүсгэх (CREATE)

```typescript
const invoice = await HAPPYPAY.invoice.CREATE({
  qrType: "dynamic",          // "dynamic" | "static"
  transactionType: 1,         // 1: Purchase, 2: Transfer, 3: Payment
  amount: 1000,
  curCode: "MNT",
  additional: {
    purposeTransaction: "Захиалгын төлбөр",
    callbackUrl: "https://yourdomain.mn/callback",
  },
});

// invoice.data.qrcode   — QR raw текст
// invoice.data.qrImage  — Base64 PNG зураг
// invoice.data.invoiceNo
```

### Deeplink үүсгэх

```typescript
import HAPPYPAY, { deeplink } from "@togtokh.dev/happypay";

const link = deeplink(invoice.data.qrcode);
// tdbwalletTest://qrcode?data=...
```

---

### 3. Нэхэмжлэх лавлах (GET)

```typescript
const info = await HAPPYPAY.invoice.GET(invoiceNo);

// info.data.status — "new" | "paid" | "failed" | "cancelled" | "expired"
// info.data.amount
// info.data.paymentId
```

---

### 4. Нэхэмжлэхийн жагсаалт (LIST)

```typescript
const list = await HAPPYPAY.invoice.LIST({
  terminalId: "91200026",   // заавал биш
  startDate: "2025-01-01",  // заавал биш
  endDate: "2025-12-31",    // заавал биш
});
```

---

### 5. Нэхэмжлэх цуцлах (CANCEL)

Төлөгдөөгүй нэхэмжлэхийг цуцлахад ашиглана.

```typescript
const cancelled = await HAPPYPAY.invoice.CANCEL(invoiceNo);
// cancelled.data.status === "cancelled"
```

---

### 6. Буцаалтын гүйлгээ (REVERSE)

Төлөгдсөн нэхэмжлэхийн дүнг буцаахад ашиглана.

```typescript
const reversed = await HAPPYPAY.payment.REVERSE({
  invoiceNo: 100000134,
  amount: 1000,
  terminalId: "91200026",  // заавал биш, default: config.terminalId
});
```

---

### 7. Callback (Webhook)

TDB-аас төлбөр амжилттай болсон үед таны `callbackUrl`-руу POST хүсэлт илгээнэ:

```typescript
// POST {callbackUrl}
// Body:
{
  invoiceNo: 100000110,
  status: "paid",       // "paid" | "failed" | "cancelled"
  paymentId: 798555677
}
```

---

## Бүрэн жишээ

```typescript
import HAPPYPAY, { deeplink } from "@togtokh.dev/happypay";

async function main() {
  await HAPPYPAY.auth.LOGIN({
    host: "STAGING",
    username: "your_username",
    password: "your_password",
    terminalId: "91200026",
  });

  const invoice = await HAPPYPAY.invoice.CREATE({
    qrType: "dynamic",
    transactionType: 1,
    amount: 5000,
    curCode: "MNT",
    additional: {
      purposeTransaction: "Захиалга #1234",
      callbackUrl: "https://yourdomain.mn/webhook",
    },
  });

  if (invoice.success && invoice.data) {
    console.log("QR:", invoice.data.qrcode);
    console.log("Deeplink:", deeplink(invoice.data.qrcode));

    // Хэрэглэгч төлсний дараа төлөв шалгах
    const status = await HAPPYPAY.invoice.GET(invoice.data.invoiceNo!);
    console.log("Төлөв:", status.data?.status);
  }
}

main();
```

---

## Холбоо барих

- Техникийн тал: damdinpurev.d@tdbm.mn
- Бизнесийн тал: delgermaa.bya@tdbm.mn
