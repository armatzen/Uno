const passport=require("passport");
const GoogleStrategy=require("passport-google-oauth20").Strategy

passport.serializeUser(function(user, done) {
	done(null,user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});
passport.use(new GoogleStrategy({
	clientID:"532370508797-sirk1jbn5jhch46t15fpi0addjce0ppr.apps.googleusercontent.com",
	clientSecret:"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",
	callbackURL: "http://localhost:5000/google/callback"
	},
	function(token,tokenSecret, profile, done){
		return done(null,profile);
	}
));
