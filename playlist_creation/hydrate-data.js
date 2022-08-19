// We need to include the episode url too, so this hydrates the data already stored.

const fs = require("fs");
const fetch = require("node-fetch");
const xml2js = require("xml2js");

const fetchSRScheduling = async (date = "2005-06-25") => {
  let episodes = [];

  // Okay, so we need to offset this by one, so take the date, add one day, then make that the todate
  date = new Date(date);
  date.setDate(date.getDate() + 1);

  date = date.toISOString().split("T")[0];

  await fetch(
    `https://api.sr.se/api/v2/episodes/index?programid=2071&todate=${date}&size=1`
  )
    .then((res) => res.text())
    .then((xml) => {
      xml2js.parseString(xml, (err, res) => {
        if (err) throw err;
        else {
          episodes = res.sr.episodes.map(({ episode: episodesWrapper }) =>
            episodesWrapper.map((episode) => {
              let title = episode.title[0];
              // Multiple hosts might have their name and then the year of the talk (john doe 2005),
              // so remove digits (we'll add it after when we want to).
              title = title.replace(/ \b\d+\b/, "");
              return {
                title,
                episodeUrl: episode.url[0],
                imageurl: episode.imageurl[0],
                date: new Date(episode.publishdateutc[0])
                  .toISOString()
                  .split("T")[0],
              };
            })
          );
        }
      });
    });
  return episodes;
};

(async () => {
  const years = [...Array(2022 - 2005).keys()].map((n) => n + 2005);

  for (const year of years) {
    let rawdata = await fs.readFileSync(`./data/${year}.json`);
    let episodes = await JSON.parse(rawdata);

    const newJson = await Promise.all(
      episodes.map(async (ep) => {
        const newData = await fetchSRScheduling(ep.date);
        return { episodeUrl: newData[0][0].episodeUrl, ...ep };
      })
    );

    fs.writeFile(
      `./hydrated_data/${year}.json`,
      JSON.stringify(newJson),
      "utf8",
      () => console.info("Finished:", year)
    );
  }
})();
