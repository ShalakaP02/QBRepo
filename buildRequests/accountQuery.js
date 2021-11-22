
var data2xml = require('data2xml');
var convert = data2xml({
        xmlHeader: '<?xml version="1.0" encoding="utf-8"?>\n<?qbxml version="13.0"?>\n'
    });

var xml = convert(
        'QBXML',
        {
            QBXMLMsgsRq : {
                _attr : { onError : 'stopOnError' },
                AccountQueryRq : {
                    MaxReturned: 1000,
                },
            },
        }
    );  



   module.exports = {
       
       tempRequest : xml
 
   } 