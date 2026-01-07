import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, CheckCircle, Play } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const trustBadges = [
    { icon: Lock, text: "End-to-End Encrypted" },
    { icon: Shield, text: "GDPR Compliant" },
    { icon: CheckCircle, text: "Bank-Level Security" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-sage/20" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sage/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/50 text-sm font-medium text-foreground mb-6"
            >
              <Shield className="w-4 h-4 text-gold" />
              Trusted by 50,000+ families
            </motion.div>

            <h1 className="heading-display text-foreground mb-6">
              Your Legacy,{" "}
              <span className="text-gold">Secured Forever</span>
            </h1>

            <p className="body-large mb-8 max-w-xl mx-auto lg:mx-0">
              Create, manage, and share your digital will with complete peace of mind. 
              Record your last wishes via audio, video, or chat—all encrypted and legally guided.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link to="/dashboard">
                <Button variant="hero" size="xl">
                  Start Your Will
                </Button>
              </Link>
              <Button variant="hero-outline" size="xl" className="gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="trust-badge"
                >
                  <badge.icon className="w-4 h-4 text-gold" />
                  {badge.text}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="card-elevated p-8 relative">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold/20 to-transparent rounded-tr-xl" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground">My Digital Will</h3>
                  <p className="text-sm text-muted-foreground">Last updated: Today</p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium text-foreground">75%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-gold to-gold-light rounded-full" />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Assets", value: "12" },
                  { label: "Recipients", value: "5" },
                  { label: "Messages", value: "3" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 bg-secondary/50 rounded-lg">
                    <p className="font-serif text-xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Action */}
              <Button variant="navy" className="w-full">
                Continue Editing
              </Button>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-medium"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-gold" />
                <span className="text-sm font-medium">256-bit Encryption</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
