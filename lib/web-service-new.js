
 var semver = require('semver');

 var uuid = require('node-uuid');
 
 var MIN_SUPPORTED_VERSION = '1.0.0';
 
 var RECOMMENDED_VERSION = '2.0.1';

 var webService;
 
 var counter = 0;
 
 var lastError = '';
 
 var username = process.env.QB_USERNAME || 'QuickBookAdapter';
 
 var password = process.env.QB_PASSWORD || 'Merchant#1';
 
 
 var companyFile = process.env.QB_COMPANY_FILE || 'C:\\Users\\Public\\Documents\\Intuit\\QuickBooks\\Company Files\\QuickBookAdapter.qbw';
 

 var requestQueue = [];

 var qbXMLHandler = require('../bin/qbhandler');
 
 webService = {
    QBWebConnectorSvc: {
        QBWebConnectorSvcSoap: {}
    }
};
 
 webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.serverVersion = function (args, callback) {
     var retVal = '0.2.0';
 
     callback({
         serverVersionResult: {'string': retVal}
     });
 };

 webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.clientVersion = function(args, callback) {
     var retVal = '';
     var qbwcVersion = args.strVersion.split('.')[0] + '.' +
         args.strVersion.split('.')[1] + '.' +
         args.strVersion.split('.')[2];
 
     // Check if qbwcVersion is less than minimum supported.
     if (semver.lt(qbwcVersion, MIN_SUPPORTED_VERSION)) {
         retVal = 'E:You need to upgrade your QBWebConnector';
     }
     // Check if qbwcVersion is less than recommended version.
     else if (semver.lt(qbwcVersion, RECOMMENDED_VERSION)) {
         retVal = 'W:It is recommended that you upgrade your QBWebConnector';
     }
 
     callback({
         clientVersionResult: {'string': retVal}
     });
 };
 

 webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.authenticate = function(args, callback) {
     var authReturn = [];
     authReturn[0] = uuid.v1();
     
 
     if (args.strUserName.trim() === username && args.strPassword.trim() === password) {
 
        
           // Check if qbXMLHandler responds to method.
           if ((typeof qbXMLHandler.fetchRequests === "function")) {
            qbXMLHandler.fetchRequests(function(err, requests) {
                requestQueue = requests;
                if (err || requestQueue.length === 0) {
                    authReturn[1] = 'NONE';
                } else {
                    authReturn[1] = companyFile;
                }
                callback({
                    authenticateResult: {'string': [authReturn[0], authReturn[1]]}
                });
            });
        }else{
            authReturn[1] = 'NONE';
 
            callback({
                authenticateResult: {'string': [authReturn[0], authReturn[1]]}
            });
        }
       
     } else {
         authReturn[1] = 'nvu';
 
         callback({
             authenticateResult: {'string': [authReturn[0], authReturn[1]]}
         });
     }
 };
 

 webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.sendRequestXML = function(args, callback) {
    var request = '';
    var totalRequests = requestQueue.length;

    if (counter < totalRequests) {
        request = requestQueue[counter];
        counter += 1;
    } else {
        request = '';
        counter = 0;
    }

    callback({
        sendRequestXMLResult: { 'string': request }
    });
 };
 
 webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.receiveResponseXML = function(args, callback) {
     var response = args.response;
     var hresult = args.hresult;
     var message = args.message;
     var retVal = 0;
     var percentage = 0;
 
     if (hresult) {
         // if there was an error
         // the web service should return a
         // negative value.
         console.log("QB CONNECTION ERROR: " + args.message + ' (' + args.hresult + ')');
         lastError = message;
         retVal = -101;
 
         
     }else {
        const xmlResp = require('../request-response/getXMLResponse');
        xmlResp.setXmlResponse(response);
        console.log("response done:: ******************************");
        console.log(response);

        percentage = (!requestQueue.length) ? 100 : counter * 100 / requestQueue.length;
        if (percentage >= 100) {
            // There are no more requests.
            // Reset the counter.
            counter = 0;
        }
        //QBWC throws an error if the return value contains a decimal
        retVal = percentage.toFixed();
    }

     
 
     callback({
         receiveResponseXMLResult: { 'string': response }
     });
 };
 

 webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.connectionError = function(args, callback) {
     console.log("QB CONNECTION ERROR: " + args.message + ' (' + args.hresult + ')');
     lastError = args.message;
     var retVal = 'DONE';
 
     callback({
         connectionErrorResult: { 'string': retVal }
     });
 };
 
 /**
  * Called when there is an error connecting to QB.
  * Currently just saves off any errors and returns the latest one.
  */
 webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.getLastError = function(args, callback) {
     var retVal = lastError;
 
     callback({
         getLastErrorResult:  { 'string': retVal }
     });
 };
 
 /**
  * Tells QBWC is finished with the session.
  *
  * @return 'OK'
  */
 webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.closeConnection = function(args, callback) {
     var retVal = 'OK';

     callback({
         closeConnectionResult: { 'string': retVal }
     });
 };
 
 //////////////////
 //
 // Public
 //
 //////////////////
 
 module.exports = {
     service: webService
 };
 
 
 