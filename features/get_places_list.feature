Feature: getting places-list
  An user will be able to get a list of places

  Scenario: getting places-list
    Given I am an user of the application
    When I ask for the places-list
    Then I should receive a list of places