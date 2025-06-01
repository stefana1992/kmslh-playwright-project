import { Page, Locator, expect } from '@playwright/test';

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

    // Verifies that all listed resources on the current page are videos
    async verifyAllResourcesAreVideos(): Promise<void> {
        const items = this.page.locator('.e-loop-item');  // Selector for all resource items
        const count = await items.count();// Total number of items
        expect(count).toBeGreaterThan(0);// Ensure there are some resources displayed

        // Loop through each item and check that it contains the class indicating it's a video
        for (let i = 0; i < count; i++) {
            const item = items.nth(i);
            const classAttr = await item.getAttribute('class');
            expect(classAttr).toContain('category-video'); // Verify it's categorized as a video
        }
    }

    // Goes through all paginated pages and verifies resources on each page
    async navigateThroughAllPagesAndVerifyResources(): Promise<void> {
        let hasNextPage = true;

        while (hasNextPage) {
            await this.verifyAllResourcesAreVideos(); // Verify current page items

            const nextBtn = this.page.locator('nav.elementor-pagination a.page-numbers.next');
            hasNextPage = await nextBtn.isVisible(); // Check if there is a next page
            // Clicks on the next page and waits for content to load
            if (hasNextPage) {
                await Promise.all([
                    this.page.waitForLoadState('networkidle'),
                    nextBtn.click(),
                ]);
            }
        }
    }

    // Opens a resource by index (e.g., 5th item) and verifies that its URL is as expected
    async openResourceByIndexAndVerify(index: number = 0): Promise<void> {
        const items = this.page.locator('.e-loop-item'); // All resource items
        const count = await items.count();

        if (index >= count) {
            throw new Error(`Requested index ${index} exceeds number of available items (${count}).`);
        }

        const item = items.nth(index);

        // Locators within the item
        const categoryLabel = item.locator('a[rel="tag"]');  // Resource category (e.g., Video)
        const titleElement = item.locator('h3.elementor-heading-title a');// Resource title
        const resourceLink = item.locator('a:has(img)').first();// Link that wraps the thumbnail

        // Ensure required elements are visible
        await expect(categoryLabel).toBeVisible();
        await expect(titleElement).toBeVisible();
        await expect(resourceLink).toBeVisible();

        // Process the category to use it in the expected URL
        const categoryText = (await categoryLabel.innerText()).trim().toLowerCase();
        const categorySlug = categoryText.endsWith('s') ? categoryText.slice(0, -1) : categoryText;

        // Generate a URL slug from the title
        const titleText = (await titleElement.innerText()).trim();
        const slug = titleText
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove punctuation
            .replace(/\s+/g, '-')     // Replace spaces with hyphens
            .replace(/-+/g, '-');     // Normalize multiple hyphens

        const expectedUrlPart = `/${categorySlug}/${slug}/`;

        // Click on the resource and wait for the detail page to load
        await Promise.all([
            resourceLink.click(),
            this.page.waitForLoadState('networkidle'),
        ]);
        // Verify that the new page URL contains the expected slug
        await expect(this.page).toHaveURL(new RegExp(expectedUrlPart));
    }
}