this.password = "dappvote";
//constructor();

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

staffAddr = JSON.parse(addrs)['Staff'];
staffContract = web3.eth.contract(staffAbi).at(staffAddr);

$("#ICreate").click(() => {
    $("#init").css('display', 'none');
    this.phrase = this.generateSeed();
    createWallet(this.phrase, this.password);
    $("#CBArea").text(this.phrase);
    $("#createBlock").css('display', 'block');
});

$("#CBButton").click(() => {
    $("#createBlock").css('display', 'none');
    $("#createBlock2").css('display', 'block');
});

$("#CB2Button").click(() => {
    if ($("#CB2Input").val() === this.phrase) {
        let role = staffContract.getStaffBalance.call(this.address).toNumber();
        if (role === 1)
            document.location.href = "./moderator.html";
        else
            document.location.href = "./users.html";
    }
});

$("#IRestore").click(() => {
    $("#init").css('display', 'none');
    $("#restore").css('display', 'block');
});

$("#RButton").click(() => {
    createWallet($("#RInput").val(), this.password, () => {
        let role = staffContract.getStaffBalance.call(this.address).toNumber();
        if (role === 1)
            document.location.href = "./moderator.html";
        else
            document.location.href = "./users.html";
    });
});