import { Page, Locator, expect } from '@playwright/test';
import { categoryData } from '../data/resources-data';

export class VideosPage {
    readonly page: Page;
    readonly categoryMenu: Locator;
    readonly sectionTitle: Locator;

    constructor(page: Page) {
        this.page = page;
    }

    // Selects a specific category (e.g., "Videos") from the "Resources" menu
    async selectCategory(mainMenu: string, section: string): Promise<void> {
        // Click main menu item (e.g., "Resources")
        const menuItem = this.page.locator(`//a[@class="header_panel__nav-list-link" and normalize-space()="${mainMenu}"]`);
        await menuItem.click();

        // Click subsection item (e.g., "Videos")
        const sectionItem = this.page.locator(`//strong[normalize-space()="${section}"]`);
        await sectionItem.click();
        await this.page.waitForLoadState('networkidle'); // Waits until all network activity settles
    }

    // Verifies that all resource items on the current page belong to the specified category
    async verifyResourcesByCategory(className: string): Promise<void> {
        // Locate all resource items by their common container selector
        const items = this.page.locator('.e-loop-item');
        // Count how many items are currently displayed on the page
        const count = await items.count();

        // Assert that there is at least one item on the page
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const item = items.nth(i);
            // Get the class attribute of the current item, which contains category info
            const classAttr = await item.getAttribute('class');
            // Assert that the class attribute contains the expected category class name
            expect(classAttr).toContain(className);
        }
    }

    // Goes through all paginated pages and verifies resources on each page match the given category
    async navigateThroughAllPagesAndVerifyResources(className: string): Promise<void> {
        let hasNextPage = true;

        // Loop while there is a "Next" page button visible
        while (hasNextPage) {

            // Verify all resources on the current page belong to the specified category
            await this.verifyResourcesByCategory(className);

            const nextBtn = this.page.locator('nav.elementor-pagination a.page-numbers.next');

            // Check if the "Next" button is visible (meaning more pages exist)
            hasNextPage = await nextBtn.isVisible();

            if (hasNextPage) {
                await Promise.all([
                    this.page.waitForLoadState('networkidle'),
                    nextBtn.click(),
                ]);
            }
        }
    }

    async filterByCategory(categoryName: string): Promise<void> {
        const categoryLink = this.page.locator(`nav.elementor-nav-menu--main a.elementor-item`, { hasText: categoryName });
        await categoryLink.click();
        await expect(this.page.locator(`nav.elementor-nav-menu--main a.elementor-item.elementor-item-active`, { hasText: categoryName })).toBeVisible();
    }


    async openResourceByIndexAndVerify(index: number = 0): Promise<void> {
        const items = this.page.locator('.e-loop-item'); // All resource items
        const count = await items.count();

        if (index >= count) {
            throw new Error(`Requested index ${index} exceeds number of available items (${count}).`);
        }

        const item = items.nth(index);

        // Locator for the link that wraps the thumbnail image
        const resourceLink = item.locator('a:has(img)').first();

        // Get the href attribute directly from the link
        const resourceHref = await resourceLink.getAttribute('href');
        if (!resourceHref) {
            throw new Error('Resource link does not have href attribute.');
        }

        // Click and wait for the page to load
        await Promise.all([
            resourceLink.click(),
            this.page.waitForLoadState('networkidle'),
        ]);

        // Verify that the URL exactly matches the href attribute
        await expect(this.page).toHaveURL(resourceHref);
    }
}