import express from 'express';
import session from "express-session";
import crypto from 'crypto';
import jwt from "jsonwebtoken";

const app = express();

const memoryStore = new session.MemoryStore();

app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
    store: memoryStore,
    //expires
  })
);

const middlewareIsAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //@ts-expect-error - type mismatch
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

app.get('/login', (req, res) => {

  const nonce = crypto.randomBytes(16).toString("base64");
  const state = crypto.randomBytes(16).toString("base64");
  //@ts-expect-error - type mismatch
  req.session.nonce = nonce;
  //@ts-expect-error - type mismatch
  req.session.state = state;
  req.session.save();

  // valor aleatório - sessão de usuário
  const loginParams = new URLSearchParams({
    client_id: "fullcycle-client",
    redirect_uri: "http://localhost:3000/callback",
    response_type: "code",
    scope: "openid",
    nonce,
    state
  });

  const url = `http://localhost:8080/realms/fullcycle-realm/protocol/openid-connect/auth?${loginParams.toString()}`;

  console.log('Redirecting to:', url);
  res.redirect(url);
});

app.get("/logout", (req, res) => {
  const logoutParams = new URLSearchParams({
    //client_id: "fullcycle-client",
    //@ts-expect-error
    id_token_hint: req.session.id_token,
    post_logout_redirect_uri: "http://localhost:3000/login",
  });

  req.session.destroy((err) => {
    console.error(err);
  });

  const url = `http://localhost:8080/realms/fullcycle-realm/protocol/openid-connect/logout?${logoutParams.toString()}`;
  res.redirect(url);
});

// /login -> redireciona para o Keycloak (formulario de login) --> /callback?code=XXXX  --> keycloak (devolve o token)
app.get('/callback', async (req, res) => {

  //@ts-expect-error - type mismatch
  if (req.session.user) {
    return res.redirect('/admin');
  }

  //@ts-expect-error - type mismatch
  if(req.query.state !== req.session.state){
    return res.status(401).json({message: 'Unauthorized - State does not match'});
  }

  console.log(req.query);

  const bodyParams = new URLSearchParams({
    client_id: 'fullcycle-client',
    grant_type: 'authorization_code',
    code: req.query.code as string,
    redirect_uri: 'http://localhost:3000/callback',
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
  const payloadAcessToken = jwt.decode(result.access_token) as any;
  const payloadRefreshToken = jwt.decode(result.refresh_token) as any;
  const payloadIdToken = jwt.decode(result.id_token) as any;


  //@ts-expect-error - type mismatch
  if(payloadAcessToken!.nonce !== req.session.nonce 
    //@ts-expect-error - type mismatch
    || payloadRefreshToken.nonce !== req.session.nonce
    //@ts-expect-error - type mismatch
    || payloadIdToken.nonce !== req.session.nonce){
    return res.status(401).json({message: 'Unauthorized - Nonce does not match'});
  }

  console.log(payloadAcessToken);

  //@ts-expect-error - type mismatch
  req.session.user = payloadAcessToken;
  //@ts-expect-error - type mismatch
  req.session.access_token = result.access_token;
  //@ts-expect-error - type mismatch
  req.session.id_token = result.id_token;
  req.session.save();
  res.json(result);
});

app.get("/admin", middlewareIsAuth, (req, res) => {
  //@ts-expect-error - type mismatch
  res.json(req.session.user);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});