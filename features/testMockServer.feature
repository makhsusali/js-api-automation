Feature: Testing a Mock API

  @TEST_BIOP-18
  Scenario: Casecaded get requests
    Given resource "/all"
    When method "get"
    Then status 200
    And def "{id}; {firstName}" = "body[0].id; [0].firstName"
  
    Given resource "/employee"
    And request '{"id": {id}, "firstName": "{firstName}" }'
    When method "get"
    Then status 200
    And expect "lastName; firstName" == "Doe; John"
    And expect "id; firstName" == "Number(1); {firstName}"
    And expect "id; firstName" == "Number({id}); {firstName}"
    And expect "id; firstName; locations.usa" == 'Number({id}); {firstName}; Array("nyc","sfo")'
    And expect "id" == 1
    And expect "id; firstName; locations.canada" of type "number; string; array"
    # And expect "id" == "1"
    # And expect "id" == 3
    # And expect "id; firstName; locations.canada" of type "number; number; array"

@TEST_BIOP-19
Scenario: Test with Example Table
  Given resource "/employee"
  When request '<request>'
  And method "get"
  Then status <statusCode>

  Examples:
  |statusCode|request|
  |200|{"id":1, "firstName": "John"}  |
  |200|{"id":2, "firstName": "Taylor"}|
  |404|{"id":"453"}                   |
  |404|{"id":1, "lastName": "Doe"}    |



Scenario: Test post and subsequent get. Load payload from JSON
  Given resource "/employee/new"
  When request '<payload>'
  And method "post"
  Then status 200
  And def "{id}" = "id"

  Given resource "/employee/{id}"
  When method "get"
  Then status <statusCode>


  Examples:
  |statusCode|payload|
  # |200       |{"firstName":"Good", "lastName": "John", "designation": "test"} |
  |200       |sampleData.json|


  Scenario: Load json request and override the node values
  Given resource "/employee/new"
  And request 'sampleData.json'
  And override 'firstName' = 'SomeName'
  And method "post"
  Then status 200

  Given request 'sampleData.json'
  And override 'firstName' = 'Array(2,3)'
  And method "post"
  Then status 404