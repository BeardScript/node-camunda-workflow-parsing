module.exports.clean = (xmlFile) => 
{
    xmlFile = xmlFile+"";
    xmlFile = xmlFile.replace(/camunda:/g, "");
    xmlFile = xmlFile.replace(/bpmn:/g, "");

    return xmlFile;
}