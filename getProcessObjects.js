module.exports = function getProcessObjects(process)
{
    const components = [];
    const variables = [];
    const connections = [];
    const attributes = [];

    for(let key in process)
    {
        addComponents(key, process, components);
        addConnections(key, process, connections);

        if(process[key].length !== undefined)
        {
            for(let i = 0; i < process[key].length; i++)
            {
                addVariables(process[key][i], process, variables);
                addAttributes(process[key][i], process, attributes);
            }
        }
        else
        {
            addVariables(process[key], process, variables);
            addAttributes(process[key], process, attributes);
        }
    }

    return {
        components: components,
        variables: variables,
        connections: connections,
        attributes: attributes
    };
}

function addComponents(key, process, components)
{
    if(!isComponent(key))
        return;

    let component = process[key];

    if(component.length == undefined)
    {
        component.processId = process.$.id;
        component.objType = key;
        components.push(process[key]);
    }
    else
    {
        for(let objKey in component)
        {
            component[objKey].processId = process.$.id;
            component[objKey].objType = key;
            components.push(component[objKey]);
        }
    }
}

function isComponent(key)
{
    const componentKeys = [
        "task",
        "startEvent",
        "endEvent",
        "exclusiveGateway",
        "intermediateCatchEvent"
    ];

    for(let i = 0; i < componentKeys.length; i++)
    {
        if(componentKeys[i] == key)
            return true
    }

    return false;
}

function addVariables(object, process, variables)
{
    if(!objectHasVariables(object))
        return;

    const properties = object.extensionElements.properties;
    
    if(properties.property.length != undefined)
    {
        for(let i = 0; i < properties.property.length; i++)
        {
            properties.property[i].objId = object.$.id;
            properties.property[i].processId = process.$.id;

            variables.push(properties.property[i]);
        }
    }
    else
    {
        properties.property.objId = object.$.id;
        properties.property.processId = process.$.id;

        variables.push(properties.property);
    }
}

function objectHasVariables(object)
{
    if(object.extensionElements == undefined)
        return false;

    if(object.extensionElements.properties == undefined)
        return false;

    return true;
}

function addConnections(key, process, connections)
{
    if(key != "sequenceFlow")
        return;

    let connection = process[key];

    if(connection.length == undefined)
    {
        connection.processId = process.$.id;
        connections.push(connection);
    }
    else
    {
        for(let objKey in connection)
        {
            connection[objKey].processId = process.$.id;
            connections.push(connection[objKey]);
        }
    }
}

function addAttributes(object, process, attributes)
{
    for(let key in object)
    {
        if(isAttribute(key))
        {
            if(object[key]._ !== undefined)
            {
                object[key].objId = object.$.id;
                object[key].processId = process.$.id;
                object[key].name = key;
                attributes.push(object[key]);
            }
            else
            {
                for(let subKey in object[key])
                {
                    if(object[key][subKey]._ !== undefined)
                    {
                        object[key][subKey].objId = object.$.id;
                        object[key][subKey].processId = process.$.id;
                        object[key][subKey].name = key;
                        attributes.push(object[key][subKey]);
                    }
                }
            }
        }
    }
}

function isAttribute(key)
{
    const invalidAttributeKeys = [
        "outgoing",
        "incoming",
        "extensionElements",
        "documentation",
        "$"
    ];

    for(let i = 0; i < invalidAttributeKeys.length; i++)
    {
        if(invalidAttributeKeys[i] == key)
            return false
    }

    return true;
}