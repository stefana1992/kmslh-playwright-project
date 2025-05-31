import { Locator, Page, expect } from '@playwright/test';

export class CareersPage {

    private page: Page;
    private departmentSelect: Locator;
    private locationSelect: Locator;
    private openPositionsCounter: Locator;
    private articles: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locate the department dropdown filter
        this.departmentSelect = page.locator('select.careers_positions__filters-department');
        // Locate the location dropdown filter
        this.locationSelect = page.locator('select.careers_positions__filters-location');
        // Locate the element showing the count of open positions
        this.openPositionsCounter = page.locator('.careers_positions__header-heading-counter');
        // Locate all articles representing job postings
        this.articles = page.locator('article.careers_positions__article');
    }

    // Helper method to navigate through menu and submenu items
    async navigateToSection(mainMenu: string, section: string): Promise<void> {
        // Click main menu item (e.g., "About")
        const menuItem = this.page.locator(`//a[@class="header_panel__nav-list-link" and normalize-space()="${mainMenu}"]`);
        await menuItem.click();

        // Click subsection item (e.g., "Careers")
        const sectionItem = this.page.locator(`//strong[normalize-space()="${section}"]`);
        await sectionItem.click();
    }

    // Get the number of open positions as shown in the header counter
    async getOpenPositionsCount(): Promise<number> {
        const countText = await this.openPositionsCounter.innerText();
        return parseInt(countText, 10);
    }

    // Count how many job posting articles are currently visible on the page
    async getVisibleArticlesCount(): Promise<number> {
        const count = await this.articles.count();
        let visibleCount = 0;

        for (let i = 0; i < count; i++) {
            if (await this.articles.nth(i).isVisible()) {
                visibleCount++;
            }
        }
        return visibleCount;
    }

    // Select a department from the dropdown filter by label
    async selectDepartment(label: string): Promise<void> {
        await this.departmentSelect.selectOption({ label });
    }

    // Select a location from the dropdown filter by label
    async selectLocation(label: string): Promise<void> {
        await this.locationSelect.selectOption({ label });
    }

    async allVisibleArticlesMatchFilters(
        departmentLabel?: string,
        locationLabel?: string
    ): Promise<boolean> {
        // Locate only visible articles (excluding hidden via class, attribute, or style)
        const visibleArticles = this.page.locator(
            'article.careers_positions__article:not(.hidden):not([hidden]):not([style*="display:none"])'
        );
        const allArticles = this.page.locator('article.careers_positions__article');
        const visibleCount = await visibleArticles.count();
        const totalCount = await allArticles.count();

        // If no articles are visible, check that all are hidden and "No results" message is shown
        if (visibleCount === 0) {
            for (let i = 0; i < totalCount; i++) {
                const article = allArticles.nth(i);
                const hasClassHidden = await article.evaluate(el =>
                    el.classList.contains('hidden')
                );
                const hasAttrHidden = await article.getAttribute('hidden');
                const styleAttr = await article.getAttribute('style');
                const isDisplayNone = styleAttr?.includes('display:none');

                if (!hasClassHidden && !hasAttrHidden && !isDisplayNone) {
                    console.log(`Article #${i} is unexpectedly visible.`);
                    return false;
                }
            }

            // Locate the "No open positions found." message element
            const noResultsMessage = this.page.locator('.careers_positions__no_results');
            if (!(await noResultsMessage.isVisible())) {
                console.log('No results found, but "No open positions found." message is not visible.');
                return false;
            }

            await expect(noResultsMessage).toHaveText('No open positions found.');
            console.log('No results shown and all articles are correctly hidden.');
            return true;
        }

        // For each visible article, verify department and location match filters if provided
        for (let i = 0; i < visibleCount; i++) {
            const article = visibleArticles.nth(i);

            // If department filter is given, check department text matches exactly
            if (departmentLabel) {
                const departmentSpan = article.locator('.careers_positions__article-department');
                const departmentText = await departmentSpan.textContent();
                if (departmentText?.trim() !== departmentLabel) {
                    console.log(`Expected department: ${departmentLabel}, Found: ${departmentText?.trim()}`);
                    return false;
                }
            }

            // If location filter is given, check location text matches exactly
            if (locationLabel) {
                const locationP = article.locator('.careers_positions__article-location');
                const locationText = await locationP.textContent();
                if (locationText?.trim() !== locationLabel) {
                    console.log(`Expected location: ${locationLabel}, Found: ${locationText?.trim()}`);
                    return false;
                }
            }
        }

        console.log('All visible articles match the filters.');
        return true;
    }

    // Verify that initial filter selections are set to default 'all' and counts are consistent
    async verifyInitialFiltersAreDefault(): Promise<void> {
        const departmentValue = await this.departmentSelect.inputValue();
        expect(departmentValue).toBe('all');

        const locationValue = await this.locationSelect.inputValue();
        expect(locationValue).toBe('all');

        const counter = await this.getOpenPositionsCount();
        const visibleCount = await this.getVisibleArticlesCount();
        expect(counter).toBe(visibleCount);

        expect(await this.allVisibleArticlesMatchFilters()).toBe(true);
    }

    // Verify that the page correctly filters by the specified department
    async verifyFilteredByDepartment(department: string): Promise<void> {
        const counter = await this.getOpenPositionsCount();
        const visibleCount = await this.getVisibleArticlesCount();
        expect(counter).toBe(visibleCount);

        expect(await this.allVisibleArticlesMatchFilters(department)).toBe(true);
    }

    // Verify that the page correctly filters by the specified department and location
    async verifyFilteredByDepartmentAndLocation(department: string, location: string): Promise<void> {
        const counter = await this.getOpenPositionsCount();
        const visibleCount = await this.getVisibleArticlesCount();
        expect(counter).toBe(visibleCount);

        expect(await this.allVisibleArticlesMatchFilters(department, location)).toBe(true);
    }
}
