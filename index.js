const puppeteer = require('puppeteer');
const fs = require('fs');

// Start Function that will take url and return the data
const start = async (url) => {
    // will open a new browser window
    const browser = await puppeteer.launch();

    // will open a new page
    const page = await browser.newPage();

    // will navigate to the url
    await page.goto(url);

    // Will retrieve the reviews from the page { Name, Rating, Reviews }
    const reviews = await page.evaluate(() => {
        // Retrving The Name Of Reviewer
        let names = Array.from(document.querySelectorAll('#customerReviews > div > div.leftCol > dl.reviewer > dd:nth-child(2)'))
            .map(name => name.innerText);
        
        // Retrving The Dates Of Review
        let dates = Array.from(document.querySelectorAll('#customerReviews > div > div.leftCol > dl.reviewer > dd:nth-child(4)'))
            .map(date => date.innerText);

        // Retrving The Ratings Of Review
        let overallRatings = Array.from(document.querySelectorAll('#customerReviews > div > div.leftCol > dl.itemReview > dd:nth-child(2) > div > strong'))
            .map(rating => rating.innerText);
        
        // Retriving The Review Headings
        let reviewHeadings = Array.from(document.querySelectorAll('.review > .rightCol  h6'))
            .map(heading => heading.innerText);
        
        // Retrving The Review Text
        let reviews = Array.from(document.querySelectorAll('.review > .rightCol  p'))
            .map(review => review.innerText);
        
        // return Array of Objects with all the data Related To Single Review
        return names.map((name, index) => ({
            name,
            date: dates[index],
            overallRating: overallRatings[index],
            heading: reviewHeadings[index],
            review: reviews[index]
        }));
    });

    // console.log(reviews);

    // Will write the reviews to a file
    fs.writeFile('reviews.json', JSON.stringify(reviews), err => {
        if (err) throw err;
        console.log('File Saved');
    });


    await browser.close();
}

// Taking the url from the command line
const url = process.argv[2];

start(url);