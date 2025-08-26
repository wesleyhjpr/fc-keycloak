import express from 'express';

const app = express();


app.get('/login', (req, res) => {

  const loginParams = new URLSearchParams({
    client_id: 'fullcycle-client',
    redirect_uri: 'http://localhost:3000/test',
    response_type: 'code',
    scope: 'openid'
  });

  const url = `http://localhost:8080/realms/fullcycle-realm/protocol/openid-connect/auth?${loginParams.toString()}`;

  console.log('Redirecting to:', url);
  res.redirect(url);
});
// /login -> redireciona para o Keycloak (formulario de login) --> /callback?code=XXXX  --> keycloak (devolve o token)
app.get('/callback', async (req, res) => {

  // //@ts-expect-error - type mismatch
  // if (!req.session.user) {
  //   return res.redirect('/admin');
  // }

  console.log(req.query);

  const bodyParams = new URLSearchParams({
    client_id: 'fullcycle-client',
    grant_type: 'authorization_code',
    code: req.query.code as string,
    redirect_uri: 'http://localhost:3000/test',
  });

  const url = `http://host.docker.internal:8080/realms/fullcycle-realm/protocol/openid-connect/token`;
  console.log('Exchanging code for token at:', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyParams.toString(),
  });

  const result = await response.json();
  console.log(result);
  
  res.json(result);

});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});