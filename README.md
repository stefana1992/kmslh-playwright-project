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

**Postcondition**:  
- Filters can be reset to "all" to show all jobs  
- Proper message shows when no results are found