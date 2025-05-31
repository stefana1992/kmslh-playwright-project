import { expect, Locator, Page } from '@playwright/test';
import { bookADemoForm } from '../data/book-demo-form';

export class BookDemo {

    private page: Page;
    private firstNameInput: Locator;
    private lastNameInput: Locator;
    private professionalEmailInput: Locator;
    private phoneNumberInput: Locator;
    private jobTitleInput: Locator;
    private countryOrRegionSelector: Locator;
    private messageTextarea: Locator;
    private bookADemoButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = this.page.locator('input[name="firstname"]');
        this.lastNameInput = this.page.locator('input[name="lastname"]');
        this.professionalEmailInput = this.page.locator('input[name="email"]');
        this.phoneNumberInput = this.page.locator('input[name="phone"]');
        this.jobTitleInput = this.page.locator('input[name="jobtitle"]');
        this.countryOrRegionSelector = this.page.locator('select[name="country"]');
        this.messageTextarea = this.page.locator('textarea[name="message"]');
        this.bookADemoButton = page.locator('input[type="submit"]');
    }

    async verifyRedirectedToBookADemoPage() {
        await expect(this.page).toHaveURL(/.*book-a-demo/, { timeout: 15000 });
    }

    async verifyFormFieldsAreInteractable() {
        const fields = [
            { field: this.firstNameInput, key: 'firstName' },
            { field: this.lastNameInput, key: 'lastName' },
            { field: this.professionalEmailInput, key: 'professionalEmail' },
            { field: this.phoneNumberInput, key: 'phoneNumber' },
            { field: this.jobTitleInput, key: 'jobTitle' },
            { field: this.countryOrRegionSelector, key: 'country' },
            { field: this.messageTextarea, key: 'message' },
        ];

        for (const { field, key } of fields) {
            await expect(field).toBeVisible();
            await expect(field).toBeEnabled();

            if (key === 'country') {
                await field.selectOption({ label: bookADemoForm.validData[key] });
            } else {
                await field.fill(bookADemoForm.validData[key]);
            }
        }

        await expect(this.bookADemoButton).toBeVisible();
        await expect(this.bookADemoButton).toBeEnabled();
    }
}
