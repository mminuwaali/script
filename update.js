require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const puppeteer = require('puppeteer');

const [app, port] = [express(), process.env.PORT || 3000];

/**
 * @description - Schedule the button click
 * @param {page} puppeteer.page - Cron time
 * 
 */
const scheduleButtonClick = async (page) => {
    console.log('Clicking on the button...');
    // Wait for the button to be enabled or close the browser after 30 seconds
    const buttonSelector = '[onclick="apireq()"]'; // Replace with the actual selector of the button
    const buttonEnabled = await page.waitForFunction(
        (selector) => !document.querySelector(selector).hasAttribute('disabled'),
        { polling: 'raf' }, buttonSelector, 30000
    );

    if (buttonEnabled) await page.click(buttonSelector);
    else return await browser.close();
};

// mminuwaali@gmail.com
(async () => {
    let browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process', '--no-zygote'],
        executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
    });
    try {
        let page = await browser.newPage();

        page.setDefaultTimeout(30000);

        // getting to the desired site
        await page.goto('https://faucetearner.org/login.php');

        // Wait for the form to be present
        await page.waitForSelector('form');

        // filling the form inputs
        await page.type('#email', 'mminuwaali');
        await page.type('#password', 'Crvd6cwJTyv8bqS');

        // Click the submit button
        await page.click('.reqbtn.btn-submit.w-100');

        // Wait for the next page to load (you may need to adjust the navigation condition)
        await page.waitForNavigation();

        const job = cron.schedule('*/20 * * * * *', async () => {
            try {
                console.log('Cron job started.');
                await scheduleButtonClick(page);
                console.log('Clicked on the claim button.');
            } catch (error) {
                console.log('Cron job stopped.', error);
                job.stop(); process.exit(1);
            }
        })
    } catch (error) {
        console.log('Something went wrong!', error);
        browser.close(); process.exit(1);
    };
})();

// mminuwaali.coding@gmail.com
(async () => {
    let browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process', '--no-zygote'],
        executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
    });
    try {
        let page = await browser.newPage();

        page.setDefaultTimeout(30000);

        // getting to the desired site
        await page.goto('https://faucetearner.org/login.php');

        // Wait for the form to be present
        await page.waitForSelector('form');

        // filling the form inputs
        await page.type('#email', 'mimi-coding');
        await page.type('#password', '?N43gbYz*B8EX3e');

        // Click the submit button
        await page.click('.reqbtn.btn-submit.w-100');

        // Wait for the next page to load (you may need to adjust the navigation condition)
        await page.waitForNavigation();

        const job = cron.schedule('*/20 * * * * *', async () => {
            try {
                console.log('Cron job started.');
                await scheduleButtonClick(page);
                console.log('Clicked on the claim button.');
            } catch (error) {
                console.log('Cron job stopped.', error);
                job.stop(); process.exit(1);
            }
        })
    } catch (error) {
        console.log('Something went wrong!', error);
        browser.close(); process.exit(1);
    };
})();

app.get('/', (_req, res) => {
    return res.status(200).json({message:'Success'});
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
