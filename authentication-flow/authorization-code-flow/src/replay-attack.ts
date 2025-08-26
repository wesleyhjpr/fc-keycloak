// Script to test replay attack on the /callback endpoint
// Run this script after obtaining a valid code from the /login flow
// Usage:
// $ node_modules/.bin/ts-node authorization-code-flow/src/replay-attack.ts

const url = 'http://host.docker.internal:3000/callback?session_state=208e04a9-6f52-4190-9724-993196b4376b&code=f95a051d-003d-4884-a395-424410973eaa.208e04a9-6f52-4190-9724-993196b4376b.874df997-0463-443a-bedd-cc5cddd292a9';

const request1 = fetch(url);
const request2 = fetch(url);

Promise
.all([request1, request2])
.then(async (responses) => {
    return Promise.all(responses.map((response) => response.json()));
})
.then(json => console.log(json));