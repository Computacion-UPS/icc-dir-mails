const { chromium } = require('playwright');
const path = require('path');

async function main() {
    const browser = await chromium.launch();

    const page = await browser.newPage({
        viewport: {
            width: 1100,
            height: 1600,
        },
        deviceScaleFactor: 2,
    });

    const htmlPath = path.resolve(__dirname, 'invitacion.html');

    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'networkidle',
    });

    await page.evaluate(async () => {
        await document.fonts.ready;

        const images = Array.from(document.images);

        await Promise.all(
            images.map((img) => {
                if (img.complete) {
                    return Promise.resolve();
                }

                return new Promise((resolve) => {
                    img.addEventListener('load', resolve, { once: true });
                    img.addEventListener('error', resolve, { once: true });
                });
            }),
        );
    });

    const card = page.locator('#email-card');

    const box = await card.boundingBox();

    if (!box) {
        throw new Error('No se encontró el elemento #email-card');
    }

    const margin = 28;

    await page.screenshot({
        path: 'invitacion-build-with-ai.png',
        type: 'png',
        clip: {
            x: Math.max(0, box.x - margin),
            y: Math.max(0, box.y - margin),
            width: box.width + margin * 2,
            height: box.height + margin * 2,
        },
    });

    await browser.close();

    console.log('Imagen generada: invitacion-build-with-ai.png');
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});