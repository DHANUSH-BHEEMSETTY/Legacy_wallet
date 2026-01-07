import { Mic, Video, MessageSquare, FolderOpen, Users, Bell } from "lucide-react";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: Mic,
      title: "Audio Recording",
      description: "Record your wishes naturally with your voice. Our AI transcribes and organizes everything.",
      color: "from-gold to-gold-light",
    },
    {
      icon: Video,
      title: "Video Messages",
      description: "Create personal video messages for your loved ones to be shared when the time is right.",
      color: "from-navy to-navy-light",
    },
    {
      icon: MessageSquare,
      title: "Chat Interface",
      description: "Prefer typing? Our guided chat helps you create your will step by step.",
      color: "from-sage-dark to-sage",
    },
    {
      icon: FolderOpen,
      title: "Asset Management",
      description: "Organize and categorize all your assets—property, investments, digital assets, and more.",
      color: "from-gold to-gold-light",
    },
    {
      icon: Users,
      title: "Recipient Portal",
      description: "Secure access for beneficiaries with verification and controlled release of information.",
      color: "from-navy to-navy-light",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Automated reminders to keep your will updated and notify recipients when needed.",
      color: "from-sage-dark to-sage",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-gold font-medium text-sm uppercase tracking-wider mb-4 block">
            Features
          </span>
          <h2 className="heading-section text-foreground mb-4">
            Everything You Need to Secure Your Legacy
          </h2>
          <p className="body-large">
            Create your digital will in the way that feels most natural to you—audio, video, or text.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-interactive group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
