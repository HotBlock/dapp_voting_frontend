# DApp_Voting frontend repo
This repository contains frontend example of [DApp_Voting contracts](https://github.com/HotBlock/dapp_voting_contracts)

**Libraries used**:

* [web3.js](https://github.com/ethereum/web3.js)
* [eth-lightwallet](https://github.com/ConsenSys/eth-lightwallet)
* [jquery](https://jquery.com/)
* [bootstrap](https://getbootstrap.com/)

**Requirements**:

* Suitable browser
* Web3 provider to one of ethereum test networks
	* [**rinkeby**](https://www.rinkeby.io/#geth) 
	* local network with deployed [contracts](https://github.com/HotBlock/dapp_voting_contracts)

**Structure**:

* **login.html** - page to create/restore lightwallet accounts
* **users.html** - users dashboard page
* **moderator.html** - moderator managment page

## Setup

Just clone the repo

```bash
git clone https://github.com/HotBlock/dapp_voting_frontend
```

Go inside of cloned folder and run `login.html` with any browser (Firefox, Opera, Chrome recomended)

## Usecase

(Doesn't forget to save account mnemonics you created!)

For correct use of example you will need at least:

* 1 **moderator** account
* 2 **staff** accounts

#### Posetive testing steps:

1. [Restore](#rinkeby-notes) **moderator** account or [create](#local-network-notes) it 
1. Open `Utils` fold
1. Add 2 or more staff users _(if you doesn't have them)_
1. Change time for voting or adding proposes _(optional)_
1. Deposite ETH to platform _(if platform have less than 0.1 ETH)_
1. Open platform

Now repeat next steps with few **staff** accounts:

7. Restore **staff** account
7. Add proposal
7. Wait until you can vote
7. Select one propose and press `Vote for` or `Vote against` button

When time for voting ended sing in again as **moderator** and do next steps:

11. Press `check quorum` button on untracked proposals _(marked with yellow)_
11. Open `Quorumed` fold
11. Choose proposal and press `Select Winner`


### Rinkeby notes

Rinkeby network already have moderator account with next mnemonic:
```
dad coral country machine mushroom pigeon happy job left retreat gain then
```


### Local network notes

Web3 provider setted as `rinkeby.infura.io`, you can change it in first lines of `login.js` and `default.js` located in `js` folder

After deploying [contracts](https://github.com/HotBlock/dapp_voting_contracts) use [script](https://github.com/HotBlock/dapp_voting_contracts/tree/master/scripts) to generate `contracts.js` and replace 
the original placed in `js` folder

Create new account

Open browser dev console (usually `Ctrl+Shift+i` or `Ctrl+Shift+k`) and execute one of the next commands

```javascript
toModerator() //your current lightwallet address
toModerator("0x7410b0d014C923474718BDF3AB2c0539e79e1206") //provided address
```

this script will add address to Moderator group and send 10 ETH from **`eth.coinbase`** address
or you can do it manually:

```javascript
web3.eth.sendTransaction({ from: COINBASE, to: WALLET, value: web3.toWei(10, 'ether') })
staffContract.setStaffBalance(WALLET, 1, { from: COINBASE })
```
just replace `WALLET` with your lightwallet address and `COINBASE` with coinbase wallet address
