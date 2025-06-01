import { test } from '@playwright/test';
import { VideosPage } from '../pages/videosPage';
import { HomePage } from '../pages/homePage';
import { categoryData } from '../data/resources-data';

test.describe('Video and Webinar Resources Filtering and Navigation', () => {

    let videosPage: VideosPage;
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        videosPage = new VideosPage(page);
        await homePage.navigateTo();
    });


    test('User should be able to filter by category, verify resources, paginate, and open a specific resource', async () => {
        // Choose the "Videos" category from the "Resources" dropdown menu
        await videosPage.selectCategory('Resources', categoryData.videos.label);
        // Check that every displayed resource belongs to the "Videos" category
        await videosPage.verifyResourcesByCategory(categoryData.videos.className);
        // Iterate through all pagination pages, confirming "Videos" category consistency
        await videosPage.navigateThroughAllPagesAndVerifyResources(categoryData.videos.className);
        // Apply filter for the "Webinars" category
        await videosPage.filterByCategory(categoryData.webinar.label);
        // Go through all paginated pages, verifying all resources belong to "Webinars"
        await videosPage.navigateThroughAllPagesAndVerifyResources(categoryData.webinar.className);
        // Confirm all visible resources are of the "Webinars" category
        await videosPage.verifyResourcesByCategory(categoryData.webinar.className);
        // Open the 6th resource (index 5) and check that the URL matches expectations
        await videosPage.openResourceByIndexAndVerify(5);
    });
});
