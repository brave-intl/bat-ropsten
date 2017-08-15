.PHONY: clean
all: basic-attention-token-crowdsale/contracts/out

clean:
	sudo rm -rf basic-attention-token-crowdsale/contracts/out

basic-attention-token-crowdsale/contracts/out: basic-attention-token-crowdsale/contracts/BAToken.sol
	docker run -it -v $(shell pwd)/basic-attention-token-crowdsale/contracts:/src -w /src braveintl/solc:v0.4.10 --gas --optimize --overwrite --bin -o out BAToken.sol
