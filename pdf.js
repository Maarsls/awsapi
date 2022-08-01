const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

module.exports = {
    createPdfInBuffer: async () => {
        var options = {
            width: "794px",
            height: "1123px",
            //format: 'a4',
            //width: '1230px',
            // headerTemplate: "<p></p>",
            // footerTemplate: "<p></p>",
            displayHeaderFooter: false,
            margin: {
                top: "10px",
                bottom: "30px"
            },
            preferPCSSPageSize: true,
            // path: 'resultneu.pdf'
        }

        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome-stable',
            args: ['--no-sandbox'],
            headless: true
        });

        var page = await browser.newPage();
        await page.goto(`https://api.tyvent.at/pdf/tyvent-ticket`, { //TODO: Change url to effective route
            waitUntil: 'networkidle0'
        });



        const pdf = await page.pdf(options);
        await browser.close();
        return pdf;
    },
};