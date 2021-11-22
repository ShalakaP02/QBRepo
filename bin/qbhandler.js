





// Public
module.exports = {


    fetchRequests: function(callback) {
        buildRequests(callback);
    },

   
};

function buildRequests(callback) {
    var requests = new Array();

    const accountQuery = require('../buildRequests/accountQuery');
    var xml = accountQuery.tempRequest;
    requests.push(xml);

    const itemInventory = require('../buildRequests/ItemInventoryQuery');
    var xml = itemInventory.tempRequest;
    requests.push(xml);
    
    return callback(null, requests);
}