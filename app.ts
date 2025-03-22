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

        return array.map((item) => {
            const title = item.querySelector(".cell-list-content h3.text-24.line-height-30")?.textContent?.trim();
            const company = item.querySelector(".cell-list-content-icon .fa-briefcase")?.parentElement?.textContent?.trim();

            const skillElements = item.querySelectorAll(".cell-list-content .tag-list.background-gray");
            const skills = Array.from(skillElements).map((skill) => skill.textContent?.trim());

            return {
                title,
                company,
                skills,
            };
        });
    });

    await browser.close();

    return {
        statusCode: 200,
        body: JSON.stringify({content}),
        headers: {"Content-Type": "application/json"}
    };
}