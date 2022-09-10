var fs = require("fs");

(async () => {
  const filenames = await fs.promises.readdir("./data/");

  const years = filenames.map((file) => parseInt(file.split(".")[0])).sort();

  for await (const year of years) {
    const playlists = await fs.promises.readdir(`./data/${year}`);

    for await (const filename of playlists) {
      const _content = await fs.promises.readFile(`./data/${year}/${filename}`);
      const playlist = await JSON.parse(_content);

      const total_popularity = playlist.tracks.reduce(
        (sum, track) => sum + track.popularity,
        0
      );
      const avg_popularity = parseFloat(
        (total_popularity / (playlist.tracks.length || 1)).toFixed(2)
      );

      const new_playlist = JSON.stringify(
        { ...playlist, popularity: avg_popularity },
        undefined,
        2
      );

      await fs.promises.writeFile(
        `./data/${year}/${filename}`,
        new_playlist,
        "utf8"
      );
    }
  }
})();
