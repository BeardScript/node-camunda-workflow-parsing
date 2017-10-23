const getProcessObjects = require('./getProcessObjects');

let query = "";
let values = [];

module.exports = function saveObjectsToDatabase(process, con, callback)
{
    const processObjects = getProcessObjects(process);

    addSaveProcessQuery(process);
    addSaveComponentsQuery(processObjects.components, process.$.id);
    addSaveConnectionsQuery(processObjects.connections, process.$.id);
    addSaveVariablesQuery(processObjects.variables, process.$.id);
    addSaveAttributesQuery(processObjects.attributes, process.$.id);

    con.query(query, values, function (err, result) {
        if (err) throw "ERROR when attempting to save: " + err;

        const selectQuery = `SELECT * FROM process WHERE id=?;
                             SELECT * FROM component WHERE processId=?;
                             SELECT * FROM variable WHERE processId=?;
                             SELECT * FROM connection WHERE processId=?;
                             SELECT * FROM attribute WHERE processId=?;`;

        selectVals = [process.$.id, process.$.id, process.$.id, process.$.id, process.$.id];

        con.query(selectQuery, selectVals, function(err, dataset){
            if (err) throw "ERROR when attempting to get dataset: " + err;

            if(callback) callback(dataset);
        });
    });
}

function addSaveProcessQuery(process)
{
    query += `INSERT INTO process SET id=?, name=?, description=?, isExecutable=? ; `;

    values = values.concat([
        process.$.id,
        process.$.name,
        process.documentation, 
        process.$.isExecutable
    ]);
}

function addSaveComponentsQuery(components)
{
    for(let i = 0; i < components.length; i++)
    {
        query += `INSERT INTO component SET id=?, name=?, description=?, type=?, processId=? ; `;

        values = values.concat([
            components[i].$.id, 
            components[i].$.name, 
            components[i].documentation, 
            components[i].objType,
            components[i].processId
        ]);
    }
}

function addSaveConnectionsQuery(connections, processId)
{
    for(let i = 0; i < connections.length; i++)
    {
        query += `INSERT INTO connection SET id=?, name=?, description=?, fromObject=?, toObject=?, processId=? ; `;

        values = values.concat([
            connections[i].$.id, 
            connections[i].$.name, 
            connections[i].documentation, 
            connections[i].$.sourceRef,
            connections[i].$.targetRef,
            connections[i].processId
        ]);
    }
}

function addSaveVariablesQuery(variables)
{
    for(let i = 0; i < variables.length; i++)
    {
        const name = variables[i].$.name.split(" ");
        const isConst = name[0] === "const";

        if(variables[i].$.value === undefined)
            variables[i].$.value = null;

        query += `INSERT INTO variable SET name=?, value=?, isConstant=?, type=?, objectId=?, processId=? ; `;

        values = values.concat([
            name[2], 
            variables[i].$.value,
            isConst,
            name[1],
            variables[i].objId,
            variables[i].processId
        ]);
    }
}

function addSaveAttributesQuery(attributes, processId)
{
    for(let i = 0; i < attributes.length; i++)
    {
        query += `INSERT INTO attribute SET name=?, value=?, objectId=?, processId=? ; `;

        values = values.concat([
            attributes[i].name, 
            attributes[i]._,
            attributes[i].objId,
            attributes[i].processId
        ]);
    }
}