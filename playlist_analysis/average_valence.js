var fs = require("fs");

function readFiles(dirname, onFileContent, onError) {
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

readFiles("./playlists_meta/", (filename, content) => {
  const json = JSON.parse(content);
  const tracks_length = json.tracks.length;
  let sum_valence = 0;
  json.tracks.forEach((track) => {
    sum_valence += track.valence;
  });

  let sum_popularity = 0;
  json.tracks.forEach((track) => {
    sum_popularity += track.popularity;
  });

  console.info(
    json.title,
    "valence:",
    (sum_valence / tracks_length).toFixed(2),
    "popularity:",
    (sum_popularity / tracks_length).toFixed(0)
  );
});
