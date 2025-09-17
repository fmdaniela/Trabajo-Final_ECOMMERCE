import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Op } from 'sequelize';
import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";
import Rol from '../models/Rol.js'; 

// ============================================================================
// ESTRATEGIA LOCAL
// ============================================================================
passport.use(new LocalStrategy({ 
  usernameField: 'email' 
}, async (email, password, done) => {
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) return done(null, false, { message: 'Usuario no encontrado' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return done(null, false, { message: 'Contraseña incorrecta' });
    
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// ============================================================================
// ESTRATEGIA GOOGLE OAUTH
// ============================================================================
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => { 
  try {
    console.log('🔵 Google Profile recibido:', profile);
    console.log('🔵 Access Token:', accessToken);
    console.log('🔵 Refresh Token:', refreshToken);
    if (!profile.emails || !profile.emails[0]) {
      return done(new Error('No se pudo obtener el email de Google'), null);
    }
    console.log('🔵 Buscando usuario con email:', profile.emails[0].value);

    let usuario = await Usuario.findOne({ 
      where: { 
        [Op.or]: [
          { proveedorId: profile.id, proveedor: 'google' }, 
          { email: profile.emails[0].value }
        ]
      },
      include: [{ model: Rol, as: 'rol' }] // ✅ Agregar esta línea 
    });
    
    if (!usuario) {
      console.log('✅ Usuario existente encontrado:', usuario.email);
      usuario = await Usuario.create({
        nombre: profile.displayName,
        email: profile.emails[0].value,
        proveedor: 'google', 
        proveedorId: profile.id,   
        password: null,
        idRol: 3
      });
    } else {
      // Actualizar usuario existente
      usuario.proveedor = 'google'; 
      usuario.proveedorId = profile.id; 
      await usuario.save();
    }
    
    console.log('✅ Autenticación Google exitosa para:', usuario.email);
    done(null, usuario);
  } catch (error) {
  console.error('❌ Error COMPLETO en Google Strategy:', error);
  console.error('❌ Stack trace:', error.stack); // ← ESTE ES IMPORTANTE
    done(error);
  }
}));

export default passport;