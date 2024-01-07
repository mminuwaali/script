const cron = require('node-cron');
const express = require('express');
const puppeteer = require('puppeteer');

const [app, port] = [express(), 3000];

async function scrapeWebsite() {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: true });
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

    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds before closing the browser

    // Close the browser
    await browser.close();
    console.log('Browser closed.');
};

const job = cron.schedule('* * * * *', () => {
    try {
        console.log('Cron job started.');
        scrapeWebsite();
    } catch (error) {
        console.error('Error executing script:', error);;
        job.stop(); process.exit(1);
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
