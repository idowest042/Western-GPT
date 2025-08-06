import { useState } from 'react';
import { Lock, Mail, User as UserIcon, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthStore } from '../AuthStore/AuthStore';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
   const { signup } = AuthStore()
  const [formData, setFormData] = useState({
    name: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData,navigate);
    
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      {/* Decorative Western Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#d4af37] rounded-full transform rotate-45"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-[#d4af37] rounded-full"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 border border-[#f1c232] transform rotate-12"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Signup Card */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden shadow-2xl">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] p-6 border-b border-[#2a2a2a]">
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
            <p className="text-center text-[#a0a0a0] text-sm">
              Saddle up for the AI experience of the Wild West
            </p>
          </div>

          {/* Card Body */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-5">
                <label htmlFor="name" className="block text-sm font-medium text-[#f5f5f5] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-[#a0a0a0]" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-[#2a2a2a] border border-[#333333] text-[#f5f5f5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] block w-full pl-10 p-2.5 transition-all duration-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-5">
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
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-6">
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
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-[#a0a0a0] hover:text-[#d4af37] transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#a0a0a0] hover:text-[#d4af37] transition-colors" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-[#a0a0a0]">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#f1c232] hover:from-[#f1c232] hover:to-[#d4af37] text-[#0f0f0f] font-medium rounded-lg py-2.5 px-5 transition-all duration-300 flex items-center justify-center group"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </form>

            {/* Login Link */}
            <p className="text-sm text-center text-[#a0a0a0] mt-4">
              Already have an account?{' '}
              <a href="#" className="text-[#d4af37] hover:text-[#f1c232] font-medium transition-colors duration-200">
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-[#a0a0a0]">
          <p>By continuing, you agree to our <a href="#" className="text-[#d4af37] hover:underline">Terms</a> and <a href="#" className="text-[#d4af37] hover:underline">Privacy Policy</a>.</p>
          <p className="mt-1">© 2023 WesternGPT. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;