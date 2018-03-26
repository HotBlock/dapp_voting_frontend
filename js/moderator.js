$("#setStaffButton").click(() => {
    newTx();
    txOptions.data = staffData;
    txOptions.to = staffAddr;

    sendFunctionCall(this.password, staffAbi, "setStaffBalance",
        [$("#setStaffAddress").val(), $("#setStaffRole").val()], txOptions);
    updatePage();
});


$("#AllList").on('click', '.checkQuorum', () => {
    let address = $('a:hover>.sender').text().substr(12);
    newTx();
    txOptions.data = platformData;
    txOptions.to = platformAddr;

    sendFunctionCall(this.password, platformAbi, "checkQuorum", [address], txOptions);
    updatePage();
});

$("#QuorumedList").on('click', '.selectWinner', () => {
    let address = $('a:hover>.sender').text().substr(12);
    newTx();
    txOptions.data = platformData;
    txOptions.to = platformAddr;

    sendFunctionCall(this.password, platformAbi, "selectWinner", [address], txOptions);
    updatePage();
    // location.reload()
});


$("#depositeButton").click(() => {
    newTx();
    txOptions.data = platformData;
    txOptions.to = platformAddr;
    txOptions.value = web3.toWei($("#depositeInput").val(), 'milliether');
    sendFunctionCall(this.password, platformAbi, "depositeMoney", [], txOptions);
    updatePage();
});

$("#platformStart").click(() => {
    newTx();
    txOptions.data = platformData;
    txOptions.to = platformAddr;
    sendFunctionCall(this.password, platformAbi, "openPlatform", [], txOptions);
    updatePage();
});

$("#setVMButton").click(() => {
    newTx();
    txOptions.data = platformData;
    txOptions.to = platformAddr;
    sendFunctionCall(this.password, platformAbi, "setVotePeriod", [
        $("#setVoteModificator").val() * $("#setVMUnit").val()
    ], txOptions);
});

$("#setPMButton").click(() => {
    newTx();
    txOptions.data = platformData;
    txOptions.to = platformAddr;
    sendFunctionCall(this.password, platformAbi, "setProposalPeriod", [
        $("#setProposalModificator").val() * $("#setPMUnit").val()
    ], txOptions);
});

function canQuorum() {
    vt = platformContract.platformVoteEnd.call().toNumber();
    ct = new Date()
    ct = Math.round(ct.getTime() / 1000);

    if (ct < vt) {
        $(".checkQuorum").addClass("disabled");
        $(".checkQuorum").attr('disabled', 'disabled');
    }
    else {
        $(".checkQuorum").removeClass("disabled");
        $(".checkQuorum").removeAttr("disabled");
    }
}

function canWinner() {
    vt = platformContract.platformVoteEnd.call().toNumber();
    ct = new Date()
    ct = Math.round(ct.getTime() / 1000);

    if (ct < vt) {
        $(".selectWinner").addClass("disabled");
        $(".selectWinner").attr('disabled', 'disabled');
    }
    else {
        $(".selectWinner").removeClass("disabled");
        $(".selectWinner").removeAttr("disabled");
    }
}

function updateProps(parent) {
    $("#AllList").empty();
    $("#QuorumedList").empty();
    for (let i = 0; ; i++) {
        try {
            let address = platformContract.proposalSenders.call(i);
            let [title, desc, eth, undefined, state] = platformContract.showProposal.call(address);
            let [positive, negative] = platformContract.showProposalStatistic.call(address, { from: this.address });
            positive = positive.toNumber();
            negative = negative.toNumber();
            eth = web3.fromWei(eth, 'ether');
            state = state.toNumber();

            let prop = fromTemplate(title, desc, eth, positive, negative, address, state);
            $("#AllList").append(prop);

            if (state === 1) {
                let prop = fromQuorumed(title, desc, eth, address, positive, negative);
                $("#QuorumedList").append(prop);
            }

        } catch (e) {
            break;
        }
    }
}


