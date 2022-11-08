const express = require("express");
const apicache = require("apicache");
const getPoolsHistory = require("./src/blockchainHistory.js").getPoolsHistory;
const getAllAngels = require("./src/blockchainHistory.js").getAllAngels;
const getAllAddressesFromStakeAddress =
  require("./src/blockchainHistory.js").getAllAddressesFromStakeAddress;
const getAssetTransactions =
  require("./src/blockchainHistory.js").getAssetTransactions;
const getDelegatorsHistory =
  require("./src/blockchainHistory.js").getDelegatorsHistory;

const app = express(); // notice that the app instance is called `app`, this is very important.
let cache = apicache.middleware;

app.get("/", (req, res) => {
  res.send("Hello World! 2");
});

app.get(
  "/history",
  // TODO uncomment this
  cache("5 minutes"),
  async (req, res, next) => {
    try {
      console.log(`try`);
      const history = await getPoolsHistory();
      res.send(history);
    } catch (error) {
      console.log(error);
      next(new Error("Error on getting the pools history"));
    }
  }
);

app.get(
  "/delegatorHistory/:stakeAddress",
  // TODO uncomment this
  cache("5 minutes"),
  async (req, res, next) => {
    try {
      const delegatorHistory = await getDelegatorsHistory(
        req.params.stakeAddress
      );
      res.send(delegatorHistory);
    } catch (error) {
      console.log(error);
      next(new Error("Error on getting the delegator's history"));
    }
  }
);

// const angelsPolicyID = "af267bd857e9d78fdb5fa05e91a342907518e30b0211cdf2b9c7cd00";
app.get("/policyID/:policyID", async (req, res, next) => {
  try {
    const angels = await getAllAngels(req.params.policyID);
    res.send(angels);
  } catch (error) {
    console.log(error);
    next(new Error("Error on getting the Angels"));
  }
});

app.get("/stakeAddress/:stakeAddress", async (req, res, next) => {
  try {
    const addresses = await getAllAddressesFromStakeAddress(
      req.params.stakeAddress
    );
    res.send(addresses);
  } catch (error) {
    console.log(error);
    next(new Error("Error on getting the Addresses from the Stake Address"));
  }
});

// no need for `app.listen()` on Deta, we run the app automatically.
module.exports = app; // make sure to export your `app` instance.
