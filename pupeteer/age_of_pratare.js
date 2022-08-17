const pup = require("puppeteer");

async function getDateOfBirthOfPerson(listOfPersons) {
  const browser = await pup.launch();

  const dobs = [];
  let idx = 0;
  for (const host of listOfPersons) {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US",
    });

    await page.goto(
      `https://www.google.com/search?q=${encodeURIComponent(
        host
      )}+date+of+birth`,
      { waitUntil: "domcontentloaded" }
    );

    // Get the first div tagged with containing the dob of the person.
    const content = await page.$(
      'div[data-attrid="kc:/people/person:date of birth"]'
    );

    if (!content) {
      dobs.push(null);
      continue;
    }

    // Get the div that contains the dob from the content, based on an arbitrary class.
    const innerText = await content.$eval(".Z0LcW", (node) => node.innerText);
    if (!innerText) {
      dobs.push(null);
      continue;
    }
    // format is "Day Month Year"

    const text = innerText.split(" ");
    const [_day, _month, year] = text;
    const day = _day.length === 1 ? "0" + _day : _day;
    const month = monthToNumeric[_month];
    dobs.push(`${year}-${month}-${day}`);

    page.close();
  }

  return dobs;
}

// Debugging
/*const hosts = [
  "Zara Larsson",
  "Benjamin Ingrosso",
  "Hans Rosenfeldt",
  "Lars Ulvenstam",
];
getDateOfBirthOfPerson(hosts).then(console.info);
*/

// swedish month to numeric, blergh.
const monthToNumeric = {
  januari: "01",
  februari: "02",
  mars: "03",
  april: "04",
  maj: "05",
  juni: "06",
  juli: "07",
  augusti: "08",
  september: "09",
  oktober: "10",
  november: "11",
  december: "12",
};

module.exports = {
  getDateOfBirthOfPerson,
};
