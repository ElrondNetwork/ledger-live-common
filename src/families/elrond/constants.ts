import BigNumber from "bignumber.js";

export const HASH_TRANSACTION = {
  version: 2,
  options: 1,
};
export const METACHAIN_SHARD = 4294967295;
export const MAX_PAGINATION_SIZE = 10000;
export const GAS = {
  ESDT_TRANSFER: 500000,
  DELEGATE: 12000000,
};
export const CHAIN_ID = "1";
export const MIN_DELEGATION_AMOUNT: BigNumber = new BigNumber(1);
