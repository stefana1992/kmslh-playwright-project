import { test } from '@playwright/test';
import { CareersPage } from '../pages/careersPage';
import { HomePage } from '../pages/homePage';
import { careerFilterData } from '../data/career-filter-data'

test.describe('KMS Lighthouse Careers Page – Filter Functionality', () => {

    let careersPage: CareersPage;
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        careersPage = new CareersPage(page);
        await homePage.navigateTo();
        await careersPage.navigateToSection('About', 'Careers');
    });

    test('User should be able to filter open positions using default, department, and location filters', async () => {
        await careersPage.verifyInitialFiltersAreDefault();
        await careersPage.selectDepartment(careerFilterData.departments.sales);
        await careersPage.verifyFilteredByDepartment(careerFilterData.departments.sales);
        await careersPage.selectLocation(careerFilterData.locations.london);
        await careersPage.verifyFilteredByDepartmentAndLocation(careerFilterData.departments.sales, careerFilterData.locations.london);
    });
});
