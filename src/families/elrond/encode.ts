import { SubAccount } from "../../types";
import type { Transaction } from "./types";

export class ElrondEncodeTransaction {
  static ESDTTransfer(t: Transaction, ta: SubAccount): string {
    const tokenIdentifierHex = ta.id.split("/")[2];
    let amountHex = t.amount.toString(16);

    //hex amount length must be even so protocol would treat it as an ESDT transfer
    if (amountHex.length % 2 !== 0) {
      amountHex = "0" + amountHex;
    }

    return Buffer.from(
      `ESDTTransfer@${tokenIdentifierHex}@${amountHex}`
    ).toString("base64");
  }

  static delegate(): string {
    return Buffer.from(`delegate`).toString("base64");
  }
}
