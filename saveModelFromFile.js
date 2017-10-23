const xmlCleaner = require('./xmlCleaner');
const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser({explicitArray : false});

const dbConnection = require('./dbConnection');
const saveObjectsToDatabase = require('./saveObjectsToDatabase');

module.exports = function saveModelFromFile()
{
    this.add('cmd:save-model-from-file', (args, done) => {

        const cleanXmlFile = xmlCleaner.clean(args.xmlFile);

        xmlParser.parseString(cleanXmlFile, (err, result) => {
            if(err) throw err;
            
            const con = dbConnection.create();

            con.connect(function(err) {
                if (err) throw "ERROR when attempting to connect: " + err;

                const process = result.definitions.process;

                con.query('SELECT id FROM process WHERE id=?', process.$.id, (err, res)=>{
                    if(err) throw "ERROR when attempting to SELECT process: " + err;

                    if(res.length > 0)
                    {
                        con.query('DELETE FROM process WHERE id=?', process.$.id, (err, res) =>{
                            if(err) throw "ERROR when attempting to DELETE process: " + err;

                            saveObjectsToDatabase(process, con, (dataset)=>{
                                con.end();
                                return done(null, dataset);
                            });
                        });
                    }
                    else
                    {
                        saveObjectsToDatabase(process, con, (dataset)=>{
                            con.end();
                            return done(null, dataset);
                        });
                    }
                });
            });
        });
    });
}