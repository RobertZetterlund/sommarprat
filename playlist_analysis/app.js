/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const fetch = require("node-fetch");

var express = require("express"); // Express web server framework
var request = require("request"); // "Request" library
var cors = require("cors");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
var fs = require("fs");

require("dotenv").config();

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = "http://localhost:8888/callback"; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

var app = express();

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

app.get("/login", function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = [
    "playlist-modify-public",
    "playlist-modify-private",
    "ugc-image-upload",
  ].join(" ");
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          //console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          "/#" +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

const fetchSpotifyPlayListItems = async (playListId, access_token) => {
  return await fetch(
    `https://api.spotify.com/v1/playlists/${playListId}/tracks?fields=${encodeURIComponent(
      "items(track(id,name,popularity,duration_ms,artists(name,id),album(release_date,id,name,images)))"
    )}&market=SE`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      if (res?.error?.status === 404) {
        throw "not found";
      } else {
        return res.items.map((item) => {
          const artists = item.track.artists.slice(0, 3);
          return {
            track: { id: item.track.id, name: item.track.name },
            duration_ms: item.track.duration_ms,
            artists: artists.map((a) => ({ name: a.name, id: a.id })),
            album: {
              id: item.track.album.id,
              name: item.track.album.name,
              img:
                item.track.album.images?.find((i) => i.height === 300)?.url ??
                item.track.album.images.at(-1)?.url ??
                undefined,
            },
            release_date: item.track.album.release_date,
            popularity: item.track.popularity,
          };
        });
      }
    });
};

app.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, async function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });

      const res_map = {};

      const filenames = await fs.promises.readdir("../playlist_creation/data/");
      for await (const filename of filenames) {
        const _content = await fs.promises.readFile(
          `../playlist_creation/data/${filename}`
        );
        const episodes = await JSON.parse(_content);
        const year = filename.split(".")[0];
        fs.promises.mkdir(`./data/${year}`);

        for await (const episode of episodes) {
          const { playlistId } = episode;
          const tracks = await fetchSpotifyPlayListItems(
            playlistId,
            access_token
          );
          const json = JSON.stringify({ ...episode, tracks });
          fs.writeFile(`./data/${year}/${playlistId}.json`, json, "utf8", () =>
            console.info("Finished:", playlistId)
          );
        }
      }
    }
  });
});

console.log("Listening on 8888");
app.listen(8888);
