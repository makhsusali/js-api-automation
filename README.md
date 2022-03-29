# **Description**
This API automation test framework uses [pactumJS](https://pactumjs.github.io/) as the testiong tool. Cucucmber-js is the chosen test framework and runner. <br/>
If you ever decide to use any other runner/framework like mocha, jest etc., you can very well do that and the framework still work without any issues.

```gherkin

 Scenario: Casecaded get requests
  Given endpoint "http://localhost/all"   # Set the endpoint.
  When method "get"                       # Make request to the endpoint.
  Then status 200                         # Verify response status is 200.
  And def "{id}; {firstName}" = "body[0].id; [0].firstName"

  Given endpoint "http://localhost//employee"
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
        "start": XXXXXXX
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

# **TODO**
* Create reusable steps - In Progress
* Separate Environments Vars - **Done**
* Create docs for installation and steps - In progress
* Integrate with xray
* Manage Authenticated Token
* Loading Json Data
* Validate Response Schema
* Verify pattern in response body
* Verify valid JSON response