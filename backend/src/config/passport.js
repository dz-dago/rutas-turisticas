const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Usuario = require("../models/Usuario");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
          usuario = await Usuario.create({
            nombre: profile.displayName,
            email,
            provider: "google",
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || "",
            verificacion: {
              emailVerificado: true,
              telefonoVerificado: false
            },
            confianza: 20,
            rol: "turista"
          });
        }

        if (usuario && !usuario.googleId) {
          usuario.googleId = profile.id;
          usuario.provider = usuario.provider || "google";
          usuario.avatar = usuario.avatar || profile.photos?.[0]?.value || "";
          usuario.verificacion.emailVerificado = true;
          await usuario.save();
        }

        done(null, usuario);

      } catch (error) {
        done(error, null);
      }
    }
  )
);