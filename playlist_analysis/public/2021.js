const playlists = [
  {
    born: 1997,
    title: "Zara Larssons",
    id: "5hnQfbOSNnqRE5rxZhTahd",
    image:
      "https://static-cdn.sr.se/images/2071/bf96888a-c000-465a-8d5d-f74bbd91fc30.jpg?preset=api-default-square",
  },
  {
    born: 1964,
    title: "Hans Rosenfeldts",
    id: "6Kc4o6dBHRsCfTUSSxmcI9",
    image:
      "https://static-cdn.sr.se/images/2071/7b6bfb86-757c-4d22-9258-2bfff9de718c.jpg?preset=api-default-square",
  },
  {
    born: 1984,
    id: "4IaE74JdOtXxXMwcaRxTn4",
    image:
      "https://static-cdn.sr.se/images/2071/72764c3d-40f9-47f0-82fe-afd0784727f1.jpg?preset=api-default-square",
    title: "Selam Fessahayes",
  },
  {
    born: 1981,
    id: "0VuxD6kWl8MchmPIkVidv5",
    image:
      "https://static-cdn.sr.se/images/2071/f0fa1832-0766-4061-aa39-a0a71949185c.jpg?preset=api-default-square",
    title: "Nicolas Lunabbas",
  },
  {
    born: 1963,
    id: "3GJ47pEd6NT84bJirgjeaV",
    image:
      "https://static-cdn.sr.se/images/2071/431b4c03-7273-49df-8949-da50275b9d59.jpg?preset=api-default-square",
    title: "Pia Cramlings",
  },
  {
    born: 1960,
    id: "2iW7EctOOqB6dUwqriu1jb",
    image:
      "https://static-cdn.sr.se/images/2071/3aff2f4f-364e-4d1a-8b74-9ffc1ed16b61.jpg?preset=api-default-square",
    title: "Ullakarin Nybergs",
  },
  {
    born: 1945,
    id: "3CxEVyT9iqJQ5xMBfFUjlv",
    image:
      "https://static-cdn.sr.se/images/2071/3ed6ed82-9580-4884-9488-15b3f71e25b6.jpg?preset=api-default-square",
    title: "Janne Schaffers",
  },
  {
    born: 1987,
    id: "6CK3dw9BPZqIv9nPIgcr7w",
    image:
      "https://static-cdn.sr.se/images/2071/e5e33bb9-10fc-48c6-ae63-580a7d7182e9.jpg?preset=api-default-square",
    title: "Gizem Kling Erdogans",
  },
  {
    born: 1974,
    id: "1TNOoef5HHP7rad87oObe7",
    image:
      "https://static-cdn.sr.se/images/2071/290a2a70-6478-4057-b0c0-88cc0842724c.jpg?preset=api-default-square",
    title: "Anders ”Ankan” Johanssons",
  },
  {
    born: 1969,
    id: "4sUZjEQaQW1ix5WuQF0vaZ",
    image:
      "https://static-cdn.sr.se/images/2071/08275d12-3571-4b86-98b7-b79a857d3976.jpg?preset=api-default-square",
    title: "Rahel Belatchews",
  },

  {
    id: "6RHV8zVBof4m0Zhm6H4jDr",
    image:
      "https://static-cdn.sr.se/images/2071/5a303f95-ede8-44b6-824f-c16234c503cc.jpg?preset=api-default-square",
    title: "Anna-Lena Lauréns",
    born: 1976,
  },
  {
    id: "56alPheXEghitvQJw5PmIu",
    image:
      "https://static-cdn.sr.se/images/2071/8a936a8b-ead7-4395-a9fa-aaf96c011a32.jpg?preset=api-default-square",
    title: "Alexandre Antonellis",
    born: 1978,
  },
  {
    id: "4IltVX7T9H7LkhWLSz5coD",
    image:
      "https://static-cdn.sr.se/images/2071/cce7fd54-eba0-4c26-8d36-72f5e347f7d3.jpg?preset=api-default-square",
    title: "Lina Watzs",
    born: 1996,
  },
  {
    id: "2tZbHM84bRb7Zc8ixjoO3q",
    image:
      "https://static-cdn.sr.se/images/2071/f4615eb3-23ab-4ba7-88c2-f7d29909a7b3.jpg?preset=api-default-square",
    title: "Claudia Olssons",
    born: 1983,
  },
  {
    id: "5ljXBGrADfMlUlC9X14FQT",
    image:
      "https://static-cdn.sr.se/images/2071/f7f7dfa5-31de-4ef5-a5a5-7efe8c096399.jpg?preset=api-default-square",
    title: "Jessica Meirs",
    born: 1977,
  },
  {
    id: "27D3h3TWpWhk99U3Fzy6HC",
    image:
      "https://static-cdn.sr.se/images/2071/5154a52f-dcf8-467b-8570-d144dffb2011.jpg?preset=api-default-square",
    title: "Tousin ”Tusse” Chizas",
    born: 2002,
  },
  {
    id: "3RZEnx8knXLEjxI4WGQ2Ri",
    image:
      "https://static-cdn.sr.se/images/2071/9805c064-d601-465e-8d56-bc3952e22ca7.jpeg?preset=api-default-square",
    title: "Sara Bruuns",
    born: 1974,
  },
  {
    id: "0yB0tDpEe1Rm4lhuza88eS",
    image:
      "https://static-cdn.sr.se/images/2071/f599d7a6-8d96-4bef-b5b2-18f076dcbae8.jpg?preset=api-default-square",
    title: "Sten Ljunggrens",
    born: 1938,
  },
  {
    id: "45R0tC2D1v9VsKMGaWwAOG",
    image:
      "https://static-cdn.sr.se/images/2071/4f63c4f2-9d39-4efd-852e-c23d8e2770e3.jpg?preset=api-default-square",
    title: "Lisen Bratt Fredricsons",
    born: 1976,
  },
  {
    id: "2MIlAJcLf6LRfddIgLwv1c",
    image:
      "https://static-cdn.sr.se/images/2071/97752a2a-f040-4f52-a339-501b3f1406b9.jpg?preset=api-default-square",
    title: "Elin Anna Labbas",
    born: 1980,
  },
  {
    id: "0RV2vQdRj0u4Lh5TWKrCtA",
    image:
      "https://static-cdn.sr.se/images/2071/faa65df3-803e-420b-bb01-a6762812c49c.jpg?preset=api-default-square",
    title: "Ingmar Skoogs",
    born: 1954,
  },
  {
    id: "4bPStRTmNfowTw7dDB7aWT",
    image:
      "https://static-cdn.sr.se/images/2071/a8a522dd-d232-4d5c-a9a8-86af4f45d9fc.jpg?preset=api-default-square",
    title: "Parisa Amiris",
    born: 1990,
  },
  {
    id: "1oc3AH1s1gQIWs6T7JFcCQ",
    image:
      "https://static-cdn.sr.se/images/2071/47c08202-9830-4c27-8bcc-bcb7896e5b90.jpg?preset=api-default-square",
    title: "Nils van der Poels",
    born: 1996,
  },
  {
    id: "5yqMPtG6lJWQcA2ZtUaL0U",
    image:
      "https://static-cdn.sr.se/images/2071/8838313b-351d-4543-8985-0e7631172574.jpg?preset=api-default-square",
    title: 'Gunhild "Ninis" Rosqvists',
    born: 1960,
  },
  {
    id: "3B6LyyAYjfFtWKJv1xg9PJ",
    image:
      "https://static-cdn.sr.se/images/2071/1cd347af-8656-43cd-a9fe-caa006c90b72.jpg?preset=api-default-square",
    title: "Goran Kapetanovićs",
    born: 1974,
  },
  {
    id: "7iTGXVGSx3pBHMYdULzKz4",
    image:
      "https://static-cdn.sr.se/images/2071/13155900-b5ea-4b46-84ae-5a88e7617a25.jpg?preset=api-default-square",
    title: "Peter Carlssons",
    born: 1963,
  },
  {
    id: "3ncl1ozbIF2NwwSbT5qnlq",
    image:
      "https://static-cdn.sr.se/images/2071/9a71db51-678c-4f90-8f6f-c57f40f39be1.jpg?preset=api-default-square",
    title: "Merit Hemmingsons",
    born: 1940,
  },
  {
    id: "3wVujJsu1UYetkID8gXwjv",
    image:
      "https://static-cdn.sr.se/images/2071/9b689072-b7a2-4195-b181-3967d3ec1660.jpg?preset=api-default-square",
    title: "Olga Perssons",
    born: 1977,
  },
  {
    id: "2q0knm8ZJzwrfDxMtUIoF7",
    image:
      "https://static-cdn.sr.se/images/2071/091417b6-8d50-487b-9edc-b9c2c4dccdc2.jpg?preset=api-default-square",
    title: "Jonas Karlssons",
    born: 1971,
  },
  {
    id: "3v0bdk1e5ENYjzFig3QIRK",
    image:
      "https://static-cdn.sr.se/images/2071/dc45e520-e6a8-4223-b02a-97a02e2d5fa3.jpg?preset=api-default-square",
    title: "Jacob Hårds",
    born: 1955,
  },
  {
    id: "6mJRQJ3bdH5itC71XNxn5v",
    image:
      "https://static-cdn.sr.se/images/2071/358724a5-a93f-4b17-8bca-df01de85b2be.jpg?preset=api-default-square",
    title: "Malin Bromans",
    born: 1975,
  },
  {
    id: "0d8rvfUJsJzUGoLcOqvLnL",
    image:
      "https://static-cdn.sr.se/images/2071/79d7ccee-c7da-425f-9749-ab360bb30e15.jpg?preset=api-default-square",
    title: "Jens Stoltenbergs",
    born: 1959,
  },
  {
    id: "0NMaoJ7a7axwazRGwid9Ny",
    image:
      "https://static-cdn.sr.se/images/2071/e099e9af-0927-4e29-ac69-45fe24feac54.jpg?preset=api-default-square",
    title: "Lap-See Lams",
    born: 1990,
  },
  {
    id: "1U3eN1krujXJkUghdkTvx5",
    image:
      "https://static-cdn.sr.se/images/2071/120a5446-cb97-4d09-a3bd-d9c300369941.jpg?preset=api-default-square",
    title: "Henrik Ekmans",
    born: 1951,
  },
  {
    id: "1Xw4YmhJZIoritRbkHlpPo",
    image:
      "https://static-cdn.sr.se/images/2071/5a67d9a3-637a-49c3-b477-441e792bd555.jpg?preset=api-default-square",
    title: "Hanna Wallensteens",
    born: 1971,
  },
  {
    id: "7CEb2CaXbd94f9d4VJtst3",
    image:
      "https://static-cdn.sr.se/images/2071/5664c5a5-aa7d-433a-95f3-72c26bb67099.jpg?preset=api-default-square",
    title: "Peter Jöbacks",
    born: 1971,
  },
  {
    id: "3gIZhIxe7Tt1O0K7A4LhHr",
    image:
      "https://static-cdn.sr.se/images/2071/8619c51e-2580-45ef-963e-4c48feaf1344.jpg?preset=api-default-square",
    title: "Kristina ”Keyyo” Petrushinas",
    born: 1997,
  },
  {
    id: "2yewQR5pOwwtMbqjnu2vSg",
    image:
      "https://static-cdn.sr.se/images/2071/460258aa-19cf-43cb-ad97-483410148ff6.jpg?preset=api-default-square",
    title: "Nina Burtons",
    born: 1946,
  },
  {
    id: "3L5K56cJ1ydlyUjichO02o",
    image:
      "https://static-cdn.sr.se/images/2071/3ae823ef-6668-424a-8b5d-68425ac4970a.jpg?preset=api-default-square",
    title: "Mats Jonssons",
    born: 1973,
  },
  {
    id: "6wYyZWadLGdOtEmCYbOWZv",
    image:
      "https://static-cdn.sr.se/images/2071/a6475ea7-e64d-4bb6-ab80-375e6e66b82b.jpg?preset=api-default-square",
    title: "Mathilda Hoflings",
    born: 1986,
  },
  {
    id: "6tdYwRx58B9BBMLeaJQA6g",
    image:
      "https://static-cdn.sr.se/images/2071/bf94d4b3-e357-4874-8c01-eacf5095b914.jpg?preset=api-default-square",
    title: "Agneta Sjödins",
    born: 1967,
  },
  {
    id: "7iWwRIzk1MzVKxJLQTJOCi",
    image:
      "https://static-cdn.sr.se/images/2071/2c5fdcc8-925e-4a9a-96f2-0aa0267e0854.jpg?preset=api-default-square",
    title: "Nadim Ghazales",
    born: 1983,
  },
  {
    id: "2cbMcS6jughYgkHpV5uniN",
    image:
      "https://static-cdn.sr.se/images/2071/1e0c9efa-f836-4904-b4db-5e1ca7711d31.jpg?preset=api-default-square",
    title: "Inger Nilssons",
    born: 1959,
  },
  {
    id: "3gAfYWvaVZhv2JAXYgYGAA",
    image:
      "https://static-cdn.sr.se/images/2071/5e42d6cb-ef6d-40cf-a082-4b998cd47b20.jpg?preset=api-default-square",
    title: "Sven–Göran Erikssons",
    born: 1948,
  },
  {
    id: "1ThbsHMZz6HWeYR1d91QEx",
    image:
      "https://static-cdn.sr.se/images/2071/137b47fa-e2af-429a-9d49-44fd51026b61.jpg?preset=api-default-square",
    title: "Tomas J Philipsons",
    born: 1962,
  },
  {
    id: "5YN02lszYeDFQyc6JCh7Qy",
    image:
      "https://static-cdn.sr.se/images/2071/5c70bb03-8304-445c-a947-2def91d966cc.jpg?preset=api-default-square",
    title: "Amelia Adamos",
    born: 1947,
  },
  {
    id: "0kryxLv1w6bEsQn5fUIxha",
    image:
      "https://static-cdn.sr.se/images/2071/c7139bbe-d6e8-43da-b430-de57f68b14bc.jpg?preset=api-default-square",
    title: "Peter Sjölunds",
    born: 1966,
  },
  {
    id: "2rOl7mtyPRb1FrfgFPovYu",
    image:
      "https://static-cdn.sr.se/images/2071/09eaafe3-191f-4bf4-b2fa-181599c3a943.jpg?preset=api-default-square",
    title: "Anna Kinberg Batras",
    born: 1970,
  },
  {
    id: "0TtqFvhvtbRNdqb4JXNyyz",
    image:
      "https://static-cdn.sr.se/images/2071/e958bb67-4a99-441c-b719-2293410b3392.jpg?preset=api-default-square",
    title: "Fredrik Steens",
    born: 1969,
  },
  {
    id: "5L3viLIaWtg0SZ0fJnpEQv",
    image:
      "https://static-cdn.sr.se/images/2071/25bb54a4-30fa-40db-b4a5-7966d8110dfa.jpg?preset=api-default-square",
    title: "Mikael Dolstens",
    born: 1958,
  },
  {
    id: "4Dnr4WNzvdRBsrhiysXuGI",
    image:
      "https://static-cdn.sr.se/images/2071/9ceb3d5c-a6dc-4f48-beb8-1073899a2402.jpg?preset=api-default-square",
    title: "Tareq Taylors",
    born: 1969,
  },
  {
    id: "0uUGakuRD6gKR5QTDl5Mbc",
    image:
      "https://static-cdn.sr.se/images/2071/a185202f-db49-444a-8640-f94676932290.jpg?preset=api-default-square",
    title: "Amie Bramme Seys",
    born: 1987,
  },
  {
    id: "1R2fsrpQ78Ab4P6ioAAElN",
    image:
      "https://static-cdn.sr.se/images/2071/ba10fedb-788c-4397-8dbf-72ce24f363ca.jpg?preset=api-default-square",
    title: "Ingrid Carlbergs",
    born: 1961,
  },
  {
    id: "3Az6x89KCE2lrubgzWkV8N",
    image:
      "https://static-cdn.sr.se/images/2071/e793dba3-6520-4fef-bc11-ebbc5a57235a.jpg?preset=api-default-square",
    title: "Denise Rudbergs",
    born: 1971,
  },
  {
    id: "50vjxZGx5ZQB4Emcg1RBs6",
    image:
      "https://static-cdn.sr.se/images/2071/df7f6c1e-4784-4d31-ba04-dc4f2a5fd276.jpg?preset=api-default-square",
    title: "Michael Lindgrens",
    born: 1978,
  },
  {
    id: "2MkJAhDSlk8wqCH0CiMLVD",
    image:
      "https://static-cdn.sr.se/images/2071/fb99d004-eed3-4046-b1db-1b146e9dc723.jpg?preset=api-default-square",
    title: "Karin Bodins",
    born: 1974,
  },
  {
    id: "1N52HGrjK14BKO8Wh2CwRe",
    image:
      "https://static-cdn.sr.se/images/2071/918835ab-d8a4-4ca7-b324-6eb1ffb68bbe.jpg?preset=api-default-square",
    title: "Niklas Strömstedts",
    born: 1958,
  },
  {
    id: "2tIOemGQhjU05rtilA6IoE",
    image:
      "https://static-cdn.sr.se/images/2071/383baf9c-54a2-48f0-bf70-2ed1c20e77a7.jpg?preset=api-default-square",
    title: "Benjamin Ingrossos",
    born: 1997,
  },
];

const txt = playlists
  .reverse()
  .map(
    (playlist) =>
      `* [${playlist.title}](https://open.spotify.com/playlist/${playlist.id})`
  )
  .join("\n");

module.exports = {
  playlists,
};
