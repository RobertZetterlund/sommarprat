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

// artistId -> artist name
const artistMap = {};
// ablumId -> album
const albumMap = {};
// trackId -> track name
const trackMap = {};

(async () => {
  const filenames = await fs.promises.readdir("./data/");

  const years = filenames.map((file) => parseInt(file.split(".")[0])).sort();

  for await (const year of years) {
    const playlists = await fs.promises.readdir(`./data/${year}`);

    let sum_duration = 0;
    let sum_popularity = 0;
    let sum_song_amount = 0;

    for await (const playlistId of playlists) {
      const _content = await fs.promises.readFile(
        `./data/${year}/${playlistId}`
      );
      const playlist = await JSON.parse(_content);
      sum_song_amount += playlist.tracks.length;
      for (const spotifyTrack of playlist.tracks) {
        const { track, album, artists, duration_ms, popularity, release_date } =
          spotifyTrack;
        sum_duration += duration_ms;
        sum_popularity += popularity;

        incrementCount(albumCount, album.id);
        albumMap[album.id] = { album, artist: artists[0] };
        incrementCount(trackCount, track.id);
        trackMap[track.id] = { album, artists, track };
        for (const artist of artists) {
          incrementCount(artistCount, artist.id);
          artistMap[artist.id] = artist;
        }

        if (release_date) {
          const release_year = parseInt(new Date(release_date).getFullYear());
          if (release_year < year) {
            // Put release year into box.
            incrementCount(yearCount, release_year);

            // Calculate age of hosts when song was released.
            if (playlist.dob) {
              const dobYear = parseInt(new Date(playlist.dob).getFullYear());
              const age = release_year - dobYear;
              incrementCount(ageBox, age);
            }
            // Calculate recency compared to episode broadcast.
            const diff = year - release_year;
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

    yearSnapShots[year] = {
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

  // Based off latest yearSnapShot, we can filter out fluff.
  const last_year_num = parseInt(Object.keys(yearSnapShots).sort().at(-1));
  const last_year = yearSnapShots[last_year_num];

  const idsObj = {};

  // identify which ids to delete
  for (const key of Object.keys(last_year)) {
    // countBox or artistBox...
    const entry = last_year[key];
    if (entry instanceof Object && entry) {
      // find top ten entries
      const idsToRemove = [];
      for (const [keyId] of Object.entries(entry)
        .sort(([, valueA], [, valueB]) => valueB - valueA)
        .slice(10)) {
        idsToRemove.push(keyId);
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

  const json = JSON.stringify(yearSnapShots, undefined, 2);

  // Now transpose snapshots into object which has data: {count: {[year]: count}}[]
  const albums = Object.keys(last_year.albumCount).reduce((acc, id) => {
    const year_data = years.reduce(
      (acc, year) => ({
        [year]: yearSnapShots[year].albumCount[id] ?? 0,
        ...acc,
      }),
      {}
    );

    const track_meta = albumMap[id];

    return { [id]: { ...track_meta, count: year_data }, ...acc };
  }, {});

  await fs.promises.writeFile(
    `./stats/albums.json`,
    JSON.stringify(albums, undefined, 2),
    "utf8"
  );

  await fs.promises.writeFile(`./stats/all.json`, json, "utf8");

  // Now transpose snapshots into object which has data: {count: {[year]: count}}[]
  const artists = Object.keys(last_year.artistCount).reduce((acc, id) => {
    const year_data = years.reduce(
      (acc, year) => ({
        [year]: yearSnapShots[year].artistCount[id] ?? 0,
        ...acc,
      }),
      {}
    );

    const track_meta = artistMap[id];

    return { [id]: { ...track_meta, count: year_data }, ...acc };
  }, {});

  await fs.promises.writeFile(
    `./stats/artists.json`,
    JSON.stringify(artists, undefined, 2),
    "utf8"
  );

  // Now transpose snapshots into object which has data: {count: {[year]: count}}[]
  const tracks = Object.keys(last_year.trackCount).reduce((acc, id) => {
    const year_data = years.reduce(
      (acc, year) => ({
        [year]: yearSnapShots[year].trackCount[id] ?? 0,
        ...acc,
      }),
      {}
    );

    const track_meta = trackMap[id];

    return { [id]: { ...track_meta, count: year_data }, ...acc };
  }, {});

  await fs.promises.writeFile(
    `./stats/tracks.json`,
    JSON.stringify(tracks, undefined, 2),
    "utf8"
  );

  const year_data = Object.keys(yearSnapShots).map((year) => ({
    [year]: yearSnapShots[year].yearCount,
  }));
  await fs.promises.writeFile(
    "./stats/years.json",
    JSON.stringify(year_data),
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
