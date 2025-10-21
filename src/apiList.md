# AuthRouter

-POST- /signup
-POST - /login
-POST - /logout

# ProfileRouter

-GET - /profile/view
-PATCH -/profile/edit
-PATCH -/profile/password

# connectionRouter

-POST -/request/send/:status/:userId
-POST -/request/review/:status/:requestId

# UserRouter

-GET -/user/connections
-GET -/user/requests
-GET -user/feed
