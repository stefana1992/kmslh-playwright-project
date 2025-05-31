import { Page } from '@playwright/test';


export class HomePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo() {
        await this.page.goto('/');
    }
}