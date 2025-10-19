# AuthRouter

-POST- /signup
-POST - /login
-POST - /logout

# ProfileRouter

-GET - /profile/view
-PATCH -/profile/edit
-PATCH -/profile/password

# connectionRouter

-POST -/request/send/interest/:userId
-POST -/request/send/ignore/:userId
-POST -/request/review/rejected/:reqId
-POST -/request/review/accepted/:reqId

# UserRouter

-GET -/user/connections
-GET -/user/requests
-GET -user/feed
