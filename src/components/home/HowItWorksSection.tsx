import { motion } from "framer-motion";
import { UserPlus, FileEdit, Share2, Shield } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Create Your Account",
      description: "Sign up securely with email, phone, or your favorite social account. Your data is protected from day one.",
    },
    {
      number: "02",
      icon: FileEdit,
      title: "Record Your Wishes",
      description: "Choose audio, video, or chat to express your final wishes. Our AI helps organize and structure everything.",
    },
    {
      number: "03",
      icon: Share2,
      title: "Assign Recipients",
      description: "Add beneficiaries and specify what each person receives. Set conditions and delivery preferences.",
    },
    {
      number: "04",
      icon: Shield,
      title: "Secure & Share",
      description: "Your will is encrypted and stored securely. Recipients are notified when the time comes.",
    },
  ];

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-gold font-medium text-sm uppercase tracking-wider mb-4 block">
            How It Works
          </span>
          <h2 className="heading-section text-foreground mb-4">
            Create Your Will in Minutes
          </h2>
          <p className="body-large">
            A simple four-step process designed to be completed in under 10 minutes.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center shadow-gold">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
