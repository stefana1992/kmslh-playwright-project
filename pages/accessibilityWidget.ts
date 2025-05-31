import { Locator, Page, expect } from '@playwright/test';

type StyleProps = {
    backgroundColor: string;
    textDecoration: string;
    boxShadow: string;
    borderBottom: string;
    tagName?: string;
    innerText?: string;
};

export class AccessibilityWidget {
    private page: Page;
    private accessibilityIcon: Locator;
    private toolbarModule: Locator;
    private highlightLinksLabel: Locator;
    private toggles: Locator[];

    private trackedElements: Locator[] = [];
    private originalStyles: StyleProps[] = [];
    private toggledStyles: StyleProps[] = [];
    private revertedStyles: StyleProps[] = [];

    constructor(page: Page) {
        this.page = page;
        this.accessibilityIcon = page.locator('#acwp-toolbar-btn');
        this.toolbarModule = page.locator('#acwp-toolbar-module');
        this.highlightLinksLabel = page.locator('label[for="acwp-toggler-underline"]');

        // Array of toggle checkboxes to verify their states
        this.toggles = [
            page.locator('#acwp-toggler-keyboard'),
            page.locator('#acwp-toggler-animations'),
            page.locator('#acwp-toggler-contrast'),
            page.locator('#acwp-toggler-incfont'),
            page.locator('#acwp-toggler-decfont'),
            page.locator('#acwp-toggler-readable'),
            page.locator('#acwp-toggler-marktitles'),
            page.locator('#acwp-toggler-underline'),
        ];


    }

    async navigateTo(): Promise<void> {
        await this.page.goto('/');
    }

    // Open the accessibility toolbar and ensure it is visible
    async openAccessibilityToolbar(): Promise<void> {
        await this.accessibilityIcon.click();
        await this.toolbarModule.waitFor({ state: 'visible' });
        // Click outside to possibly trigger any UI update
        await this.page.mouse.click(0, 0);
    }


    async verifyDefaultToggleStates() {
        for (const toggle of this.toggles) {
            const id = await toggle.getAttribute('id');
            const label = this.page.locator(`label[for="${id}"]`);

            await expect(toggle).not.toBeChecked();  // Toggle should not be checked by default
            await expect(label).toBeVisible();   // Label should be visible
            await expect(label).toBeEnabled();  // Label should be enabled (clickable)
        }
    }

    // Capture all <a> and <button> elements along with their initial styles before toggling
    private async captureElementsAndStyles(): Promise<void> {
        this.trackedElements = await this.page.locator('a, button').all();

        // For each element, retrieve the computed styles and store relevant properties
        this.originalStyles = await Promise.all(
            this.trackedElements.map(async (el) => {
                const style = await el.evaluate((node) => {
                    const cs = window.getComputedStyle(node);
                    return {
                        backgroundColor: cs.backgroundColor,
                        textDecoration: cs.textDecoration,
                        boxShadow: cs.boxShadow,
                        borderBottom: cs.borderBottom,
                        tagName: node.tagName,
                        innerText: (node as HTMLElement).innerText
                    };
                });
                return style;
            })
        );
    }

    // Capture current styles of tracked elements (used after toggle on/off)
    private async captureCurrentStyles(): Promise<StyleProps[]> {
        return await Promise.all(
            this.trackedElements.map(async (el) => {
                return await el.evaluate((node) => {
                    const cs = window.getComputedStyle(node);
                    return {
                        backgroundColor: cs.backgroundColor,
                        textDecoration: cs.textDecoration,
                        boxShadow: cs.boxShadow,
                        borderBottom: cs.borderBottom,
                        tagName: node.tagName,
                        innerText: (node as HTMLElement).innerText
                    };
                });
            })
        );
    }

    // Click to enable the Highlight Links toggle and wait for UI change indication
    async toggleHighlightLinksOn(): Promise<void> {
        await this.captureElementsAndStyles();  // Capture styles before toggle
        await this.highlightLinksLabel.click();
        // Wait until the body element has the class indicating highlight links are active
        await this.page.waitForFunction(() => document.body.classList.contains('acwp-underline'));

        this.toggledStyles = await this.captureCurrentStyles(); // Capture styles after toggle ON
    }

    // Click to disable the Highlight Links toggle and wait for UI to revert
    async toggleHighlightLinksOff(): Promise<void> {
        await this.highlightLinksLabel.click();
        // Wait until the highlight class is removed from the body
        await this.page.waitForFunction(() => !document.body.classList.contains('acwp-underline'));

        this.revertedStyles = await this.captureCurrentStyles();  // Capture styles after toggle OFF
    }

    // Assert that styles have actually changed after toggling ON Highlight Links
    async assertStylesChanged(): Promise<void> {
        const styleKeys: (keyof StyleProps)[] = ['backgroundColor', 'textDecoration', 'boxShadow', 'borderBottom'];

        for (let i = 0; i < this.originalStyles.length; i++) {
            const original = this.originalStyles[i];
            const toggled = this.toggledStyles[i];

            if (!toggled) {
                console.warn(`No toggled style for element ${i}, skipping assertion`);
                continue;
            }

            const changes: string[] = [];

            // Check for differences in each style property
            for (const key of styleKeys) {
                if (original[key] !== toggled[key]) {
                    changes.push(`${key}: "${original[key]}" → "${toggled[key]}"`);
                }
            }

            const tagName = toggled.tagName;
            const innerText = toggled.innerText?.trim().slice(0, 50) || 'NO TEXT';

            if (changes.length > 0) {
                console.log(`[${tagName}] "${innerText}" (Element ${i}) styles changed:
  ${changes.join('\n  ')}`);
            } else {
                console.error(`[${tagName}] "${innerText}" (Element ${i}) styles did NOT change`);
            }

            // Fail the test if no styles have changed for this element
            expect(changes.length, `Element ${i} should have style changes`).toBeGreaterThan(0);
        }
    }
    // Assert that styles return to their original values after toggling OFF Highlight Links
    async assertStylesReturnedToOriginal(): Promise<void> {
        const styleKeys: (keyof StyleProps)[] = ['backgroundColor', 'textDecoration', 'boxShadow', 'borderBottom'];

        for (let i = 0; i < this.originalStyles.length; i++) {
            const original = this.originalStyles[i];
            const reverted = this.revertedStyles[i];

            if (!reverted) {
                console.warn(`No reverted style for element ${i}, skipping assertion`);
                continue;
            }

            // Check for any style mismatches after revert
            const mismatches: string[] = [];

            for (const key of styleKeys) {
                if (original[key] !== reverted[key]) {
                    mismatches.push(`${key}: "${original[key]}" → "${reverted[key]}"`);
                }
            }

            const tagName = reverted.tagName || 'UNKNOWN';
            const innerText = reverted.innerText?.trim().slice(0, 50) || 'NO TEXT';

            if (mismatches.length === 0) {
                console.log(`[${tagName}] "${innerText}" (Element ${i}) styles successfully restored`);
            } else {
                console.error(`[${tagName}] "${innerText}" (Element ${i}) styles not restored:
  ${mismatches.join('\n  ')}`);
            }

            // Fail the test if styles are not restored correctly
            expect(mismatches.length, `Element ${i} styles should be restored`).toBe(0);
        }
    }
}
