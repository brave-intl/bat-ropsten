# Deployment code for BAT contract on Ropsten

This code was used to deploy the [BAT contract to Ropsten](https://ropsten.etherscan.io/token/0x60b10c134088ebd63f80766874e2cade05fc987b).

## Instructions for deploying

Start up parity:
```
docker-compose up -d
```

Browser to `http://127.0.0.1:8180` and proceed to create a new wallet with an
empty passphrase.

Use a faucet to get ETH on ropsten, e.g.
```
curl -X POST -H "Content-Type: application/json" -d '{"toWhom":"YOUR_ADDR_HERE"}' https://ropsten.faucet.b9lab.com/tap
```

After the faucet transactions are confirmed, run the deployment code:

```
npm start
```
