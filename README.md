# HappyPay

HappyPay payment-gateway client for Node.js & TypeScript — QR invoices, Happy Wallet deeplinks and payment/invoice status checks against Trade & Development Bank (TDB) of Mongolia.

## Install

```bash
npm i @togtokh.dev/happypay
```

## Features

- Terminal **login / authentication** (`auth.LOGIN`), with automatic token handling.
- **QR invoice creation** — dynamic or static QR, for purchase / transfer / payment transactions (`invoice.CREATE`).
- **Happy Wallet deeplink** builder from a QR string (`deeplink`).
- **Invoice status check** — look up a single invoice, list invoices by date range (`invoice.GET`, `invoice.LIST`).
- **Invoice cancel** and **payment reversal / refund** (`invoice.CANCEL`, `payment.REVERSE`).
- Fully typed responses — every call resolves to `{ success, message, data? }`.
- Shared mutable `config` for credentials, plus `logAxios` / `parseErr` helpers.

## Quick start

```ts
import HAPPYPAY, { deeplink } from "@togtokh.dev/happypay";

async function main() {
  // 1. Authenticate the terminal
  await HAPPYPAY.auth.LOGIN({
    host: "STAGING", // environment key or base URL
    username: "YOUR_USERNAME",
    password: "YOUR_PASSWORD",
    terminalId: "00000000",
    bankCode: "TDBMNUB", // optional, defaults to "TDBMNUB"
  });

  // 2. Create a dynamic QR invoice
  const invoice = await HAPPYPAY.invoice.CREATE({
    qrType: "dynamic",
    transactionType: 1, // 1: Purchase, 2: Transfer, 3: Payment
    amount: 1000,
    curCode: "MNT",
    additional: {
      purposeTransaction: "Order #1234",
      callbackUrl: "https://example.mn/webhook",
    },
  });

  if (invoice.success && invoice.data) {
    // 3. Build a Happy Wallet deeplink from the raw QR string
    const link = deeplink(invoice.data.qrcode);
    console.log("QR image:", invoice.data.qrImage); // base64 PNG
    console.log("Deeplink:", link);

    // 4. Check payment / invoice status
    const status = await HAPPYPAY.invoice.GET(invoice.data.invoiceNo!);
    console.log("Status:", status.data?.status); // e.g. "paid"
  }
}

main();
```

## API

The default export groups the client into `auth`, `invoice` and `payment` namespaces. `deeplink`, `config`, `parseErr` and `logAxios` are named exports.

```ts
import HAPPYPAY, { deeplink, config, parseErr, logAxios } from "@togtokh.dev/happypay";
```

### `auth`

#### `auth.LOGIN(body)`

Authenticates a terminal and stores the resulting token/credentials in `config`.

```ts
auth.LOGIN(body: {
  host: string;         // environment key or base URL
  username: string;     // bank-issued username
  password: string;     // bank-issued password
  terminalId: string;   // registered terminal ID
  bankCode?: string;    // RTGS BIC code, defaults to "TDBMNUB"
}): Promise<{ success: boolean; message: string }>
```

### `invoice`

#### `invoice.CREATE(body)`

Creates a QR invoice.

```ts
invoice.CREATE(body: {
  qrType: "dynamic" | "static"; // "dynamic" when amount is known, "static" otherwise
  transactionType: 1 | 2 | 3;   // 1: Purchase, 2: Transfer, 3: Payment
  amount?: number;              // required for "dynamic"
  curCode?: string;             // e.g. "MNT"
  accountNumber?: string;       // receiving account for transactionType 2
  additional?: {
    phoneNumber?: string;
    loyaltyNumber?: string;
    referenceLabel?: string;
    storeLabel?: string;
    purposeTransaction?: string;
    customerLabel?: string;
    callbackUrl?: string;       // called by TDB on successful payment
  };
}): Promise<{
  success: boolean;
  message: string;
  data?: {
    qrcode: string;             // raw QR text
    qrImage: string;            // base64 PNG (data:image/png;base64,...)
    invoiceNo: number | null;
    deeplink: string;
    miniAppDeeplinkUrl: string;
    type: number;
  };
}>
```

#### `invoice.GET(invoiceNo)`

Fetches a single invoice, including its payment status.

```ts
invoice.GET(invoiceNo: string | number): Promise<{
  success: boolean;
  message: string;
  data?: Invoice;
}>
```

#### `invoice.LIST(params?)`

Lists invoices, optionally filtered by terminal and date range.

```ts
invoice.LIST(params?: {
  terminalId?: string;
  startDate?: string; // "2025-07-04" or "2025-07-04T09:48:36"
  endDate?: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: Invoice[];
}>
```

#### `invoice.CANCEL(invoiceNo)`

Cancels an unpaid invoice.

```ts
invoice.CANCEL(invoiceNo: string | number): Promise<{
  success: boolean;
  message: string;
  data?: Invoice;
}>
```

The `Invoice` object returned by `GET`, `LIST` and `CANCEL`:

```ts
type Invoice = {
  invoiceNo: number;
  amount: number;
  curCode: string;
  paymentId: number | null;
  terminalId: string;
  status: "new" | "paid" | "failed" | "cancelled" | "expired";
  txnDesc: string | null;
  callbackUrl: string | null;
  createDate: string;
  expireDate: string;
  qr: string | null;
  merchantName: string;
  paymentType: string | null;
};
```

### `payment`

#### `payment.REVERSE(body)`

Reverses (refunds) a paid invoice.

```ts
payment.REVERSE(body: {
  invoiceNo: string | number;
  terminalId?: string; // defaults to config.terminalId
  amount: number;
}): Promise<{
  success: boolean;
  message: string;
  data?: {
    type: number;
    qrcode: string;
    qrImage: string;
    invoiceNo: number | null;
  };
}>
```

### Helpers

#### `deeplink(qrcode)`

Builds a Happy Wallet deeplink from a raw QR string.

```ts
deeplink(qrcode: string): string
```

#### `config`

Shared, mutable credential/configuration object. Populated by `auth.LOGIN`, and may be read or set directly.

```ts
config: {
  username: string;
  password: string;
  terminalId: string;
  bankCode: string; // RTGS BIC code, usually "TDBMNUB"
  host: string;
  token: string;
  logger: boolean;  // enable request/response logging
};
```

#### `parseErr(error)`

Normalizes an unknown thrown value into a readable error message string.

```ts
parseErr(error: unknown): string
```

#### `logAxios(enabled, name)`

Returns an `axios-master` logger callback, used internally for request/response logging.

```ts
logAxios(enabled: boolean, name: string): (data: AxiosMasterLoggerType) => void
```

## Response

Every method resolves to a consistent shape:

```ts
Promise<{
  success: boolean;  // whether the request succeeded
  message: string;   // "success"/"SUCCESS" or an error message
  data?: ...;        // method-specific payload, present on success
}>
```

Methods never throw on API errors — inspect `success` and `message` instead.

## License

ISC
