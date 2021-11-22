var tempXmlResponse = "";
var accountQueryRs = "";
var itemInventoryQueryRs = "";

exports.setXmlResponse = function(xmlResp) {
   // tempXmlResponse = xmlResp;
    if(xmlResp.includes('AccountQueryRs')){
        accountQueryRs = xmlResp ;
    }else if(xmlResp.includes('ItemInventoryQueryRs')){
        itemInventoryQueryRs = xmlResp ;
    }
};

exports.getXmlResponse = function() {
    return tempXmlResponse;
};


exports.getAccountQueryRs = function() {
    return accountQueryRs;
};

exports.getItemInventoryQueryRs = function() {
    return itemInventoryQueryRs;
};
