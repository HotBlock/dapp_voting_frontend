var txutils = lightwallet.txutils;
var signing = lightwallet.signing;
var encryption = lightwallet.encryption;

function constructor() {
    if (localStorage.getItem('key')) {
        this.keystore = lightwallet.keystore.deserialize(localStorage.getItem('key'));
        this.address = this.keystore.getAddresses()[0];
    } 
}

function generateSeed() {
    seed = lightwallet.keystore.generateRandomSeed();
    return seed;
}

function createWallet(phrase, password, callback) {
    if (phrase === '') {
        phrase = this.generateSeed();
    }

    lightwallet.keystore.createVault({
        password: password,
        seedPhrase: phrase,
        hdPathString: "m/44'/60'/0'/0",
    }, (err, ks) => {
        ks.keyFromPassword(password, (err, pwDerivedKey) => {
            if (err) throw err;
            ks.generateNewAddress(pwDerivedKey, 1);
            this.address = ks.getAddresses()[0];
            this.keystore = ks;
            localStorage.setItem('key', this.keystore.serialize());

            if (callback !== undefined) callback();
        });
    });
}


function sendFunctionCall(password, abi, functionName, args, txOptions) {
    this.keystore.keyFromPassword(password, (err, pwdKey) => {
        //Подпись функции
        funcTx = txutils.functionTx(abi, functionName, args, txOptions);
        //Подпись транзакции
        transaction = signing.signTx(this.keystore, pwdKey, funcTx, this.address);
        //Отправка транзакции
        web3.eth.sendRawTransaction('0x' + transaction.toString('hex'), (err, hash) => { console.log(err); console.log(hash); updatePage() });
        txOptions.nonce += 1;
    });
}

function sendValue(password, txOptions) {
    this.keystore.keyFromPassword(password, (err, pwdKey) => {
        //Подпись метода
        valueTx = txutils.valueTx(txOptions);
        //Подпись транзакции
        transaction = signing.signTx(this.keystore, pwdKey, valueTx, this.address);
        //Отправка транзакции
        web3.eth.sendRawTransaction('0x' + transaction.toString('hex'), (err, hash) => { console.log(err); console.log(hash) });
        txOptions.nonce += 1;
    });

}