# **Description**
This API automation test framework uses [pactumJS](https://pactumjs.github.io/) as the testiong tool. Cucucmber-js is the chosen test framework and runner. <br/>
If you ever decide to use any other runner/framework like mocha, jest etc., you can very well do that and the framework still work without any issues.

```gherkin

 Scenario: Casecaded get requests
  Given endpoint "http://localhost/all"   # Set the endpoint.
  When method "get"                       # Make request to the endpoint.
  Then status 200                         # Verify response status is 200.
  And def "{id}; {firstName}" = "body[0].id; [0].firstName"

  Given endpoint "http://localhost/employee"
  And request '{"id": {id}, "firstName": "{firstName}" }'
  When method "get"  
  Then status 200
  And expect "lastName; firstName" == "Doe; John"
```


# **Installation**

## NodeJS

We are using JavaScript for the API automation test. So nodeJS is the first thing to install.

* Download nodeJS(v14.17.4) or higher from [here](https://nodejs.org/de/blog/release/v14.17.4/)
* Install downloaded Node JS to your system.


## Git

Iinstall git for check in/out the code in/from the repo.
* Download and install git from [here](https://git-scm.com/downloads)


## Checkout the code

* Open the project folder where you would like to check out the code.
* Right click and click 'git Bash here' from the list. This will open git CLI.
* Now execute the following command to check out the code:
```sh
  $   git clone <TBD>
```

## Install node packages

* Open command prompt and execute following command:
```sh
  $   npm install
```
<br/>

# **Test Execution**
## With cucumber-js runner
* Set environment variable 'API_TEST_ENV' to "local" or "dev" or "qa".
* Open command prompt and execute following command:
```sh
  $   npm test
```

## With mocha runner (optional)
If you decide to write the tests in Mocha, you can execute the tests with Mocha runner as well.
* Open package.json from project folder.
* Change value of scripts.test node to "mocha":
```json
    {"scripts" :
        "start": "XXXXXXX"
        "test": "mocha"
    }
```

* Open command prompt and execute following command:
```sh
  $   npm test
```

<br/>

# **IDE**
In order to edit test scripts you can use any IDE of your liking. <br/> You can also choose from the list of some popular Free IDE for JavaScript:
* [VS Code](https://code.visualstudio.com/)
* [atom](https://atom.io/)
* [intelliJ IDEA](https://www.jetbrains.com/idea/)
* [Sublime Text](https://www.sublimetext.com/)

<br/>

# **Write Test Scripts**
[Reference to reusable steps](steps.md#functions)

<br/>

# **Cucumber.io Reporting**
Mock test reports are generated and saved in [Shared Cucumber Report](https://reports.cucumber.io/reports/6e57e6b0-5995-4280-a64f-c2c728e6c715)

<br/>

# **Mapping JIRA Test**
Execution of automated tests definitely saves time but reporting the executed tests automatically is something that can help the stakeholder up to date. It also gives a lot of clarity and removes the manual effort of collecting test reports.
Many Test Management apps in JIRA provide an API to import the execution reports. If you have selected Xray as the Test Management tool in JIRA, you can follow [few steps](https://docs.getxray.app/display/XRAYCLOUD/Testing+Node.js+apps+using+Cucumber.js+in+JavaScript) which can help map the JIRA tests with automated tests and upload the test report to JIRA.

* Request a JIRA admin to create Global API key which will generate client_id and client_secret.
* Get the Issue number of the test from JIRA. Example: SW-186
* Add a tag to cucumber scenario. Example: @TEST_SW-186
```gherkin
	@TEST_SW-186
	Scenario: Sample Test for Automated test integration
		Given resource "/employee"
		When request '{"id":1, "firstName": "John"}'
		And method "get"
		Then status 200
```
* Execute cucumber scenarios and generate a report file in JSON format. You can do that by adding a command parameter.
  ```sh
    cucumber-js --format json:report.json
  ```
* [Follow the steps from Xray site](https://docs.getxray.app/display/XRAYCLOUD/Authentication+-+REST) to get authenticated token. 
* [Follow steps to upload the test results](https://docs.getxray.app/display/XRAYCLOUD/Import+Execution+Results+-+REST#ImportExecutionResultsREST-CucumberJSONresults).

<br/>

# **TODO**
* Create reusable steps - **Done**
* Separate Environments Vars - **Done**
* Create docs for installation and steps - **Done**
* Integrate with xray - **In Progress**
* Manage Authenticated Token.
* Loading Json Data - **Done**
* Validate Response Schema.
* Verify pattern in response body.
* Verify valid JSON response.