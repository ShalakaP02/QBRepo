var express = require('express');
var router = express.Router();
//const itemInventory = require('../buildRequests/ItemInventoryQuery');
const xml2js = require('xml2js');

/* GET users listing. */
router.get('/', function(req, res, next) {
    //res.send('respond with a resource');

    //set request
    //const getXMLRequest = require('../request-response/getXMLRequest');
    //getXMLRequest.setTempXml(itemInventory.tempRequest);
    //var QuickbooksServer = require('../index');

    setTimeout(function(){
      console.log("Executing itemInventory"); 
      //get response
      const resp = require('../request-response/getXMLResponse');
      console.log(resp.getItemInventoryQueryRs());  
      res.set('Content-Type', 'application/json');
      res.send(resp.getItemInventoryQueryRs()); 
      

      /* xml2js.parseString(resp.getXmlResponse(), (err, result) => {
        if(err) {
            throw err;
        }
    
        // `result` is a JavaScript object
        // convert it to a JSON string
        const json = JSON.stringify(result, null, 4);
    
        // log JSON string
        console.log(json);
        res.send(json); 
        
        }); */
    
    },10);
    
      

});

module.exports = router;
