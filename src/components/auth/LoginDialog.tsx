"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Mail, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { signIn, getProviders } from "next-auth/react";
import { toast } from "sonner";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setOpen: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange, setOpen }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [providers, setProviders] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setShowPassword(false);
  };

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const providers = await getProviders();
        setProviders(providers || {});
      } catch (error) {
        console.error('Error loading providers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProviders();
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isSignUp && !name) {
      toast.error("Please enter your name");
      return;
    }

    try {
      if (isSignUp) {
        // Handle signup
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
          toast.success("Account created successfully! Please sign in.");
          setIsSignUp(false);
          clearForm();
        } else {
          const error = await response.json();
          toast.error(error.error || "Failed to create account");
        }
      } else {
        // Handle login with NextAuth
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Invalid email or password");
        } else {
          toast.success("Signed in successfully!");
          setOpen(false);
          clearForm();
          // Redirect to converter page after successful login
          window.location.href = '/converter';
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        clearForm();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="w-[90vw] h-[90vh] max-w-6xl p-0 overflow-auto border-0 shadow-2xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <DialogHeader className="sr-only">
          <DialogTitle>Login to ASCII Generator</DialogTitle>
        </DialogHeader>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col lg:flex-row h-full min-h-full"
            >
              {/* Left Panel - Login Form */}
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex-1 bg-gradient-to-br from-white to-gray-50 p-6 sm:p-8 flex flex-col overflow-y-auto lg:w-1/2"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">8</span>
                  </div>
                  <span className="text-3xl font-bold font-mono bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">ASCII Generator</span>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-2 overflow-y-auto">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-center mb-4"
                  >
                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{isSignUp ? "Sign up" : "Sign in"}</h2>
                    <p className="text-gray-600 text-base">{isSignUp ? "Create your account" : "Welcome back"}</p>
                  </motion.div>

                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="space-y-3"
                  >
                    {/* Google Login */}
                    {providers.google && (
                      <Button 
                        variant="outline" 
                        className="w-full h-12 gap-3 border-2 hover:bg-gray-50 transition-all duration-200 shadow-sm mb-2"
                        onClick={() => {
                          signIn('google', { callbackUrl: '/' });
                        }}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="font-medium text-sm">Continue with Google</span>
                      </Button>
                    )}

                    {/* GitHub Login */}
                    {providers.github && (
                      <Button 
                        variant="outline" 
                        className="w-full h-12 gap-3 mb-3 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                        onClick={() => {
                          signIn('github', { callbackUrl: '/' });
                        }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="font-medium text-sm">Continue with GitHub</span>
                      </Button>
                    )}

                    {/* OAuth Not Configured Message */}
                    {!providers.google && !providers.github && !loading && (
                      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3">
                        <p className="text-sm text-gray-600 mb-2">
                          Social login not configured
                        </p>
                        <p className="text-xs text-gray-500">
                          Follow the setup guide in <code className="bg-gray-100 px-1 rounded">OAUTH_SETUP_GUIDE.md</code>
                        </p>
                      </div>
                    )}

                    {/* Divider - Only show if OAuth providers are available */}
                    {(providers.google || providers.github) && (
                      <div className="relative my-3">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-gradient-to-br from-white to-gray-50 px-3 text-gray-500 font-medium">or continue with email</span>
                        </div>
                      </div>
                    )}

                    {/* Name Input (Sign Up Only) */}
                    {isSignUp && (
                      <div className="space-y-1 mb-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg"
                        />
                      </div>
                    )}

                    {/* Email Input */}
                    <div className="space-y-1 mb-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg"
                      />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1 mb-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="h-12 pr-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-md"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Confirm Password Input (Sign Up Only) */}
                    {isSignUp && (
                      <div className="space-y-1 mb-3">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="h-12 pr-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg"
                          />
                        </div>
                      </div>
                    )}

                    {/* Sign In/Up Button */}
                    <Button 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
                      onClick={handleSubmit}
                    >
                      {isSignUp ? "Create Account" : "Sign In"}
                    </Button>

                    {/* Forgot Password Link (Sign In Only) */}
                    {!isSignUp && (
                      <div className="text-center mt-2">
                        <Button 
                          variant="link" 
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          onClick={() => {
                            // Handle forgot password
                            toast.info("Forgot password functionality coming soon!");
                          }}
                        >
                          Forgot your password?
                        </Button>
                      </div>
                    )}

                    {/* Sign Up/Sign In Toggle */}
                    <div className="text-center mt-4">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-700 mb-2 font-medium">
                          {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        </p>
                        <Button 
                          variant="outline"
                          className="w-full h-10 bg-white hover:bg-gray-50 border-2 border-blue-500 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-all duration-200"
                          onClick={() => setIsSignUp(!isSignUp)}
                        >
                          {isSignUp ? "Sign in to your account" : "Create new account"}
                        </Button>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="text-center mt-4">
                      <p className="text-xs text-muted-foreground">
                        By signing in, you agree to our{" "}
                        <Button variant="link" className="p-0 h-auto text-xs text-blue-600">
                          Terms of Use
                        </Button>{" "}
                        and{" "}
                        <Button variant="link" className="p-0 h-auto text-xs text-blue-600">
                          Privacy Policy
                        </Button>
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">© ASCII Generator 2025</p>
                </div>
              </motion.div>

              {/* Right Panel - Promotional Content */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="w-full lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-y-auto"
              >
                {/* Logo */}
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="relative z-10 p-12"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">8</span>
                    </div>
                    <span className="text-3xl font-bold text-white font-mono">ASCII Generator</span>
                  </div>
                </motion.div>

                {/* ASCII Art Examples */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="relative z-10 px-12 pb-12"
                >
                  <div className="space-y-8">
                    {/* Example 1 */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-lg">
                      <h4 className="text-white font-semibold mb-3 text-lg">Portrait ASCII Art</h4>
                      <pre className="text-xs text-green-400 font-mono leading-none">
{`  .--.
 /    \\
| O  O |
 \\  ~  /
  '--'`}
                      </pre>
                    </div>

                    {/* Example 2 */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-lg">
                      <h4 className="text-white font-semibold mb-3 text-lg">Landscape ASCII Art</h4>
                      <pre className="text-xs text-blue-400 font-mono leading-none">
{`    /\\
   /  \\
  /____\\
 /      \\
/        \\`}
                      </pre>
                    </div>

                    {/* Example 3 */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-lg">
                      <h4 className="text-white font-semibold mb-3 text-lg">Abstract ASCII Art</h4>
                      <pre className="text-xs text-purple-400 font-mono leading-none">
{`  *  *  *
 *  *  *  *
*  *  *  *  *
 *  *  *  *
  *  *  *`}
                      </pre>
                    </div>
                  </div>
                </motion.div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
