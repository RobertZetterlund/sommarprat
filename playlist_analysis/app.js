/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const fetch = require("node-fetch");
const { playlists } = require("./public/2021");

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
      "items(track(id,name,popularity,artists(name),album(release_date)))"
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
          return {
            trackId: item.track.id,
            name: item.track.name,
            artists: item.track.artists[0].name,
            release_date: item.track.album.release_date,
            popularity: item.track.popularity,
          };
        });
      }
    });
};

const fetchSpotifyTrackAudioValence = async (trackId, access_token) => {
  return await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res?.error?.status === 404) {
        return "ERROR";
      } else {
        return res.valence;
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

      for (const playlist of playlists) {
        const { id: playListId } = playlist;
        const tracks = await fetchSpotifyPlayListItems(
          playListId,
          access_token
        );
        res_map[playListId] = playlist;
        res_map[playListId].tracks = [];

        for (const track of tracks) {
          const { trackId } = track;
          const valence = await fetchSpotifyTrackAudioValence(
            trackId,
            access_token
          );
          if (valence !== "ERROR") {
            res_map[playListId].tracks.push({
              valence,
              ...track,
            });
          }
        }
        const json = JSON.stringify(res_map[playListId]);
        fs.writeFile(`./playlists_meta/${playListId}.json`, json, "utf8", () =>
          console.info("Finished:", res_map[playListId].title)
        );
      }
    }
  });
});

console.log("Listening on 8888");
app.listen(8888);
