# KMS Lighthouse - Playwright Automation Project


# Explained in a few sentences which part of the system I would automate and why:

**I would automate the user interaction module, including navigation, dynamic UI components, and essential submission forms like "Book a Demo" and "Apply for this job."
The "Book a Demo" form is crucial as it captures potential customer interest, directly impacting business growth.
Similarly, the "Apply for this job" form plays a key role in managing candidate applications and supporting recruitment.
Automating these workflows helps ensure system reliability and stability, reducing errors and minimizing the risk of losing potential customers or candidates due to form or navigation issues.**


## DESIGN FOR 2 MANUAL TEST CASES:

## Test Case 1: Verify careers page filters functionality


**Test ID**: TC_Careers_001

**Title**: User should be able to filter job openings by department and location on the Careers page

**Precondition**:  
- User is on the homepage [https://kmslh.com/](https://kmslh.com/)  

**Test Steps**:  
1. Click on the **About** link in the header menu
2. From the submenu, select **Careers**  
3. Confirm default filters are set to "all" and open positions counter matches visible jobs  
4. Select a Department filter  
5. Verify visible jobs and counter update accordingly  
6. Select a Location filter  
7. Verify visible jobs and counter match both filters  
8. Apply filters that result in no jobs shown  
9. Verify no job postings are visible and a "No open positions found." message appears  


**Expected Results**
- Careers page loads correctly
- Default filters are set to “All” and counter matches visible jobs
- Selecting a department filters jobs and updates the counter
- Selecting a location applies combined filtering and updates the counter
- If no jobs match a "No open positions found." message appears


**Postcondition**:  
Filters can be reset to "all" to show all jobs  


# Test Case 2: Verify filtering, pagination, and resource navigation for Videos and Webinars categories

**Test ID** : TC_Resources_Filtering_002

**Title** : Verify user can filter by category (Videos & Webinars), navigate paginated resources, and open a resource detail page

**Precondition** :
- User is on the homepage [https://kmslh.com/](https://kmslh.com/)

**Test Steps**
1. Click on the **Resources** link in the header menu
2. Select the category **Videos** from the submenu
3. Verify the resources listed on the page belong to the Videos category
4. Navigate through all paginated pages and verify each resource item still belongs to the Videos category
5. Apply the Webinars category filter
6. Verify that only resources under the Webinars category are displayed
7. Continue navigating through all paginated pages and confirm that all items remain within the Webinars category
8. Open one resource (e.g. 6th on page) from the current list
9. Verify the following on the detail page:

**Expected Results**:
- Only items related to the selected category (Videos, then Webinars) are shown at every stage
- Pagination retains category consistency
- Resource detail page loads successfully with correct content and URL

**Postconditions**:
- User is on a valid detail page of a selected resource
- No broken links, missing content, or incorrect categorization appears



## Installation


#### Pre-requisites
1.NodeJS installed globally in the system.
https://nodejs.org/en/download/

**Note** Min node version 6.9.x

2.Chrome or Firefox browsers installed.

3.Text Editor(Optional) installed-->Sublime/Visual Studio Code.

## Run Scripts
* Clone the repository into a folder
* Go inside the folder and run following command from terminal/command prompt which would then install all the dependencies from package.json

```
npm install
```

# Run test with following command
* Run all the tests

```
npx playwright test
```

* Run a single test file
```
npx playwright test tests/bookDemo.spec.ts
```

* Run tests in headed browsers
```
npx playwright test --headed
```

* Run your tests with UI Mode for a better developer experience with time travel debugging, watch mode and more.
```
npx playwright test --ui
```

## Allure reporter

```
# Install
npm i -D allure-playwright

# Run tests
npx playwright test --reporter=line,allure-playwright

# Generate report
allure generate ./allure-results --clean && allure open ./allure-report
```


# To Get Started with this project - Setup


If you want to run test locally, please follow these steps:

1. Clone this repository

2. Make sure you have node.js installed

3. Run ```npm install``` to install node modules

4. Now you can run tests with ```npm run test``` - it will execute Playwright tests sequentially, generate an Allure report, and open it in your browser

5. If you want to run it in headed mode, then run tests with ```npm run test:headed```

6. If you want to run single test file:

- ```npm run test:bookADemo```

or

- ```npm run test:accessibility```

or

- ```npm run test:videos```

or

- ```npm run test:career```
