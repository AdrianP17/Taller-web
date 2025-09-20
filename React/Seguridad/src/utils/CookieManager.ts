// Simulador de cookies seguras (en producción usar httpOnly cookies del backend)
export const SecureCookieManager = {
  set: (name : string, value : string, options = {}) => {
    // En producción: estas opciones se manejarían en el backend
    const cookieOptions = {
      secure: true,        // Solo HTTPS
      httpOnly: false,     // En producción sería true (manejado por backend)
      sameSite: 'Strict',  // Protección CSRF
      maxAge: 3600,        // 1 hora
      ...options
    };
    
    // Simulación - en producción el backend establecería la cookie
    const expirationTime = Date.now() + (cookieOptions.maxAge * 1000);
    const cookieData = {
      value,
      expires: expirationTime,
      options: cookieOptions
    };
    
    localStorage.setItem(`secure_cookie_${name}`, JSON.stringify(cookieData));
  },

  get: (name : string) => {
    const cookieData = localStorage.getItem(`secure_cookie_${name}`);
    if (!cookieData) return null;
    
    try {
      const parsed = JSON.parse(cookieData);
      if (Date.now() > parsed.expires) {
        localStorage.removeItem(`secure_cookie_${name}`);
        return null;
      }
      return parsed.value;
    } catch {
      return null;
    }
  },

  remove: (name : string) => {
    localStorage.removeItem(`secure_cookie_${name}`);
  }
};