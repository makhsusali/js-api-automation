## Functions

<dl>
<dt><a href="#setEndpoint">setEndpoint(resource)</a></dt>
<dd><p>To set the endpoint from baseUrl and the resource passed to the function. Endpoint = baseUrl + resource</p>
</dd>
<dt><a href="#setRequest">setRequest(request)</a></dt>
<dd><p>To set the request parameters or request payload. This is an optional step.</p>
</dd>
<dt><a href="#makeRequest">makeRequest(method)</a></dt>
<dd><p>Makes a async request to the API service. This results in getting a response from the API service. Must call step resource &quot;/resource&quot; first.</p>
</dd>
<dt><a href="#verifyStatusCode">verifyStatusCode(status)</a></dt>
<dd><p>Verifies the status of the API call.</p>
</dd>
<dt><a href="#verifyNodeValue">verifyNodeValue(nodeName, expVal)</a></dt>
<dd><p>Verifies the actual value of response against expected value.</p>
</dd>
<dt><a href="#verifyNodeType">verifyNodeType(nodeNames, expVals)</a></dt>
<dd><p>Verifies the data type of the response node.</p>
</dd>
<dt><a href="#assignVariable">assignVariable(varNames, nodeNames)</a></dt>
<dd><p>Save the value of the response node to a variable.</p>
</dd>
<dt><a href="#replaceInRequestJson">replaceInRequestJson(nodes, values)</a></dt>
<dd><p>Replace the node value in request by replacing it with variable or value.</p>
</dd>
</dl>

<a name="setEndpoint"></a>

## setEndpoint(resource)
To set the endpoint from baseUrl and the resource passed to the function. Endpoint = baseUrl + resource

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| resource | <code>string</code> | Resource name of the API service to be called. |

**Example**  
```js
Given resource "/createUser" // Sets endpoint = baseUrl + "/createUser". Example: https://mybaseUrl/createUser
```
**Example**  
```js
Given resource "/user/{id}"  // Reads value of variable {id} that was defined from the previous response and sets the endpoint. Example: {id} = 1 then  endpoint = baseUrl + "/user/1" 
```
**Example**  
```js
Given resource "/user/all"   // Sets endpoint = baseUrl + "/user/all". Example: https://mybaseUrl/user/all   
```
<a name="setRequest"></a>

## setRequest(request)
To set the request parameters or request payload. This is an optional step.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>string</code> | JSON like string {"id": 1, "firstName": "John"}. Use single quotes ('') to pass value. |

**Example**  
```js
Given request '{"id": 1, "firstName": "John"}'  // Automatically sets get parameters. Example: https://mybaseUrl/resource?id=1&firstName=John
```
**Example**  
```js
Given request '{"id": 3, "lastName": "Doe"}'    // Automatically assigns request payload body to JSON {"id": 3, "lastName": "Doe"}
```
**Example**  
```js
Given request 'mySampleData.json'               // Loads json file 'mySampleData.json' and assigns request payload body to the content of the loaded json file.
```
<a name="makeRequest"></a>

## makeRequest(method)
Makes a async request to the API service. This results in getting a response from the API service. Must call step resource "/resource" first.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | Name of the method that you want to call. It can take get, post, put, delete, etc. |

**Example**  
```js
When method "get"   // Makes a get call to the endpoint set by resource "/resource" step.
```
**Example**  
```js
When method "post"  // Makes a post call to the endpoint set by resource "/resource" step.
```
**Example**  
```js
When method "put"   // Makes a put call to the endpoint set by resource "/resource" step.
```
<a name="verifyStatusCode"></a>

## verifyStatusCode(status)
Verifies the status of the API call.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| status | <code>number</code> | Expected status of API call as number. |

**Example**  
```js
Then status 500     //Verifies response has a status code 500
```
**Example**  
```js
Then status 404     //Verifies response has a status code 404
```
**Example**  
```js
Then status 200     //Verifies response has a status code 200
```
<a name="verifyNodeValue"></a>

## verifyNodeValue(nodeName, expVal)
Verifies the actual value of response against expected value.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| nodeName | <code>string</code> | Node name of the response in dot operator. Can be body.id or just id. |
| expVal | <code>string</code> | Expected string value of the node. Or Expected integer value of the node. |

**Example**  
```js
Then expect "firstName" == "John"       //Verifies that the response node "firstName" has a value "John".
```
**Example**  
```js
Then expect "body.firstName" == "John"  //Verifies that the response node "firstName" has a value "John".
```
**Example**  
```js
Then expect "id" == 1                   //Verifies that the response node "id" has a number value 1.
```
**Example**  
```js
Then expect "ids" == "Array(1,2,3)"     //Verifies that the response node "ids" has an array value [1,2,3].
```
<a name="verifyNodeType"></a>

## verifyNodeType(nodeNames, expVals)
Verifies the data type of the response node.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| nodeNames | <code>string</code> | Node names of the response in dot operator and can be separated by semicolon(;). Can be body.id or just id. |
| expVals | <code>string</code> | Expected data types for the respective nodes. Types can be string, number, array, object etc. |

**Example**  
```js
Then expect "body.id; body.firstName" of type "number; string"  // Verifies response node 'id' is of type number and node 'firstName' is of type string.
```
**Example**  
```js
Then expect "id; firstName" of type "number; string"            // Verifies response node 'id' is of type number and node 'firstName' is of type string.
```
**Example**  
```js
Then expect "cities; countries" of type "array; array"          // Verifies response node 'cities' is of type array and node 'countries' is of type array.
```
<a name="assignVariable"></a>

## assignVariable(varNames, nodeNames)
Save the value of the response node to a variable.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| varNames | <code>string</code> | Names of the variable(s) inside curely braces ({}) separated by semicolon(;). |
| nodeNames | <code>string</code> | Node names of the response in dot operator and can be separated by semicolon(;). Can be body.id or just id. |

**Example**  
```js
When def "{id}" = "body.id"                      // Defines a variable name {id} and assigns the value of response node 'id'.
```
**Example**  
```js
When def "{id}; {firstName}" = "id; firstName"   // Defines variables name {id} and {firstName} and assigns the values of response nodes 'id' and 'firstName' respectively.
```
<a name="replaceInRequestJson"></a>

## replaceInRequestJson(nodes, values)
Replace the node value in request by replacing it with variable or value.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| nodes | <code>string</code> | Node names of the request in dot operator and can be separated by semicolon(;). |
| values | <code>string</code> | value(s) of the request node(s) to be replaced with. can be separated by semicolon(;). |

**Example**  
```js
When def "id; firstName" = "{id}; {firstName}"           // Replaces value of request node 'id' and 'firstName' to variable values {id} and {firstName} respectively.
```
**Example**  
```js
When def "id; firstName" = "{id}; SomeValue"             // Replaces value of request node 'id' and 'firstName' to variable value {id} and string "SomeValue"  respectively.
```
**Example**  
```js
When def "id; firstName" = "Number(1); SomeOtherValue"   // Replaces value of request node 'id' and 'firstName' to number 1 and string "SomeOtherValue" respectively.
```
