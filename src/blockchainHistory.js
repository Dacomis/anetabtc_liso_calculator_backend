const { BlockFrostAPI } = require("@blockfrost/blockfrost-js");
const { get } = require("./configEnv.js");

const API = new BlockFrostAPI({
  projectId: get("BLOCK_FROST_API_KEY"),
});

// for current ADA Staked and anetaBTC Delegators graphs
async function getPoolsHistory() {
  const poolIds = get("POOLS_IDS").split(",");

  const pools = await Promise.all(
    poolIds.map((id) => API.poolsByIdHistory(id, { order: "desc" }))
  );

  const [firstPool, ...otherPools] = pools;
  const otherPoolsDictionary = otherPools.map((p) => {
    return p.reduce((prev, cur) => {
      prev[cur.epoch] = cur;
      return prev;
    }, {});
  });

  const result = firstPool.map((e) => {
    const data = {
      epoch: e.epoch,
      active_stake: Number(e.active_stake),
      delegators_count: e.delegators_count,
    };

    otherPoolsDictionary.forEach((p) => {
      const e = p[data.epoch];
      data.active_stake += Number(e.active_stake);
      data.delegators_count += e.delegators_count;
    });

    return data;
  });

  let reversedResult = [...result].reverse();
  return reversedResult;
}

async function getAllAngels(policyID) {
  const angels = await Promise.resolve(API.assetsPolicyByIdAll(policyID)).then(
    (res) => res.filter((angel) => angel.asset)
  );

  console.log(angels);
  return angels;
}

async function getAllAddressesFromStakeAddress(stakeAddress) {
  const addresses = await Promise.resolve(API.accountsAddresses(stakeAddress));

  console.log(addresses);
  return addresses;
}

async function getAssetTransactions(asset) {
  const transactions = await Promise.resolve(API.assetsTransactions(asset));

  console.log(transactions);
  return transactions;
}

async function getDelegatorsHistory(stakeAddress) {
  const poolIds = get("POOLS_IDS").split(",");
  const delegatorHistory = await Promise.resolve(
    API.accountsHistoryAll(stakeAddress)
  );

  const filteredDelegatorHistoryByPool = delegatorHistory.filter((elem) =>
    poolIds.includes(elem.pool_id)
  );

  return filteredDelegatorHistoryByPool;
}

exports.getPoolsHistory = getPoolsHistory;
exports.getAllAngels = getAllAngels;
exports.getAllAddressesFromStakeAddress = getAllAddressesFromStakeAddress;
exports.getAssetTransactions = getAssetTransactions;
exports.getDelegatorsHistory = getDelegatorsHistory;
