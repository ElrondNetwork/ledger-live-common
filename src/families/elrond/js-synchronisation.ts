import type { Account } from "../../types";
import { encodeAccountId } from "../../account";
import type { GetAccountShape } from "../../bridge/jsHelpers";
import { makeSync, makeScanAccounts, mergeOps } from "../../bridge/jsHelpers";
import { getAccount, getOperations } from "./api";

const getAccountShape: GetAccountShape = async (info) => {
  const { address, initialAccount, currency, derivationMode } = info;
  const accountId = encodeAccountId({
    type: "js",
    version: "2",
    currencyId: currency.id,
    xpubOrAddress: address,
    derivationMode,
  });
  const oldOperations = initialAccount?.operations || [];
  let lastOperationTimestamp = 0;
  if (oldOperations.length) {
    lastOperationTimestamp = Math.floor(oldOperations[0].date.getTime() / 1000);
  }
  const startAt = lastOperationTimestamp + 1;

  // get the current account balance state depending your api implementation
  const { blockHeight, balance, nonce } = await getAccount(address);
  // Merge new operations with the previously synced ones
  const newOperations = await getOperations(accountId, address, startAt);
  const operations = mergeOps(oldOperations, newOperations);
  const shape = {
    id: accountId,
    balance,
    spendableBalance: balance,
    operationsCount: operations.length,
    blockHeight,
    elrondResources: {
      nonce,
    },
  };

  return { ...shape, operations };
};

const postSync = (initial: Account, parent: Account) => parent;

export const scanAccounts = makeScanAccounts(getAccountShape);
export const sync = makeSync(getAccountShape, postSync);
