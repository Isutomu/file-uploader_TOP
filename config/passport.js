const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const authStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (username, password, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: username,
        },
      });

      if (!user) {
        return done(null, false, { message: "No account with this e-mail." });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password!" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);

passport.use(authStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
