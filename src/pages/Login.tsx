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
  Check,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { MIN_LENGTHS } from "@/lib/validation";
import { validatePasswordSecurity } from "@/lib/passwordSecurity";

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
        // Show first error (most important)
        const errorMessage = passwordValidation.errors[0];
        
        // Use specific translation keys for leaked passwords
        if (passwordValidation.isLeaked) {
          if (passwordValidation.leakCount && passwordValidation.leakCount > 1000) {
            toast.error(t("login.passwordLeakedMultiple") || errorMessage);
          } else {
            toast.error(t("login.passwordLeaked") || errorMessage);
          }
        } else {
          // Map common errors to translation keys
          if (errorMessage.includes("at least 8 characters")) {
            toast.error(t("login.passwordMinLength"));
          } else if (errorMessage.includes("uppercase")) {
            toast.error(t("login.passwordRuleUppercase"));
          } else if (errorMessage.includes("lowercase")) {
            toast.error(t("login.passwordRuleLowercase"));
          } else if (errorMessage.includes("number")) {
            toast.error(t("login.passwordRuleNumber"));
          } else if (errorMessage.includes("special")) {
            toast.error(t("login.passwordRuleSpecial"));
          } else {
            toast.error(errorMessage);
          }
        }
        
        setLoading(false);
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
          <h1 className="heading-section text-foreground mb-2">
            {isLogin ? t("login.welcomeBack") : t("login.createAccount")}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isLogin 
              ? t("login.signInToManage")
              : t("login.startSecuring")
            }
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="input-elevated pl-12"
                    disabled={loading}
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
                  className="input-elevated pl-12"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("login.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-elevated pl-12 pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && (
                <div className="mt-3 p-3 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-xs font-medium text-foreground mb-2">
                    {t("login.passwordRequirements")}
                  </p>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li className={`flex items-center gap-2 ${password.length >= MIN_LENGTHS.PASSWORD ? 'text-green-600' : ''}`}>
                      <Check className={`w-3.5 h-3.5 ${password.length >= MIN_LENGTHS.PASSWORD ? 'text-green-600' : 'text-muted-foreground/50'}`} />
                      {t("login.passwordRuleLength")}
                    </li>
                    <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
                      <Check className={`w-3.5 h-3.5 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-muted-foreground/50'}`} />
                      {t("login.passwordRuleUppercase")}
                    </li>
                    <li className={`flex items-center gap-2 ${/[a-z]/.test(password) ? 'text-green-600' : ''}`}>
                      <Check className={`w-3.5 h-3.5 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-muted-foreground/50'}`} />
                      {t("login.passwordRuleLowercase")}
                    </li>
                    <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-600' : ''}`}>
                      <Check className={`w-3.5 h-3.5 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-muted-foreground/50'}`} />
                      {t("login.passwordRuleNumber")}
                    </li>
                    <li className={`flex items-center gap-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : ''}`}>
                      <Check className={`w-3.5 h-3.5 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : 'text-muted-foreground/50'}`} />
                      {t("login.passwordRuleSpecial")}
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">{t("login.rememberMe")}</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-gold hover:underline">
                  {t("login.forgotPassword")}
                </Link>
              </div>
            )}

            <Button 
              variant="gold" 
              className="w-full gap-2" 
              size="lg" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? t("login.signIn") : t("login.createAccountButton")}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            {isLogin ? t("login.dontHaveAccount") + " " : t("login.alreadyHaveAccount") + " "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gold hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {isLogin ? t("login.signUp") : t("login.signInLink")}
            </button>
          </p>
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
