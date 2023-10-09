## Facebook Login
```
https://www.facebook.com/v18.0/dialog/oauth
?client_id=1259476178086338
&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fv1%2Fauth%2Flogin-facebook
&scope=email,public_profile
```

Enabling permissions of `email` and `public_profile` in `Use Cases` on Developers Facebook Dashboard and it should be fine :)
Redirect URI origin also should be on App Domains on Developers Facebook Dashboard

## Google Login

```
https://accounts.google.com/o/oauth2/v2/auth
?client_id=822686768724-4ug9da0dfcmu9j72c9b743gtfn9mmgcj.apps.googleusercontent.com
&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fv1%2Fauth%2Flogin-google
&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile
&response_type=code
&access_type=offline
&prompt=consent
```

Replace the redirect uri with your prepared frontend uri. Also, add it to the `Google Credentials -> Authorised Redirect URIs`
User will go to this uri and after login with the necessary data on the query
Fetch the query data and send get request to `/v1/auth/login-google` with the given query data and you will get login token :)
