import { Locator, Page } from '@playwright/test';


export class HomePage {
    private page: Page;
    private bookADemoButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.bookADemoButton = page.locator('.header_panel__button');
    }

    async navigateTo() {
        await this.page.goto('/');
    }

    async clickBookADemo() {
        await this.bookADemoButton.click();
    }
}