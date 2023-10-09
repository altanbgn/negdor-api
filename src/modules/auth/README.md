## Google login

```
https://accounts.google.com/o/oauth2/v2/auth
?client_id=822686768724-4ug9da0dfcmu9j72c9b743gtfn9mmgcj.apps.googleusercontent.com
&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fv1%2Fauth%2Flogin-google
&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile
&response_type=code
&access_type=offline
&prompt=consent
```

Replace the redirect uri with your frontend uri and add it to the `Google Credentials -> Authorised Redirect URIs`
User will go to this uri and after login, google will send a data on the query on the redirect uri
Fetch the data and send get request to `/v1/auth/login-google` with the query data and you will get login token :)
