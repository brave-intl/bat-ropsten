const abi = require('ethereumjs-abi')
const fs = require('fs')
const Web3 = require('web3')
const sleep = require('sleep')

const batAbi = JSON.parse(fs.readFileSync('basic-attention-token-crowdsale/contracts/BAToken.abi', 'utf8'))

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
const MyContract = web3.eth.contract(batAbi)

const initializeBatContract = function (userGrowthPoolAddress) {
  const mySenderAddress = web3.eth.accounts[0]
  console.log("unlocking sender")
  console.log(web3.personal.unlockAccount(mySenderAddress, ""))

  console.log("Balance in wei: " + web3.eth.getBalance(web3.eth.accounts[0]))
  console.log("Balance in eth: " + web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]), 'ether'))

  const bytecode = fs.readFileSync('basic-attention-token-crowdsale/contracts/out/BAToken.bin', 'utf8')
  //const gasEstimate = web3.eth.estimateGas({data: bytecode})
  //console.log("Gas estimate: " + gasEstimate)

  const block = web3.eth.blockNumber
  const startBlock = block + 5
  const endBlock = block + 10
  console.log("UGP: " + userGrowthPoolAddress)
  var myContractInstance = MyContract.new([userGrowthPoolAddress], [userGrowthPoolAddress], [startBlock], [endBlock], {data: '0x' + bytecode, gas: 3000000, from: mySenderAddress}, function(err, myContract){
    if(!err) {
       // NOTE: The callback will fire twice!
       // Once the contract has the transactionHash property set and once its deployed on an address.

       // e.g. check tx hash on the first call (transaction send)
       if(!myContract.address) {
           console.log("Transaction hash: " + myContract.transactionHash) // The hash of the transaction, which deploys the contract
       // check address on the second call (contract deployed)
       } else {

           var myEvent = myContract.CreateBAT({fromBlock: 0, toBlock: 'latest'});
           myEvent.watch(function(error, result){
             console.log(result)
           });
      
           console.log("Initialized BAT contract")
           batContractAddr = myContract.address
           console.log("Address: " + batContractAddr) // the contract address
           var myContractInstance = myContract

           console.log("isFinalized: " + myContractInstance.isFinalized.call())
           console.log("ethFundDeposit: " + myContractInstance.ethFundDeposit.call())
           console.log("batFundDeposit: " + myContractInstance.batFundDeposit.call())
           console.log("fundingStartBlock: " + myContractInstance.fundingStartBlock.call())
           console.log("fundingEndBlock: " + myContractInstance.fundingEndBlock.call())

           var events = myContractInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
           events.watch(function(error, result){
             if (!error)
               console.log(result);
           });

           while (web3.eth.blockNumber < endBlock) {
             console.log("sleep 5s, waiting for block " + endBlock)
             sleep.sleep(5)
           }
           myContractInstance.finalize({from: userGrowthPoolAddress, value: 0, gas: 200000})
           console.log("isFinalized: " + myContractInstance.isFinalized.call())

           var result = myContractInstance.balanceOf(userGrowthPoolAddress)
           console.log("UGP BAT Balance: " + result)
       }

       // Note that the returned "myContractReturned" === "myContract",
       // so the returned "myContractReturned" object will also get the address set.
    } else {
      console.log(err)
    }
  });
}

const userGrowthPoolWallet = web3.eth.accounts[0]
initializeBatContract(userGrowthPoolWallet)
