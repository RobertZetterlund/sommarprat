var fs = require("fs");

async function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function (filename) {
      fs.readFile(dirname + filename, "utf-8", function (err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

/** Talker Age when song was released, negative amount if the artist was not born */
const ageBox = {};
/** How recently was the song released? */
const recencyBox = {};
/** When was the song relased */
const releaseYearBox = {};
/** Artist count */
const artistBox = {};

await readFiles("./playlists_meta/", (filename, content) => {
  const json = JSON.parse(content);
  const { tracks, born } = json;
  const length = tracks.length;
  let sum_popularity = 0;
  let sum_valence = 0;

  tracks.forEach(({ valence, popularity, release_date, artists: artist }) => {
    sum_valence += valence;
    sum_popularity += popularity;

    const release_year = new Date(release_date).getFullYear();
    if (!releaseYearBox[release_year]) releaseYearBox[release_year] = 0;
    releaseYearBox[release_year]++;

    const recency = 2021 - release_year;
    if (!recencyBox[recency]) recencyBox[recency] = 0;
    recencyBox[recency]++;

    const age_when_released = release_year - born;
    if (!ageBox[age_when_released]) ageBox[age_when_released] = 0;
    ageBox[age_when_released]++;

    if (!artistBox[artist]) artistBox[artist] = 0;
    artistBox[artist]++;
  });

  console.info(
    json.title,
    "valence:",
    (sum_valence / length).toFixed(2),
    "popularity:",
    (sum_popularity / length).toFixed(0)
  );
});

setTimeout(() => {
  console.info("ageBox", ageBox);
  console.info("recencyBox", recencyBox);
  console.info("artistBox", artistBox);
  console.info("releaseYearBox", releaseYearBox);
}, 1000);
