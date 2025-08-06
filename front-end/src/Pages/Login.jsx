import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthStore } from '../AuthStore/AuthStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLogging } = AuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData, navigate);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      {/* Decorative Western Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 border-2 border-[#d4af37] rounded-full transform rotate-12"></div>
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 border border-[#f1c232] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Login Card */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden shadow-2xl">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] p-8 border-b border-[#2a2a2a] text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-[#d4af37] to-[#f1c232] p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0f0f0f]">
                  <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
                  <path d="M18 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V8Z"/>
                  <path d="M14 12h.01"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] to-[#f1c232] font-serif tracking-wide">
                WesternGPT
              </h1>
            </div>
            <p className="text-[#a0a0a0] text-sm">
              Welcome back, partner. Ride into your account.
            </p>
          </div>

          {/* Card Body */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-[#f5f5f5] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#a0a0a0]" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-[#2a2a2a] border border-[#333333] text-[#f5f5f5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] block w-full pl-10 p-2.5 transition-all duration-200"
                    placeholder="your@email.com"
                    required
                    disabled={isLogging}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-8">
                <label htmlFor="password" className="block text-sm font-medium text-[#f5f5f5] mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#a0a0a0]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-[#2a2a2a] border border-[#333333] text-[#f5f5f5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] block w-full pl-10 p-2.5 pr-10 transition-all duration-200"
                    placeholder="••••••••"
                    required
                    disabled={isLogging}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLogging}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-[#a0a0a0] hover:text-[#d4af37] transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#a0a0a0] hover:text-[#d4af37] transition-colors" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <a href="#" className="text-xs text-[#a0a0a0] hover:text-[#d4af37] transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLogging}
                className={`w-full bg-gradient-to-r from-[#d4af37] to-[#f1c232] hover:from-[#f1c232] hover:to-[#d4af37] text-[#0f0f0f] font-medium rounded-lg py-3 px-5 transition-all duration-300 flex items-center justify-center group ${
                  isLogging ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {isLogging ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0f0f0f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="mt-8 pt-6 border-t border-[#2a2a2a] text-center">
              <p className="text-sm text-[#a0a0a0]">
                Don't have an account?{' '}
                <a href="/register" className="text-[#d4af37] hover:text-[#f1c232] font-medium transition-colors duration-200">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-[#a0a0a0]">
          <p>© 2023 WesternGPT. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;