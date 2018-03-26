$("#sendProposalButton").click(() => {
    newTx();
    txOptions.data = platformData;
    txOptions.to = platformAddr;

    sendFunctionCall(this.password, platformAbi, "addProposal",
        [
            $("#proposalTittle").val(),
            $("#proposalDescription").val(),
            web3.toWei($("#proposalMoney").val(), 'ether')
        ], txOptions);

    updatePage();
});

$("#AllList").on('click', '.btn-vote', () => {
    let vote;
    if ($('.btn-vote:hover').text() === "Vote for")
        vote = true;
    else
        vote = false;

    let address = $('a:hover>.sender').text().substr(12);
    newTx();
    txOptions.data = platformData;
    txOptions.to = platformAddr;

    sendFunctionCall(this.password, platformAbi, "vote", [address, vote], txOptions);
    updatePage();
});

$("#infoRefresh").click(() => {
    updatePage();
});

$("body").ready(() => {
    updatePage();
});

function updateProps() {
    $("#AllList").empty();
    for (let i = 0; ; i++) {
        try {
            let address = platformContract.proposalSenders.call(i);
            let [title, desc, eth] = platformContract.showProposal.call(address);
            eth = eth.toNumber();
            eth = web3.fromWei(eth, 'ether');
            // console.log(eth);
            let prop = fromTemplate(title, desc, eth, address);
            // console.log(prop);
            $("#AllList").append(prop);

        } catch (e) {
            break;
        }
    }
}

function proposeAccess() {
    ut = staffContract.getTimePropose.call(this.address).toNumber();
    pt = platformContract.platformProposalEnd.call().toNumber();

    if (ut === pt || checkPriv() === "Non a User") {
        $("#plusPropose").addClass("disabled");
        $("#plusPropose").attr('disabled', 'disabled');
    }
    else {
        $("#plusPropose").removeClass("disabled");
        $("#plusPropose").removeAttr("disabled");
    }
}

function voteAccess() {
    ut = staffContract.getTimeVote.call(this.address).toNumber();
    pt = platformContract.platformVoteEnd.call().toNumber();

    vt = platformContract.platformProposalEnd.call().toNumber();
    ct = new Date()
    ct = ct.getTime()/1000;

    if (ut === pt || checkPriv() === "Non a User" || ct < vt) {
        $(".btn-vote").addClass("disabled");
        $(".btn-vote").attr('disabled', 'disabled');
    }
    else {
        $(".btn-vote").removeClass("disabled");
        $(".btn-vote").removeAttr("disabled");
    }
}


function fromTemplate(title, description, eth, recepient) {

    let ProposeBlock = document.createElement("a");
    ProposeBlock.href = "#";
    ProposeBlock.classList = ["list-group-item list-group-item-action flex-column align-items-start"];

    let ProposeHeader = document.createElement("div");
    ProposeHeader.classList = ["d-flex w-100 justify-content-between"];
    let HeaderTittle = document.createElement("h5");
    HeaderTittle.classList = ["mb-1"];
    HeaderTittle.innerHTML = title;
    let HeaderEther = document.createElement("small");
    HeaderEther.classList = ["text-muted"];
    HeaderEther.innerHTML = "requested " + eth + " ETH";
    $(ProposeHeader).append(HeaderTittle);
    $(ProposeHeader).append(HeaderEther);

    let ProposeBody = document.createElement("div");
    ProposeBody.classList = ["listItem hidden"];
    let BodyDesc = document.createElement("p");
    BodyDesc.classList = ["mb-1"];
    BodyDesc.innerHTML = description;
    $(ProposeBody).append(BodyDesc);
    if (this.address != recepient) {
        let ButtonFor = document.createElement("button");
        ButtonFor.classList = ["btn btn-success btn-sm btn-vote voteFor"];
        ButtonFor.innerHTML = "Vote for";
        let ButtonAgainst = document.createElement("button");
        ButtonAgainst.classList = ["btn btn-danger btn-sm btn-vote voteAgainst"];
        ButtonAgainst.innerHTML = "Vote against";
        console.log(ButtonFor);
        $(ProposeBody).append(ButtonFor);
        $(ProposeBody).append(" ");
        $(ProposeBody).append(ButtonAgainst);
        console.log('tets');
    }
    let Recep = document.createElement("small");
    Recep.classList = ["text-muted sender"];
    Recep.innerHTML = "sended from " + recepient;

    $(ProposeBlock).append(ProposeHeader);
    $(ProposeBlock).append(ProposeBody);
    $(ProposeBlock).append(Recep);
    return ProposeBlock;
}

function updatePage() {
    $("#address").text(this.address);
    $("#balance").text(web3.fromWei(web3.eth.getBalance(this.address).toString(), 'ether') + " ETH");
    $("#state").text(checkPriv());
    $("#platformStatus").text(checkPState());
    $("#timeToVote").text("(current: " + unixToString(platformContract.platformVoteModificator.call().toNumber()) + ")"  );
    $("#timeToPropose").text("(current: " + unixToString(platformContract.platformProposalModificator.call().toNumber()) + ")"  );
    updateProps();
    updateTimer();
    proposeAccess();
    voteAccess();
}
