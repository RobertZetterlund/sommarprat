var fs = require("fs");

// trackId -> number
let trackCount = {};
// artistId -> number
let artistCount = {};
// albumId -> number
let albumCount = {};

// year -> number
let yearCount = {};

/** How recently was the song released? */
let recencyBox = {};

/** What age was host when song was released */
let ageBox = {};

// year -> albumId,artistId,trackId
const yearSnapShots = {};

const incrementCount = (box, id) => (id in box ? box[id]++ : (box[id] = 1));

(async () => {
  const filenames = await fs.promises.readdir("./data/");

  for await (const _year of filenames) {
    const ep_year = parseInt(_year);
    const playlists = await fs.promises.readdir(`./data/${ep_year}`);

    let sum_duration = 0;
    let sum_popularity = 0;
    let sum_song_amount = 0;

    for await (const playlistId of playlists) {
      const _content = await fs.promises.readFile(
        `./data/${ep_year}/${playlistId}`
      );
      const playlist = await JSON.parse(_content);
      sum_song_amount += playlist.tracks.length;
      for (const track of playlist.tracks) {
        const {
          trackId,
          albumId,
          artistId,
          duration_ms,
          popularity,
          release_date,
        } = track;
        sum_duration += duration_ms;
        sum_popularity += popularity;

        incrementCount(trackCount, trackId);
        incrementCount(albumCount, albumId);

        for (const aId of artistId) {
          incrementCount(artistCount, aId);
        }
        if (release_date) {
          const release_year = parseInt(new Date(release_date).getFullYear());
          if (release_year < ep_year) {
            // Put release year into box.
            incrementCount(yearCount, release_year);

            // Calculate age of hosts when song was released.
            if (playlist.dob) {
              const dobYear = parseInt(new Date(playlist.dob).getFullYear());
              const age = release_year - dobYear;
              incrementCount(ageBox, age);
            }
            // Calculate recency compared to episode broadcast.
            const diff = ep_year - release_year;
            if (diff >= 0) {
              incrementCount(recencyBox, diff);
            }
          }
        }
      }
    }

    const avg_duration = sum_duration / sum_song_amount;
    const avg_popularity = sum_popularity / sum_song_amount;
    const avg_song_amount = sum_song_amount / playlists.length;

    yearSnapShots[ep_year] = {
      trackCount: { ...trackCount },
      artistCount: { ...artistCount },
      albumCount: { ...albumCount },
      yearCount: { ...yearCount },
      recencyBox: { ...recencyBox },
      ageBox: { ...ageBox },
      avg_duration,
      avg_popularity,
      avg_song_amount,
    };
  }

  // Based off latest yearSnapShot, we can filter out singular apperances of ids
  const last_year_num = parseInt(Object.keys(yearSnapShots).sort().at(-1));
  const last_year = yearSnapShots[last_year_num];

  const idsObj = {};

  // identify which ids to delete
  for (const key of Object.keys(last_year)) {
    const entry = last_year[key];
    if (entry instanceof Object && entry) {
      // find all entries that have less than X count.
      const idsToRemove = [];
      for (const [keyId, value] of Object.entries(entry)) {
        if (value <= 10) {
          idsToRemove.push(keyId);
        }
      }
      idsObj[key] = idsToRemove;
    }
  }

  // Do the deletion process
  for (const [year, yearBox] of Object.entries(yearSnapShots)) {
    for (const key of Object.keys(yearBox)) {
      const entry = yearBox[key];
      if (entry instanceof Object && entry) {
        const idsToRemove = idsObj[key];
        for (const id of idsToRemove) {
          delete yearSnapShots[year][key][id];
        }
      }
    }
  }

  const json = JSON.stringify(yearSnapShots);

  await fs.promises.writeFile(`./stats/all.json`, json, "utf8");

  const albums = Object.keys(yearSnapShots).map((year) => ({
    [year]: yearSnapShots[year].albumCount,
  }));

  await fs.promises.writeFile(
    "./stats/albums.json",
    JSON.stringify(albums),
    "utf-8"
  );

  const artists = Object.keys(yearSnapShots).map((year) => ({
    [year]: yearSnapShots[year].artistCount,
  }));
  await fs.promises.writeFile(
    "./stats/artists.json",
    JSON.stringify(artists),
    "utf-8"
  );

  const tracks = Object.keys(yearSnapShots).map((year) => ({
    [year]: yearSnapShots[year].trackCount,
  }));
  await fs.promises.writeFile(
    "./stats/tracks.json",
    JSON.stringify(tracks),
    "utf-8"
  );

  const years = Object.keys(yearSnapShots).map((year) => ({
    [year]: yearSnapShots[year].yearCount,
  }));
  await fs.promises.writeFile(
    "./stats/years.json",
    JSON.stringify(years),
    "utf-8"
  );

  const recency = Object.keys(yearSnapShots).map((year) => ({
    [year]: yearSnapShots[year].recencyBox,
  }));
  await fs.promises.writeFile(
    "./stats/recency.json",
    JSON.stringify(recency),
    "utf-8"
  );

  const ages = Object.keys(yearSnapShots).map((year) => ({
    [year]: yearSnapShots[year].ageBox,
  }));

  await fs.promises.writeFile(
    "./stats/ages.json",
    JSON.stringify(ages),
    "utf-8"
  );

  const avg_duration = Object.keys(yearSnapShots).map((year) => ({
    [year]: yearSnapShots[year].avg_duration,
  }));
  await fs.promises.writeFile(
    "./stats/duration.json",
    JSON.stringify(avg_duration),
    "utf-8"
  );
  const avg_popularity = Object.keys(yearSnapShots).map((year) => ({
    [year]: yearSnapShots[year].avg_popularity,
  }));
  await fs.promises.writeFile(
    "./stats/popularity.json",
    JSON.stringify(avg_popularity),
    "utf-8"
  );
  const avg_song_amount = Object.keys(yearSnapShots).map((year) => ({
    [year]: yearSnapShots[year].avg_song_amount,
  }));
  await fs.promises.writeFile(
    "./stats/songAmount.json",
    JSON.stringify(avg_song_amount),
    "utf-8"
  );

  console.info("fin");
})();
