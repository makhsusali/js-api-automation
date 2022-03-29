// ____________________GLOBAL_______________________________
//---------------------GLOBAL------------------------------
const pactum = require('pactum');
const expect = require('chai').expect;
const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { assert } = require('chai');
const fs = require('fs')
const config = require("../../config.json");
const path = require('path');
const delimiter = ";";

//--------------------Global Constants----------------------------
const selectedEnv = process.env.API_TEST_ENV;
const baseUrl = config["baseUrl"][selectedEnv];

//--------------------Global Variables----------------------------
let e2e = pactum.e2e('End to end instance');
let resource = null;   // res store the most rescent response. In other words, res stores the response from the last service call.
let url = null;        // end point for the service call.
let res = null;        // Saved response of the last service call.
let request = null;    // Payload or parameters to be sent for the service call.
let variable = {};     // Variable to assign values 

//--------------------Global Functions-----------------------------

const getNodeName = (node) => {
    const nodeName = node.trim();
    const regex1 = /^body/;
    const regex2 = /^\[.*\]\./;
    return 'res.res.' + (nodeName.match(regex1) !== null ? nodeName : ( nodeName.match(regex2) !== null ? `body${nodeName}` : `body.${nodeName}`) );
};


const getValue = (varName) => {
    return variable[varName]
};

const replaceVar = (varString) => {
    let newvarString = varString;
    if(variable !== null & variable !== {} ){
        Object.keys(variable).forEach(function(key) {
            var value = variable[key];
            newvarString = newvarString.replace(key, value);
        });
    }
    return newvarString;
};


const getAuthToken = async (user, password) => {
    // Placeholder to get authenticated token
    console.log(user);
    console.log(password);
};

const convertToJSON = (stringVal) => {
    try{
        return JSON.parse(replaceVar(stringVal));
     }catch(jsonError){
        assert.fail(`\nInvalid JSON format.\n${stringVal}\n${jsonError}`);
     }
};

const loadFile = (filePath, failTest=true) => {
    try {
        data = fs.readFileSync(path.resolve( `${__dirname}/../../data/${filePath}`), 'utf8');
        return data;
    } catch (err) {
        if(failTest === false){
            return null;
        }else{
            console.error(err);
            assert.fail(err);
        }
    }
};

const evaluateValue = (value) => {  
    console.log(value);
    if( value.match (/Number\(.*\)|Array\(.*\)/ )  ){
        return eval(value.trim());
    }else{
        return value;
    }
};

// ---------------------------------Direct functions to mapped cucumber Steps------------
/**
 * @param {string} resource Resource name of the API service to be called.
 * @description To set the endpoint from baseUrl and the resource passed to the function. Endpoint = baseUrl + resource
 * @example Given resource "/createUser" // Sets endpoint = baseUrl + "/createUser". Example: https://mybaseUrl/createUser
 * @example Given resource "/user/{id}"  // Reads value of variable {id} that was defined from the previous response and sets the endpoint. Example: {id} = 1 then  endpoint = baseUrl + "/user/1" 
 * @example Given resource "/user/all"   // Sets endpoint = baseUrl + "/user/all". Example: https://mybaseUrl/user/all   
 */
 const setEndpoint = (userResource)=> {
    resource = replaceVar(userResource);
    url = baseUrl + resource
};


/**
 * @param {string} url Resource name of the API service to be called.
 * @description To set the url endpoint.
 * @example Given endpoint "http://localhost/createUser" // Sets url endpoint to http://localhost/createUser
 * @example Given endpoint "http://localhost/user/{id}"  // Reads value of variable {id} that was defined from the previous response and sets the url endpoint. Example: {id} = 1 then  url = http://localhost/user/1 
 */
 const setUrl = (userUrl)=> {
    finalUrl = replaceVar(userUrl);
    url = finalUrl;
};

/**
 * @param {string} request JSON like string {"id": 1, "firstName": "John"}. Use single quotes ('') to pass value.
 * @description To set the request parameters or request payload. This is an optional step.
 * @example Given request '{"id": 1, "firstName": "John"}'  // Automatically sets get parameters. Example: https://mybaseUrl/resource?id=1&firstName=John
 * @example Given request '{"id": 3, "lastName": "Doe"}'    // Automatically assigns request payload body to JSON {"id": 3, "lastName": "Doe"}
 * @example Given request 'mySampleData.json'               // Loads json file 'mySampleData.json' and assigns request payload body to the content of the loaded json file.
 */
 const setRequest = (userRequest)=> {
     let fileData = loadFile(userRequest, false);
     if(fileData === null){
        request = userRequest;
     }else{
        request = fileData;
     }
};

