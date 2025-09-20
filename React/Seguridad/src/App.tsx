import { useEffect, useState } from 'react'
import './App.css'
import { SecureCookieManager } from './utils/CookieManager';
import { SecurityUtils } from './utils/SecurityUtils';
import { AlertTriangle, CheckCircle, Eye, EyeOff, Lock, LogOut, Shield, User } from 'lucide-react';

interface User {
  id?: number | undefined;
  name: string;
  email?: string;
  bio?: string;
}

interface Errors {
  [key: string]: string;
}

function App() {
const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [profileForm, setProfileForm] = useState({ name: '', bio: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Verificar sesión al cargar
  useEffect(() => {
    const sessionToken = SecureCookieManager.get('auth_token');
    const userData = SecureCookieManager.get('user_data');
    
    if (sessionToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setProfileForm({ name: parsedUser.name, bio: parsedUser.bio || '' });
      } catch (error) {
        // Token corrupto, limpiar sesión
        logout();
      }
    }
  }, []);

  // Validación en tiempo real
  const validateForm = (formType : string, data : any) => {
    const newErrors : Errors = {};

    if (formType === 'login' || formType === 'register') {
      if (!SecurityUtils.validateEmail(data.email)) {
        newErrors.email = 'Email inválido o demasiado largo';
      }

      const passwordValidation = SecurityUtils.validatePassword(data.password);
      if (!passwordValidation.minLength) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      } else if (!passwordValidation.hasUpperCase || !passwordValidation.hasLowerCase || 
                 !passwordValidation.hasNumbers || !passwordValidation.hasSpecialChar) {
        newErrors.password = 'Contraseña debe incluir mayúsculas, minúsculas, números y símbolos';
      } else if (!passwordValidation.maxLength) {
        newErrors.password = 'Contraseña demasiado larga';
      }
    }

    if (formType === 'register' || formType === 'profile') {
      if (!SecurityUtils.validateName(data.name)) {
        newErrors.name = 'Nombre debe tener 2-50 caracteres y solo letras';
      }
    }

    if (formType === 'profile' && data.bio && data.bio.length > 200) {
      newErrors.bio = 'La biografía no puede exceder 200 caracteres';
    }

    return newErrors;
  };

  // Sanitizar y manejar inputs
  const handleInputChange = (formType : string, field : string, value : string) => {
    const sanitizedValue = SecurityUtils.sanitizeInput(value);
    
    if (formType === 'login') {
      setLoginForm(prev => ({ ...prev, [field]: sanitizedValue }));
    } else if (formType === 'register') {
      setRegisterForm(prev => ({ ...prev, [field]: sanitizedValue }));
    } else if (formType === 'profile') {
      setProfileForm(prev => ({ ...prev, [field]: sanitizedValue }));
    }
    
    // Limpiar errores al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Simulación de login
  const handleLogin = () => {
    setErrors({});
    
    const validationErrors = validateForm('login', loginForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Simulación de autenticación
    if (loginForm.email === 'user@example.com' && loginForm.password === 'SecurePass123!') {
      const userData = {
        id: 1,
        name: 'Usuario Demo',
        email: loginForm.email,
        bio: 'Usuario de demostración'
      };

      // Establecer cookies seguras
      SecureCookieManager.set('auth_token', 'secure-jwt-token-simulation', { maxAge: 3600 });
      SecureCookieManager.set('user_data', JSON.stringify(userData), { maxAge: 3600 });
      
      setIsAuthenticated(true);
      setUser(userData);
      setProfileForm({ name: userData.name, bio: userData.bio });
      setLoginForm({ email: '', password: '' });
      setSuccessMessage('¡Sesión iniciada correctamente!');
    } else {
      setErrors({ general: 'Credenciales inválidas' });
    }
  };

  // Simulación de registro
  const handleRegister = () => {
    setErrors({});
    
    const validationErrors = validateForm('register', registerForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Simulación de registro exitoso
    const userData = {
      id: Date.now(),
      name: registerForm.name,
      email: registerForm.email,
      bio: ''
    };

    SecureCookieManager.set('auth_token', 'secure-jwt-token-simulation', { maxAge: 3600 });
    SecureCookieManager.set('user_data', JSON.stringify(userData), { maxAge: 3600 });
    
    setIsAuthenticated(true);
    setUser(userData);
    setProfileForm({ name: userData.name, bio: '' });
    setRegisterForm({ name: '', email: '', password: '' });
    setSuccessMessage('¡Cuenta creada exitosamente!');
    setIsRegistering(false);
  };

  // Actualizar perfil
  const handleUpdateProfile = () => {
    setErrors({});
    
    const validationErrors = validateForm('profile', profileForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedUser = {
      ...user,
      name: profileForm.name,
      bio: profileForm.bio
    };

    SecureCookieManager.set('user_data', JSON.stringify(updatedUser), { maxAge: 3600 });
    setUser(updatedUser);
    setSuccessMessage('¡Perfil actualizado correctamente!');
  };

  // Cerrar sesión
  const logout = () => {
    SecureCookieManager.remove('auth_token');
    SecureCookieManager.remove('user_data');
    setIsAuthenticated(false);
    setUser(null);
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ name: '', email: '', password: '' });
    setProfileForm({ name: '', bio: '' });
    setErrors({});
    setSuccessMessage('');
  };

  // Limpiar mensajes después de 3 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
          <div className="text-center mb-6">
            <Shield className="mx-auto mb-3 text-green-600" size={48} />
            <h1 className="text-2xl font-bold text-gray-800">Panel Seguro</h1>
            <p className="text-gray-600">Sesión autenticada</p>
          </div>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
              <CheckCircle className="mr-2" size={16} />
              {successMessage}
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <User className="mr-2 text-gray-600" size={20} />
              {user?.name && SecurityUtils.escapeHtml(user.name)}
            </div>
            <p className="text-gray-600 text-sm">Email: {user?.email}</p>
            {user?.bio && (
              <p className="text-gray-600 text-sm mt-1">Bio: {SecurityUtils.escapeHtml(user.bio)}</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'
                }`}
                maxLength={50}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertTriangle size={14} className="mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biografía (opcional)
              </label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none ${
                  errors.bio ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'
                }`}
                maxLength={200}
                rows={3}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {profileForm.bio.length}/200
              </div>
              {errors.bio && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertTriangle size={14} className="mr-1" />
                  {errors.bio}
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleUpdateProfile}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                Actualizar Perfil
              </button>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <LogOut size={16} className="mr-1" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
        <div className="text-center mb-6">
          <Lock className="mx-auto mb-3 text-blue-600" size={48} />
          <h1 className="text-2xl font-bold text-gray-800">
            {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h1>
          <p className="text-gray-600">Demostración de seguridad frontend</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
            <CheckCircle className="mr-2" size={16} />
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertTriangle className="mr-2" size={16} />
            {errors.general}
          </div>
        )}

        <div className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => handleInputChange('register', 'name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                maxLength={50}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertTriangle size={14} className="mr-1" />
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={isRegistering ? registerForm.email : loginForm.email}
              onChange={(e) => handleInputChange(isRegistering ? 'register' : 'login', 'email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              maxLength={254}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={isRegistering ? registerForm.password : loginForm.password}
                onChange={(e) => handleInputChange(isRegistering ? 'register' : 'login', 'password', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                maxLength={128}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          <button
            onClick={isRegistering ? handleRegister : handleLogin}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrors({});
              setSuccessMessage('');
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>

        {!isRegistering && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
            <strong>Demo:</strong> user@example.com / SecurePass123!
          </div>
        )}
      </div>
    </div>
  );
}

export default App
