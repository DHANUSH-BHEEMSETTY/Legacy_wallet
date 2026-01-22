import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Loader2,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { MIN_LENGTHS } from "@/lib/validation";
import { validatePasswordSecurity } from "@/lib/passwordSecurity";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Login = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  // Calculate password strength
  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= MIN_LENGTHS.PASSWORD) strength += 20;
    if (/[A-Z]/.test(pass)) strength += 20;
    if (/[a-z]/.test(pass)) strength += 20;
    if (/[0-9]/.test(pass)) strength += 20;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) strength += 20;
    return strength;
  };

  // Update password strength on password change
  useEffect(() => {
    if (!isLogin) {
      setPasswordStrength(calculatePasswordStrength(password));
    }
  }, [password, isLogin]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(t("login.fillAllFields"));
      return;
    }

    if (!isLogin && !fullName) {
      toast.error(t("login.enterFullName"));
      return;
    }

    setLoading(true);

    // Validate password requirements (only for signup)
    if (!isLogin) {
      // Check password security including leaked password check
      const passwordValidation = await validatePasswordSecurity(password, {
        checkLeaked: true,
        minLength: MIN_LENGTHS.PASSWORD,
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecial: true,
      });

      if (!passwordValidation.isValid) {
        setLoading(false);
        
        // Use specific messages for leaked passwords
        if (passwordValidation.isLeaked) {
          if (passwordValidation.leakCount && passwordValidation.leakCount > 1000) {
            toast.error(
              "Password Security Alert",
              {
                description: "This password has been compromised in data breaches. Please choose a unique password.",
                duration: 5000,
              }
            );
          } else {
            toast.error(
              "Password Security Alert", 
              {
                description: "This password has been found in a data breach. Please use a different password.",
                duration: 5000,
              }
            );
          }
        } else {
          // Show a friendly error for other validation issues
          const errorMessage = passwordValidation.errors[0];
          toast.error("Password Requirements Not Met", {
            description: errorMessage,
            duration: 4000,
          });
        }
        
        return;
      }
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error(t("login.invalidCredentials"));
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success(t("login.welcomeBackToast"));
          navigate("/dashboard");
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error(t("login.emailExists"));
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success(t("login.accountCreated"));
          navigate("/dashboard");
        }
      }
    } catch (err) {
      toast.error(t("login.unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center shadow-gold">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">
              LegacyVault
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-section text-foreground mb-2">
              {isLogin ? t("login.welcomeBack") : t("login.createAccount")}
            </h1>
            <p className="text-muted-foreground text-base">
              {isLogin 
                ? t("login.signInToManage")
                : t("login.startSecuring")
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("login.fullName")}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Smith"
                    className="input-elevated pl-12 transition-all"
                    disabled={loading}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("login.emailAddress")}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@email.com"
                  className="input-elevated pl-12 transition-all"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  {t("login.password")}
                </label>
                {!isLogin && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowPasswordHint(!showPasswordHint)}
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <p className="text-xs font-medium mb-2">Password Requirements:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• At least 8 characters</li>
                          <li>• One uppercase & lowercase letter</li>
                          <li>• One number & special character</li>
                          <li>• Not found in data breaches</li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="input-elevated pl-12 pr-12"
                  disabled={loading}
                  onFocus={() => !isLogin && setShowPasswordHint(true)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator for Signup */}
              {!isLogin && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength <= 40
                            ? "bg-red-500"
                            : passwordStrength <= 60
                            ? "bg-orange-500"
                            : passwordStrength <= 80
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground min-w-[60px]">
                      {passwordStrength <= 40
                        ? "Weak"
                        : passwordStrength <= 60
                        ? "Fair"
                        : passwordStrength <= 80
                        ? "Good"
                        : "Strong"}
                    </span>
                  </div>
                  {showPasswordHint && passwordStrength < 100 && (
                    <div className="mt-2 p-2 bg-secondary/30 rounded-md border border-border/50">
                      <p className="text-xs text-muted-foreground flex items-start gap-2">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>
                          {passwordStrength < 40
                            ? "Add uppercase, lowercase, numbers, and special characters for better security."
                            : passwordStrength < 60
                            ? "Good start! Add more character variety for stronger security."
                            : passwordStrength < 80
                            ? "Almost there! Ensure all requirements are met."
                            : "Great password! We'll also check it hasn't been compromised."}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded border-border cursor-pointer" />
                  <span className="text-muted-foreground select-none">{t("login.rememberMe")}</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-gold hover:underline font-medium">
                  {t("login.forgotPassword")}
                </Link>
              </div>
            )}

            <Button 
              variant="gold" 
              className="w-full gap-2 mt-6" 
              size="lg" 
              type="submit"
              disabled={loading || (!isLogin && passwordStrength < 100)}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
                </>
              ) : (
                <>
                  {isLogin ? t("login.signIn") : t("login.createAccountButton")}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            {!isLogin && passwordStrength < 100 && password.length > 0 && (
              <p className="text-xs text-center text-muted-foreground">
                Complete all password requirements to continue
              </p>
            )}
          </form>

          {/* Toggle */}
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword("");
                setPasswordStrength(0);
                setShowPasswordHint(false);
              }}
              className="mt-4 text-sm font-semibold text-gold hover:text-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-primary p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-primary to-navy-light" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center text-primary-foreground max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mx-auto mb-8 shadow-gold">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-semibold mb-4">
            {t("login.secureYourLegacy")}
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            {t("login.joinThousands")}
          </p>
          <div className="mt-8 flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-gold/60" />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