/**
 * @param {string} method Name of the method that you want to call. It can take get, post, put, delete, etc.
 * @description Makes a async request to the API service. This results in getting a response from the API service. Must call step resource "/resource" first. 
 * @example When method "get"   // Makes a get call to the endpoint set by resource "/resource" step.
 * @example When method "post"  // Makes a post call to the endpoint set by resource "/resource" step.
 * @example When method "put"   // Makes a put call to the endpoint set by resource "/resource" step.
 */
const makeRequest = async (method) => {
    const step = e2e.step('API service call');
    if(resource !== null){
        console.log(url);
        if(method === 'get'){
            if(request !== null){
                request = convertToJSON(request);
                    await       
                    step
                    .spec()
                    .withMethod(method)
                    .withPath(url)
                    .withQueryParams(request)
                    .expect((ctx) => {
                        res = ctx;
                        });
            }else {
                await       
                step
                .spec()
                .withMethod(method)
                .withPath(url)
                .expect((ctx) => {
                        res = ctx;
                    });
            }
        }else {
            await       
            step
            .spec()
            .withMethod(method)
            .withPath(url)
            .withBody(request)
            .expect((ctx) => {
                    res = ctx;
            }); 
        }
        request = null;  //Set request payload to null for the next request to load.
    }else{
        assert.fail("Url is null.");
    }
};

/**
 * @param {number} status Expected status of API call as number.
 * @description Verifies the status of the API call.
 * @example Then status 500     //Verifies response has a status code 500
 * @example Then status 404     //Verifies response has a status code 404
 * @example Then status 200     //Verifies response has a status code 200
 */
 const verifyStatusCode = (exp) => {
    const act = res.res.statusCode;
    let actualReq = request !== null ? `Request Sent: ${request}\n` : 'No request body or parameters.';
    expect(act, `Expected status code to be ${exp} but got ${act} \n${actualReq}Response Recieved:\n${res.res.body}\n\n`).to.be.equal(exp);
};

/**
 * @param {string} nodeName Node name of the response in dot operator. Can be body.id or just id.
 * @param {string} expVal Expected string value of the node. Or Expected integer value of the node.
 * @description Verifies the actual value of response against expected value.
 * @example Then expect "firstName" == "John"       //Verifies that the response node "firstName" has a value "John".
 * @example Then expect "body.firstName" == "John"  //Verifies that the response node "firstName" has a value "John".
 * @example Then expect "id" == 1                   //Verifies that the response node "id" has a number value 1.
 * @example Then expect "ids" == "Array(1,2,3)"     //Verifies that the response node "ids" has an array value [1,2,3].
 */
const verifyNodeValue =  (nodeNames, expVals) => {
    if(typeof expVals === 'number' & Number(expVals) !== NaN){
        let node =  getNodeName(nodeNames);
        expect(eval(node), `Value of response node "${nodeNames}" expected to be equal to ${expVals} but got ${eval(node)}`).to.eql(expVals);
    }else{
        const nodeNamesArray = nodeNames.split(delimiter);
        const expValsArray = expVals.split(delimiter);
        nodeNamesArray.forEach( function (nodeName, index) {
            let expVal = evaluateValue(replaceVar(expValsArray[index].trim()));
            let node =  getNodeName(nodeName);
            expect(eval(node), `Value of response node "${nodeName}" expected to be equal to ${expVal} but got "${eval(node)}"`).to.eql(expVal);
        });
    }
};

/**
 * @param {string} nodeNames Node names of the response in dot operator and can be separated by semicolon(;). Can be body.id or just id.
 * @param {string} expVals Expected data types for the respective nodes. Types can be string, number, array, object etc.
 * @description Verifies the data type of the response node.
 * @example Then expect "body.id; body.firstName" of type "number; string"  // Verifies response node 'id' is of type number and node 'firstName' is of type string.
 * @example Then expect "id; firstName" of type "number; string"            // Verifies response node 'id' is of type number and node 'firstName' is of type string.
 * @example Then expect "cities; countries" of type "array; array"          // Verifies response node 'cities' is of type array and node 'countries' is of type array.
 */
