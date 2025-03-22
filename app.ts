const puppeteer = require('puppeteer');

type Job = {
    title: string;
    company: string;
    skills: string[];
}

export async function run(){
    const url = "https://programathor.com.br/jobs";

    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url)

    const content = await page.evaluate(() => {
        const blocks = document.querySelectorAll(".cell-list");
        const array = [...blocks].slice(0,4);

        return array.map((item) => ({
            title: item.querySelector(".text-24.line-height-30")?.textContent,
            company: item.querySelector(".fa.fa-briefcase")?.parentElement?.textContent
        }));
    });

    await browser.close();

    return {
        statusCode: 200,
        body: JSON.stringify({content}),
        headers: {"Content-Type": "application/json"}
    };
}