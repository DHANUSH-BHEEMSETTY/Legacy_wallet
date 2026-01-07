import { Link } from "react-router-dom";
import { Shield, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="font-serif text-xl font-semibold">
                LegacyVault
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Secure your legacy with modern digital will management. Peace of mind for you and your loved ones.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/how-it-works" className="hover:text-gold transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="hover:text-gold transition-colors">Pricing</Link></li>
              <li><Link to="/features" className="hover:text-gold transition-colors">Features</Link></li>
              <li><Link to="/security" className="hover:text-gold transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-gold transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-gold transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link></li>
              <li><Link to="/gdpr" className="hover:text-gold transition-colors">GDPR Compliance</Link></li>
              <li><Link to="/accessibility" className="hover:text-gold transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} LegacyVault. All rights reserved.
          </p>
          <p className="text-sm text-primary-foreground/60 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-gold" /> for your peace of mind
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
