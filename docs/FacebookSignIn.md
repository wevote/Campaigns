## Signing in with Facebook

### The other ways

Both Apple and Twitter signins implement the oAuth2  Webflow spec, where 
the webapp redirects to (let say) Twitters sign in page, and sends a secure 
backchanel link to our API server.  If the voter successfully authenicates
with Twitter, that original request is redirected to our API server, which 
stores the signin info for the voter, and then in a third leg of that original
request from the WebApp redirects back to the webapp `/twitter_sign_in` URL that 
is set up to receive the confirmation of sign in.  Then when the webapp
does a voterRetrieve, the voter shows as logged in to twitter.

## The Facebook way

If the voter is already signed into the Facebook webpage, when the Webapp 
starts and does the FacebookAction.login(), the facebookApi().getLoginStatus()
will return a "connected" status, and if the voter has ever signed into
WeVote from the webapp, the WebApp will associate that connection with a 
voter_id, and show the voter as signed in, and will display their picture.

## If the Facebook.com webpage does not show the voter as being signed in
1) FacebookAction.login() calls facebookApi().getLoginStatus() and it returns `response: authResponse: null, status: "unknown"}`
1) On a status="unknown", FacebookAction.login() calls facebookApi().login
1) On successful login, the loginSuccess() method dispatches to 'FacebookConstants.FACEBOOK_LOGGED_IN'
```
successResponse:
  authResponse:
  accessToken: "EAAPmEdVDw3kBANsXcibsCW01cUqtXJMIGpTkRrmdlx7wK1oYIYzzzzzzzzzzz3pexrBTYXaBEKOvwkCwxxFZBtbr0SX2AmzNOFweZCB9r3nlc13QaQ51ySneNvBeOVxPEjYSWl3Ch3TmaSvFq3yBaBxydLIZAQgxX42mw6ucttWLtyXnEjS10CdODAjxe7wL5PEXQZDZD"
  data_access_expiration_time: 1621460419
  expiresIn: 4780
  graphDomain: "facebook"
  signedRequest: "6fCugWkB0niPRDd4GVu21_XzzzzzzzRqfEwykvsn0.eyJ1c2VyX2lkIjoizzzzzz3NDk0NDc0NCIsImNvZGUiOiJBUUF0Y25zUlluZTFNeXBoYWlSamFZR0FmU253bjVoNGpnTHBzY3lScDk0RWcxOThyek9zVUUzQTk1TzhyRHNncm1FZmZBb1g5X2p6OTh2amlfTVA2RnRMeTQzY0pjZHY3eFdlWkJNTXkwRWNBMmdnZG9uYng3OWhvNHpvOFdLY2RZSlp6SENjN25Ca3IwYkhfUTEwQVRrNVZGZVJ2U0t3VEM1TEFROFFOb05XNlBpTjJseEtmam9icWxfOU5UTC1FNWRSdW10N3pLSV9sYVFPcWpKWnJ1ck1ZdkhnNkRqLVJkaGdNc3RRYXctcUxKQ2hLUTVoT3M0YU5HYzgwWnIxVi0tbFplQ3ByNE5iRHBqYXBkakkxVno0SW9KMWpEVVNDTUpzeFZKc1JxWGZUaDQ5MFZZQTh4c0U1QTA1WXhBbXliYTBITWI5eW9RWjY0TVVaT3hzYWxqaCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjEzNjg0NDIwfQ"
  userID: "1184000000044744"
status: "connected"
```
and stores the authResponse in FacebookStore's state as authData (legacy) and fills in the state.facebookAuthData
1) FacebookSignin listener onFacebookStoreChange() is triggered

Not done...
