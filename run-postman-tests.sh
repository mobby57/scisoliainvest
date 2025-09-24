{
  "name": "sci-solia-postman-tests",
  "version": "1.0.0",
  "description": "Postman tests for SCI Solia Invest API",
  "scripts": {
    "test:postman": "./run-postman-tests.sh",
    "test:postman:local": "./run-postman-tests.sh local",
    "test:postman:staging": "./run-postman-tests.sh staging",
    "test:postman:prod": "./run-postman-tests.sh prod",
    "test:postman:ci": "newman run SCI_Solia_Invest_Collection_with_Tests.json -e SCI_Solia_Invest.postman_environment.json --reporters cli,json --reporter-json-export test-results/postman-results.json"
  },
  "devDependencies": {
    "newman": "^6.0.0"
  }
}
