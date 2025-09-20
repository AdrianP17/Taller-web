// Utilidades de validación y sanitización
export const SecurityUtils = {
  // Validaciones
  validateEmail: (email : string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  validatePassword: (password : string) => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      maxLength: password.length <= 128
    };
  },

  validateName: (name : string) => {
    return name.length >= 2 && name.length <= 50 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
  },

  // Sanitización
  sanitizeInput: (input : string) => {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Prevenir XSS básico
      .replace(/javascript:/gi, '') // Prevenir JavaScript injection
      .replace(/on\w+=/gi, '') // Prevenir event handlers
      .slice(0, 1000); // Limitar longitud
  },

  escapeHtml: (text : string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};