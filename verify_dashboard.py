import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Grant dummy permissions
        context = await browser.new_context(
            viewport={"width": 375, "height": 812},
            permissions=['geolocation'],
            storage_state={
                "cookies": [],
                "origins": [
                    {
                        "origin": "http://localhost:5173",
                        "localStorage": [
                            {"name": "linefree_user", "value": "{\"uid\":\"test-uid\",\"phone\":\"+919999999999\"}"},
                            {"name": "linefree_role", "value": "barber"}
                        ]
                    }
                ]
            }
        )
        page = await context.new_page()

        try:
            await page.goto('http://localhost:5173/barber')
            await page.wait_for_timeout(5000)
            await page.screenshot(path='screenshot_dashboard_auth.png')
            print("Screenshot saved to screenshot_dashboard_auth.png")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            await browser.close()

asyncio.run(main())
