import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Shield,
  FileText,
  FolderOpen,
  Users,
  Mic,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/layout/Header";

const ReviewWill = () => {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const sections = [
    {
      icon: Mic,
      title: "Audio Recording",
      status: "complete",
      details: "1 recording • 5:32 minutes",
    },
    {
      icon: FolderOpen,
      title: "Assets",
      status: "complete",
      details: "2 assets • $575,000 total",
    },
    {
      icon: Users,
      title: "Recipients",
      status: "complete",
      details: "2 recipients • 1 verified",
    },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    navigate("/confirmation");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Back Button */}
          <Link to="/recipients" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Recipients
          </Link>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className="progress-step progress-step-completed">
                  <Check className="w-4 h-4" />
                </div>
                {step < 4 && <div className="w-8 h-0.5 bg-gold" />}
              </div>
            ))}
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mx-auto mb-4 shadow-gold">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="heading-section text-foreground mb-2">Review Your Will</h1>
            <p className="text-muted-foreground">Please review all sections before finalizing your digital will.</p>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 mb-8"
          >
            {sections.map((section) => (
              <div key={section.title} className="card-elevated flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.details}</p>
                </div>
                <div className="flex items-center gap-2">
                  {section.status === "complete" ? (
                    <span className="flex items-center gap-1 text-sm text-sage-dark font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-gold font-medium">
                      <AlertCircle className="w-4 h-4" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-elevated bg-sage/30 border-sage mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Your Data is Secure</h3>
                <p className="text-sm text-muted-foreground">
                  All your recordings, documents, and personal information are encrypted with bank-level 256-bit encryption. 
                  Only verified recipients will be able to access your will when conditions are met.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Agreement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all ${
                  agreed 
                    ? "bg-gold border-gold" 
                    : "border-border"
                }`}>
                  {agreed && <Check className="w-4 h-4 text-primary absolute top-0.5 left-0.5" />}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                I confirm that all the information provided is accurate and represents my true wishes. 
                I understand that this digital will can be updated at any time and that recipients will 
                only receive access under the conditions I have specified.
              </span>
            </label>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <Button
              variant="hero"
              size="xl"
              onClick={handleSubmit}
              disabled={!agreed || isSubmitting}
              className="gap-2 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Securing Your Will...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Finalize & Secure Will
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              You can make changes to your will at any time after submission
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ReviewWill;