const verifyNodeType =  (nodeNames, expVals) => {
    const nodeNamesArray = nodeNames.split(delimiter);
    const expValsArray = expVals.split(delimiter);
    nodeNamesArray.forEach( function (nodeName, index) {
        let expVal = expValsArray[index].trim();
        let node =  getNodeName(nodeName);
        expect(eval(node), `Response node "${nodeName}" expected to be of type ${expVal} but got ${typeof eval(node)}`).to.be.a(expVal);
    });
};

/**
 * @param {string} varNames Names of the variable(s) inside curely braces ({}) separated by semicolon(;).
 * @param {string} nodeNames Node names of the response in dot operator and can be separated by semicolon(;). Can be body.id or just id.
 * @description Save the value of the response node to a variable.
 * @example When def "{id}" = "body.id"                      // Defines a variable name {id} and assigns the value of response node 'id'.
 * @example When def "{id}; {firstName}" = "id; firstName"   // Defines variables name {id} and {firstName} and assigns the values of response nodes 'id' and 'firstName' respectively.
 */
 const assignVariable = (varNames, nodeNames) => {
    const nodeNamesArray = nodeNames.split(delimiter);
    const varNamesArray = varNames.split(delimiter);
    nodeNamesArray.forEach( function (nodeName, index) {
        variable[varNamesArray[index].trim()] = eval(getNodeName(nodeName));
    });
};

/**
 * @param {string} nodes Node names of the request in dot operator and can be separated by semicolon(;).
 * @param {string} values value(s) of the request node(s) to be replaced with. can be separated by semicolon(;).
 * @description Replace the node value in request by replacing it with variable or value.
 * @example When def "id; firstName" = "{id}; {firstName}"           // Replaces value of request node 'id' and 'firstName' to variable values {id} and {firstName} respectively.
 * @example When def "id; firstName" = "{id}; SomeValue"             // Replaces value of request node 'id' and 'firstName' to variable value {id} and string "SomeValue"  respectively.
 * @example When def "id; firstName" = "Number(1); SomeOtherValue"   // Replaces value of request node 'id' and 'firstName' to number 1 and string "SomeOtherValue" respectively.
 */
const replaceInRequestJson = (nodes, values) => {
    if(request !== null){
        tempJson = convertToJSON(request)
        const nodeNamesArray = nodes.split(delimiter);
        const varNamesArray = values.split(delimiter);
        nodeNamesArray.forEach( function (nodeName, index) {
            console.log( replaceVar(varNamesArray[index] ));
            tempJson[nodeName] = evaluateValue(replaceVar(varNamesArray[index]));
        });
        request = tempJson;
    }else{
        assert.fail("No request JSON loaded yet.\nPlease use request step to load a json.");
    }
};

// _________________GLOBAL ENDS______________________________


// _____________________HOOKS________________________________

/**
 * @description Anything inside this block is excuted after every test is done. A perect place to execute all the test teardown activities. Multiple After can be defined and all will be executed at teardown.
 */
After( async () => 
{
    await e2e.cleanup();
    res = null;
    method = null;
    request = null;
    url = null;
    resource = null;
    variable = {};
});
// _____________________HOOKS END____________________________


// _____________________STEPS________________________________
Given('resource {string}', (userResource) => {
    setEndpoint(userResource);
});

Given('endpoint {string}', (userUrl) => {
    setUrl(userUrl);
});

Given('request {string}', (userRequest) => {
    setRequest(userRequest);
});

When('method {string}', async (method) => {
    await makeRequest(method);
});

When('status {int}', (statusCode) => {
    verifyStatusCode(statusCode);
});

When('def {string} = {string}', (varNames, nodeNames) => {
    assignVariable(varNames, nodeNames);
});

Then('expect {string} == {string}',  (node, value) => {
    verifyNodeValue(node, value);
}); 


Then('expect {string} == {int}',  (node, value) => {
    verifyNodeValue(node, value);
}); 

Then('expect {string} of type {string}',  (node, value) => {
    verifyNodeType(node, value);
}); 


Then('override {string} = {string}',  (nodes, values) => {
    replaceInRequestJson(nodes, values);
}); 


Then('override {string} = {int}',  (node, value) => {
    replaceInRequestJson(node, value);
});
// _____________________STEPS END________________________________

