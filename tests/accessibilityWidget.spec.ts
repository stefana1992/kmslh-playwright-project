import { test } from '@playwright/test';
import { AccessibilityWidget } from '../pages/accessibilityWidget';
import { HomePage } from '../pages/homePage';

test.describe('Accessibility Widget - Default Toggle States and Highlight Links Toggle Behavior', () => {
    let homePage: HomePage;
    let accessibilityWidget: AccessibilityWidget;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        accessibilityWidget = new AccessibilityWidget(page);
        await homePage.navigateTo();
    });

    test('Validate default toggle states and verify UI changes when toggling Highlight Links', async () => {
        await accessibilityWidget.openAccessibilityToolbar();
        await accessibilityWidget.verifyDefaultToggleStates();
        await accessibilityWidget.toggleHighlightLinksOn();
        await accessibilityWidget.assertStylesChanged();
        await accessibilityWidget.toggleHighlightLinksOff();
        await accessibilityWidget.assertStylesReturnedToOriginal();
    });
}
);