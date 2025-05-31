import { test } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { BookDemo } from '../pages/bookDemoPage';


test.describe('Book a Demo Page Navigation and Form Fields Interactability', () => {

    let homePage: HomePage;
    let bookDemoPage: BookDemo;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        bookDemoPage = new BookDemo(page);
        await homePage.navigateTo();
    });

    test('User is redirected to the Book a Demo page and form fields are present and interactable', async () => {
        await homePage.clickBookADemo();
        await bookDemoPage.verifyRedirectedToBookADemoPage();
        await bookDemoPage.verifyFormFieldsAreInteractable();
    });

});
