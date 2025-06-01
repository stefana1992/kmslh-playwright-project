import { test } from '@playwright/test';
import { VideosPage } from '../pages/videosPage';
import { HomePage } from '../pages/homePage';

test.describe('KMS Lighthouse - Videos category resources verification', () => {

    let videosPage: VideosPage;
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        videosPage = new VideosPage(page);
        await homePage.navigateTo();
    });


    test('User should be able to filter by Videos category, verify all resources and open a specific video resource', async () => {
        // Selects the "Videos" category from the "Resources" dropdown in the navigation
        await videosPage.selectCategory('Resources', 'Videos');
        // Verifies that all listed resource items on the current page are of category "Videos"
        await videosPage.verifyAllResourcesAreVideos();
        // Navigates through all paginated pages and verifies that all items remain in the "Videos" category
        await videosPage.navigateThroughAllPagesAndVerifyResources();
        // Opens the 6th resource (index 5) and verifies that the URL of the opened resource page matches the expected format
        await videosPage.openResourceByIndexAndVerify(5);
    });
});
