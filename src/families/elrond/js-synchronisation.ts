import type { Account, TokenAccount } from "../../types";
import type { GetAccountShape } from "../../bridge/jsHelpers";
import { makeSync, makeScanAccounts, mergeOps } from "../../bridge/jsHelpers";
import { getAccount, getOperations } from "./api";
import elrondBuildESDTTokenAccounts from "./js-buildSubAccounts";

const getAccountShape: GetAccountShape = async (info) => {
  const { id, address, initialAccount, currency } = info;
  const oldOperations = initialAccount?.operations || [];
  // Needed for incremental synchronisation
  const startAt =
    oldOperations.length && oldOperations[0].blockHeight
      ? (new Date(oldOperations[0].date).getTime() / 1000 || 0) + 1
      : 0;
  // get the current account balance state depending your api implementation
  const { blockHeight, balance, nonce } = await getAccount(address);
  // Merge new operations with the previously synced ones
  const newOperations = await getOperations(id, address, startAt);
  const operations = mergeOps(oldOperations, newOperations);
  
  let subAccounts: TokenAccount[] | undefined = [];
  if (nonce) {
    subAccounts = await elrondBuildESDTTokenAccounts({
      currency,
      accountId: id,
      accountAddress: address,
      existingAccount: initialAccount,
      syncConfig: {
        paginationConfig: {}
      }
    });
  }

  const shape = {
    id,
    balance,
    spendableBalance: balance,
    operationsCount: operations.length,
    blockHeight,
    elrondResources: {
      nonce,
    },
    subAccounts,
  };

  return { ...shape, operations };
};

const postSync = (initial: Account, parent: Account) => parent;

export const scanAccounts = makeScanAccounts(getAccountShape);
export const sync = makeSync(getAccountShape, postSync);