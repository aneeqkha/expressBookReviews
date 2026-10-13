# Book reviews API

Run `npm start` from this directory to serve the API at
`http://localhost:5010`.

The listening port is defined in [config.js](./config.js). The server and
the Axios book lookup requests use this same setting. The internal
`/booksdata` requests use loopback networking without a proxy and time out
after five seconds; retrieval failures are logged to the server console.

Public book lookup examples:

```sh
curl -s http://localhost:5010/ | jq .
curl -s http://localhost:5010/isbn/1 | jq .
curl -s 'http://localhost:5010/author/Chinua%20Achebe' | jq .
curl -s 'http://localhost:5010/title/Things%20Fall%20Apart' | jq .
curl -s http://localhost:5010/review/1 | jq .
```

Books, users, and reviews are stored in memory. Restarting the server resets
registered users and reviews.