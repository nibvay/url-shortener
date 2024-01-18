import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import User from "models/user";

const { JWT_SECRET } = process.env;

const options = {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

async function verify(jwt_payload, done) {
  console.info("[verify] jwt_payload.email:", jwt_payload.email);
  try {
    const user = await User.findOne({ email: jwt_payload.email });
    if (!user) return done(null, false);
    return done(null, user);
  } catch (e) {
    done(null, false);
  }
}

passport.use(new JwtStrategy(options, verify));
