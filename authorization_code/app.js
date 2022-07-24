/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const fetch = require("node-fetch");
const xml2js = require("xml2js");

var express = require("express"); // Express web server framework
var request = require("request"); // "Request" library
var cors = require("cors");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");

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

const fetchSRScheduling = async (year = 2021) => {
  let episodes = [];
  await fetch(
    `https://api.sr.se/api/v2/episodes/index?programid=2071&fromdate=${year}-06-25&todate=${year}-08-21&size=100`
  )
    .then((res) => res.text())
    .then((xml) => {
      xml2js.parseString(xml, (err, res) => {
        if (err) throw err;
        else {
          episodes = res.sr.episodes.map(({ episode: episodesWrapper }) =>
            episodesWrapper.map((episode) => {
              let title = episode.title[0];
              // add trailing s if not exist
              title = title[title.length - 1] === "s" ? title : title + "s";
              return {
                title,
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

const fetchSRTracks = async (date) => {
  let tracks = [];
  // Sommarprat actually starts at 13 to 14:30, but offset makes it 11 to 12:30
  await fetch(
    `https://api.sr.se/api/v2/playlists/getplaylistbychannelid?id=132&startdatetime=${date}T11:00:01Z&enddatetime=${date}T12:30:00Z`
  )
    .then((res) => res.text())
    .then((xml) => {
      xml2js.parseString(xml, (err, res) => {
        if (err) throw err;
        else {
          tracks = res.songlist.song.map(({ title, artist }) => ({
            title: title[0],
            artist: artist[0].split(",")[0],
          }));
        }
      });
    });
  return tracks;
};

const fetchSpotifyTrack = async (
  SRTrack = { artist: "Lisa ekdahl", title: "Vem Vet" },
  access_token
) => {
  const { artist, title } = SRTrack;
  return await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      artist
    )}%20${encodeURIComponent(title)}&type=track&market=SE&limit=1`,
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
        return res;
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

      const year = 2021;
      const episodes = await fetchSRScheduling(year);

      episodes[0].forEach(async (episode, index) => {
        // since spotify image uploads is a bit iffy, lets wait a bit between each iteration
        setTimeout(async () => {
          const { title, imageurl, date } = episode;
          const trackIds = [];
          const SRTracks = await fetchSRTracks(date);

          for (const track of SRTracks) {
            await fetchSpotifyTrack(track, access_token)
              .then((res) => {
                const item = res.tracks.items[0];
                if (item) {
                  const id = item.id;
                  // ignore sommar,sommar,sommar
                  if (id !== "4OWOm8ol4P3uUT81eyRZxE") trackIds.push(id);
                }
              })
              //consider adding missing tracks to description
              // `Not included: ${title}`
              .catch(() => undefined);
          }

          if (trackIds.length === 0) {
            return;
          }
          // create the playlist
          const playlist = await fetch(
            "https://api.spotify.com/v1/users/r_zetterlund/playlists",
            {
              body: JSON.stringify({
                name: `${title} Sommarprat ${year}`,
                public: true,
                description: "",
              }),
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
              },
              method: "POST",
            }
          ).then((res) => res.json());

          const playlistId = playlist.id;

          const trackUris = trackIds.map(
            (trackId) => `spotify:track:${trackId}`
          );

          // add songs to playlist
          await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({
                uris: trackUris,
              }),
            }
          ).then((res) => res.json());

          console.info(`title: ${title}, id: ${playlistId}`);

          const base64image = await urlToBase64(imageurl);

          // upload image to playlist
          await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/images`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
              },
              method: "PUT",
              body: base64image,
            }
          );
        }, index * 60000);
      });
    }
  });
});

console.log("Listening on 8888");
app.listen(8888);

const axios = require("axios");
// fetch the image from SR, download it and base64 encode it
const urlToBase64 = async (
  url = "https://static-cdn.sr.se/images/2071/383baf9c-54a2-48f0-bf70-2ed1c20e77a7.jpg?preset=api-default-square"
) => {
  const image = await axios.get(url, { responseType: "arraybuffer" });
  let raw = Buffer.from(image.data).toString("base64");
  return raw;
};
