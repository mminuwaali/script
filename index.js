require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');

const [app, port] = [express(), process.env.PORT || 3000];

app.get('/', async (_req, res) => {
    try {
        res.status(200).json({ message: 'Successfully logged in.' });

        // Launch the browser
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process', '--no-zygote'],
            executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
        });
        const page = await browser.newPage();
        console.log('Browser launched');

        page.setDefaultTimeout(30000);

        // Navigate to the website
        await page.goto('https://faucetearner.org/login.php');
        console.log('Navigated to the website');

        // Wait for the form to be present
        await page.waitForSelector('form');
        console.log('Form is present');

        // Type email and password
        await page.type('#email', 'mminuwaali'); // Replace 'yourEmail' with your actual email
        await page.type('#password', 'Crvd6cwJTyv8bqS'); // Replace 'yourPassword' with your actual password
        console.log('Email and password entered.');

        // Click the submit button
        await page.click('.reqbtn.btn-submit.w-100');
        console.log('Submit button clicked.');

        // Wait for the next page to load (you may need to adjust the navigation condition)
        await page.waitForNavigation();
        console.log('Successfully logged in.');

        // Wait for the button to be enabled or close the browser after 30 seconds
        const buttonSelector = '[onclick="apireq()"]'; // Replace with the actual selector of the button
        const buttonEnabled = await page.waitForFunction(
            (selector) => !document.querySelector(selector).hasAttribute('disabled'),
            { polling: 'raf' }, // Use 'raf' for smoother polling
            buttonSelector,
            30000
        );
        console.log('Button enabled.');

        if (buttonEnabled) await page.click(buttonSelector);
        else return await browser.close();
        console.log('Button clicked.');

        // Navigate to the dashboard
        await page.goto('https://faucetearner.org/dashboard.php');
        console.log('going to the dashboard');


        let balanceElementTag = await page.waitForSelector('.card.p-3.mb-2 .text-start .fs-4');

        let elementTextContent = await balanceElementTag.getProperty('textContent')
        let elementText = await elementTextContent.jsonValue();
        console.log('Balance:', elementText);

        // get the text content of the balanceElement
        // await page.waitForSelector('div:contains("Total Balance:") + b');
        // console.log('Balance is present.');

        // await page.goto('https://faucetearner.org/dashboard.php');
        // console.log('Navigated to the dashboard.');

        // get the content of a b tag that is after a div tag with the content "Total Balance:"
        // const balance = await page.evaluate(() => {
        //     const element = document.querySelector('div:contains("Total Balance:") + b');
        //     return element ? element.innerText : null;
        // });
        // console.log('Balance:', balance);


        // Close the browser
        await browser.close();
        console.log('Browser closed.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