function fromTemplate(title, description, eth, positive, total, recepient, state) {
    let quorum = positive * 100 / total > 70 ? true : false;
    let ProposeBlock = document.createElement("a");
    ProposeBlock.href = "#";
    if (quorum && state === 0)
        ProposeBlock.classList = ["list-group-item list-group-item-action flex-column align-items-start list-group-item-warning"];
    else
        ProposeBlock.classList = ["list-group-item list-group-item-action flex-column align-items-start"];

    // <span class="badge badge-primary badge-pill">14</span>
    let ProposeHeader = document.createElement("div");
    ProposeHeader.classList = ["d-flex w-100 justify-content-between"];
    let HeaderTittle = document.createElement("h5");
    HeaderTittle.classList = ["mb-1"];
    HeaderTittle.innerHTML = title;
    let HeaderEther = document.createElement("small");
    HeaderEther.classList = ["text-muted"];
    HeaderEther.innerHTML = "requested " + eth + " ETH";
    let badgePos = document.createElement("span");
    badgePos.classList = ["badge badge-success badge-pill"];
    badgePos.innerHTML = positive;
    let badgeNeg = document.createElement("span");
    badgeNeg.classList = ["badge badge-danger badge-pill"];
    badgeNeg.innerHTML = total - positive;
    $(HeaderTittle).append(" ");
    $(HeaderTittle).append(badgePos);
    $(HeaderTittle).append(" ");
    $(HeaderTittle).append(badgeNeg);
    $(ProposeHeader).append(HeaderTittle);
    $(ProposeHeader).append(HeaderEther);

    let ProposeBody = document.createElement("div");
    ProposeBody.classList = ["listItem hidden"];
    let BodyDesc = document.createElement("p");
    BodyDesc.classList = ["mb-1"];
    BodyDesc.innerHTML = description;
    $(ProposeBody).append(BodyDesc);
    if (quorum && state === 0) {
        let ButtonQuorum = document.createElement("button");
        ButtonQuorum.classList = ["btn btn-primary btn-sm checkQuorum"];
        ButtonQuorum.innerHTML = "Check Quorum";
        $(ProposeBody).append(ButtonQuorum);
    }

    let Recep = document.createElement("small");
    Recep.classList = ["text-muted sender"];
    Recep.innerHTML = "sended from " + recepient;

    $(ProposeBlock).append(ProposeHeader);
    $(ProposeBlock).append(ProposeBody);
    $(ProposeBlock).append(Recep);

    return ProposeBlock;
}

function fromQuorumed(title, description, eth, recepient, positive, total) {
    let quorum = positive * 100 / total > 70 ? true : false;

    let ProposeBlock = document.createElement("a");
    ProposeBlock.href = "#";
    if (quorum && state === 0)
        ProposeBlock.classList = ["list-group-item list-group-item-action flex-column align-items-start list-group-item-warning"];
    else
        ProposeBlock.classList = ["list-group-item list-group-item-action flex-column align-items-start"];

    // <span class="badge badge-primary badge-pill">14</span>
    let ProposeHeader = document.createElement("div");
    ProposeHeader.classList = ["d-flex w-100 justify-content-between"];
    let HeaderTittle = document.createElement("h5");
    HeaderTittle.classList = ["mb-1"];
    HeaderTittle.innerHTML = title;
    let HeaderEther = document.createElement("small");
    HeaderEther.classList = ["text-muted"];
    HeaderEther.innerHTML = "requested " + eth + " ETH";
    let badgePos = document.createElement("span");
    badgePos.classList = ["badge badge-success badge-pill"];
    badgePos.innerHTML = positive;
    let badgeNeg = document.createElement("span");
    badgeNeg.classList = ["badge badge-danger badge-pill"];
    badgeNeg.innerHTML = total - positive;
    $(HeaderTittle).append(" ");
    $(HeaderTittle).append(badgePos);
    $(HeaderTittle).append(" ");
    $(HeaderTittle).append(badgeNeg);
    $(ProposeHeader).append(HeaderTittle);
    $(ProposeHeader).append(HeaderEther);

    let ProposeBody = document.createElement("div");
    ProposeBody.classList = ["listItem hidden"];
    let BodyDesc = document.createElement("p");
    BodyDesc.classList = ["mb-1"];
    BodyDesc.innerHTML = description;
    let ButtonWinner = document.createElement("button");
    ButtonWinner.classList = ["btn btn-success btn-sm selectWinner"];
    ButtonWinner.innerHTML = "Select Winner";
    $(ProposeBody).append(BodyDesc);
    $(ProposeBody).append(ButtonWinner);


    let Recep = document.createElement("small");
    Recep.classList = ["text-muted sender"];
    Recep.innerHTML = "sended from " + recepient;

    $(ProposeBlock).append(ProposeHeader);
    $(ProposeBlock).append(ProposeBody);
    $(ProposeBlock).append(Recep);

    return ProposeBlock;
}


$("#infoRefresh").click(() => {
    updatePage();
});

function updatePage() {
    $("#address").text(this.address);
    $("#balance").text(web3.fromWei(web3.eth.getBalance(this.address).toString(), 'ether') + " ETH");
    $("#state").text(checkPriv());
    $("#platformStatus").text(checkPState());
    $("#timeToVote").text("(current: " + unixToString(platformContract.platformVoteModificator.call().toNumber()) + ")");
    $("#timeToPropose").text("(current: " + unixToString(platformContract.platformProposalModificator.call().toNumber()) + ")");
    updateProps();
    updateTimer();
    canQuorum();
    canWinner();
}

$("body").ready(() => {
    updatePage();
});