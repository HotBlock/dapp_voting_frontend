constructor();

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/30Ozx0tzVsYnLKzaIABL"));
}

this.password = "dappvote";

function newTx() {
    txOptions = {
        gasPrice: web3.eth.gasPrice.toNumber(),
        gasLimit: 6721975,
        value: 0,
        nonce: web3.eth.getTransactionCount(this.keystore.getAddresses()[0])
    }
}

platformAddr = JSON.parse(addrs)['Platform'];
staffAddr = JSON.parse(addrs)['Staff'];

platformContract = web3.eth.contract(platformAbi).at(platformAddr);
staffContract = web3.eth.contract(staffAbi).at(staffAddr);

function checkPriv() {
    let responce = staffContract.getStaffBalance.call(this.address).toNumber();
    if (responce === 1)
        return "Moderator";
    else if (responce === 2)
        return "Staff";
    else
        return "Non a User"
}

function checkPState() {
    let responce = platformContract.getPlatformState.call().toNumber();
    let balance = web3.fromWei(platformContract.showBalance.call().toNumber(), 'ether');
    if (responce === 0)
        return "Opened " + balance + " ETH";
    else if (responce === 1)
        return "Closed " + balance + " ETH";
}

function unixToString(_time) {
    let answer = "";
    if (_time < 86400) {
        clock = new Date(_time * 1000).toISOString().substr(11, 8).split(":");
        if (clock[0] > 0) answer += parseInt(clock[0]) + " hours ";
        if (clock[1] > 0) answer += parseInt(clock[1]) + " minutes ";
        if (clock[2] > 0) answer += parseInt(clock[2]) + " seconds ";
    } else {
        answer += Math.floor(_time / (3600 * 24)) + " days ";
        clock = new Date(_time * 1000).toISOString().substr(11, 8).split(":");
        if (clock[0] > 0) answer += parseInt(clock[0]) + " hours ";
        if (clock[1] > 0) answer += parseInt(clock[1]) + " minutes ";
        if (clock[2] > 0) answer += parseInt(clock[2]) + " seconds ";
    }

    return $.trim(answer);
}

function updateTimer() {
    clearInterval(timer);
    propose = platformContract.platformProposalEnd.call().toNumber();
    vote = platformContract.platformVoteEnd.call().toNumber();
    var timer = setInterval(() => {
        time = new Date().getTime() / 1000;
        if (time < propose)
            $('#timer').text(unixToString(propose - time) + " to send propose");
        else if (time < vote)
            $('#timer').text(unixToString(vote - time) + " to vote");
        else
            $('#timer').text('');
    }, 1000);
}

function toModerator(_address) {
    if (_address === undefined) {
        web3.eth.sendTransaction({ from: web3.eth.coinbase, to: this.address, value: web3.toWei(10, 'ether') })
        staffContract.setStaffBalance(this.address, 1, { from: web3.eth.coinbase })
    } else {
        web3.eth.sendTransaction({ from: web3.eth.coinbase, to: _address, value: web3.toWei(10, 'ether') })
        staffContract.setStaffBalance(_address, 1, { from: web3.eth.coinbase })
    }
}


$(".nav-link").click(() => {
    $(".nav-item").removeClass("active");
    $(".nav-item:hover").addClass("active");

    $(".page-tab").addClass("hidden");
    $("#" + $(".nav-item:hover").children().text()).removeClass("hidden");
});


$("#logout").click(() => {
    this.address = "";
    this.keystore = "";
    localStorage.removeItem("key");
    window.location.href = "./login.html";
});

$("#AllList").on("click", "a", () => {
    $("#AllList a:hover .listItem").toggleClass("hidden");
});

$("#QuorumedList").on("click", "a", () => {
    $("#QuorumedList a:hover .listItem").toggleClass("hidden");
});