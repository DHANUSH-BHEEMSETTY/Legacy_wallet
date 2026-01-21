import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Users,
  Mail,
  Phone,
  Trash2,
  Edit2,
  Check,
  X,
  UserPlus,
  Shield,
  Loader2,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { validateName, validateEmail, validatePhone, validateRelationship } from "@/lib/validation";

interface Recipient {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  relationship: string | null;
  is_verified: boolean;
}

const Recipients = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [newRecipient, setNewRecipient] = useState({
    full_name: "",
    email: "",
    phone: "",
    relationship: "",
  });

  const relationships = [
    t("recipients.spouse"),
    t("recipients.child"),
    t("recipients.sibling"),
    t("recipients.parent"),
    t("recipients.friend"),
    t("recipients.charity"),
    t("recipients.other"),
  ];

  useEffect(() => {
    if (user) fetchRecipients();
  }, [user]);

  const fetchRecipients = async () => {
    try {
      const { data, error } = await supabase
        .from("recipients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setRecipients(data);
    } catch (error) {
      console.error("Error fetching recipients:", error);
      toast.error(t("recipients.failedToLoad"));
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async (recipientId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-verification-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ recipientId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send verification email");
      }

      return true;
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  };

  const handleEditRecipient = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setNewRecipient({
      full_name: recipient.full_name,
      email: recipient.email || "",
      phone: recipient.phone || "",
      relationship: recipient.relationship || "",
    });
    setShowAddModal(true);
  };

  const handleSaveRecipient = async () => {
    if (!user) {
      toast.error("Please log in to save recipients");
      return;
    }

    // Validate full name
    const nameValidation = validateName(newRecipient.full_name);
    if (!nameValidation.isValid) {
      toast.error(nameValidation.error || t("recipients.pleaseEnterName"));
      return;
    }

    // Validate email if provided
    let emailValue = null;
    if (newRecipient.email && newRecipient.email.trim()) {
      const emailValidation = validateEmail(newRecipient.email);
      if (!emailValidation.isValid) {
        toast.error(emailValidation.error || "Please enter a valid email address");
        return;
      }
      emailValue = emailValidation.sanitized;
    }

    // Validate phone if provided
    let phoneValue = null;
    if (newRecipient.phone && newRecipient.phone.trim()) {
      const phoneValidation = validatePhone(newRecipient.phone);
      if (!phoneValidation.isValid) {
        toast.error(phoneValidation.error || "Please enter a valid phone number");
        return;
      }
      phoneValue = phoneValidation.sanitized;
    }

    // Validate relationship if provided
    let relationshipValue = null;
    if (newRecipient.relationship && newRecipient.relationship.trim()) {
      const relationshipValidation = validateRelationship(newRecipient.relationship);
      if (!relationshipValidation.isValid) {
        toast.error(relationshipValidation.error || "Invalid relationship");
        return;
      }
      relationshipValue = relationshipValidation.sanitized;
    }

    setSaving(true);
    try {
      if (editingRecipient) {
        // Update existing recipient
        const updateData: any = {
          full_name: nameValidation.sanitized,
          email: emailValue,
          phone: phoneValue,
          relationship: relationshipValue,
        };

        // Note: Verification code generation and hashing is handled by send-verification-email function
        // We don't need to generate codes here anymore

        const { data, error } = await supabase
          .from("recipients")
          .update(updateData)
          .eq("id", editingRecipient.id)
          .select()
          .single();

        if (error) throw error;
        
        setRecipients(recipients.map(r => r.id === editingRecipient.id ? data : r));
        toast.success(t("recipients.recipientUpdated") || "Recipient updated successfully");

        // Send verification email if email changed and wasn't verified
        if (emailValue && emailValue !== editingRecipient.email && !editingRecipient.is_verified && data.id) {
          try {
            await sendVerificationEmail(data.id);
            toast.success(t("recipients.verificationEmailSent"));
          } catch (error) {
            console.error("Error sending verification email:", error);
            toast.error(t("recipients.failedToSendVerificationEmail"));
          }
        }
      } else {
        // Add new recipient
        // Note: Verification code generation and hashing is handled by send-verification-email function
        // We don't need to generate codes here anymore

        const { data, error } = await supabase
          .from("recipients")
          .insert({
            user_id: user.id,
            full_name: nameValidation.sanitized,
            email: emailValue,
            phone: phoneValue,
            relationship: relationshipValue,
          })
          .select()
          .single();

        if (error) throw error;
        
        setRecipients([data, ...recipients]);
        toast.success(t("recipients.recipientAdded"));

        // Send verification email if email is provided
        if (emailValue && data.id) {
          try {
            await sendVerificationEmail(data.id);
            toast.success(t("recipients.verificationEmailSent"));
          } catch (error) {
            console.error("Error sending verification email:", error);
            toast.error(t("recipients.failedToSendVerificationEmail"));
          }
        }
      }

      setNewRecipient({ full_name: "", email: "", phone: "", relationship: "" });
      setEditingRecipient(null);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error saving recipient:", error);
      toast.error(editingRecipient ? (t("recipients.failedToUpdate") || "Failed to update recipient") : t("recipients.failedToAdd"));
    } finally {
      setSaving(false);
    }
  };

  const handleSendVerificationEmail = async (recipientId: string) => {
    try {
      await sendVerificationEmail(recipientId);
      toast.success(t("recipients.verificationEmailSent"));
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error(t("recipients.failedToSendVerificationEmail"));
    }
  };

  const handleDeleteRecipient = async (id: string) => {
    try {
      const { error } = await supabase.from("recipients").delete().eq("id", id);
      if (error) throw error;
      
      setRecipients(recipients.filter((r) => r.id !== id));
      toast.success(t("recipients.recipientRemoved"));
    } catch (error) {
      console.error("Error deleting recipient:", error);
      toast.error(t("recipients.failedToRemove"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link to="/assets" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t("recipients.backToAssets")}
          </Link>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`progress-step ${step === 4 ? "progress-step-active" : "progress-step-completed"}`}>
                  {step < 4 ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 4 && <div className="w-8 h-0.5 bg-border" />}
              </div>
            ))}
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="heading-section text-foreground mb-2">{t("recipients.addRecipients")}</h1>
              <p className="text-muted-foreground">{t("recipients.specifyWhoReceives")}</p>
            </div>
            <Button variant="gold" className="gap-2" onClick={() => setShowAddModal(true)}>
              <UserPlus className="w-4 h-4" />
              {t("recipients.addRecipient")}
            </Button>
          </motion.div>

          {/* Recipients List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 mb-8"
          >
            {recipients.map((recipient) => (
              <div key={recipient.id} className="card-elevated">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-primary-foreground font-semibold text-lg">
                    {recipient.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{recipient.full_name}</h3>
                      {recipient.relationship && (
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                          {recipient.relationship}
                        </span>
                      )}
                      {recipient.is_verified && (
                        <span className="px-2 py-0.5 rounded-full bg-sage text-xs font-medium text-foreground flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {t("recipients.verified")}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {recipient.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {recipient.email}
                        </span>
                      )}
                      {recipient.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {recipient.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!recipient.is_verified && recipient.email && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendVerificationEmail(recipient.id)}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        {t("recipients.sendVerification")}
                      </Button>
                    )}
                    <button 
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      onClick={() => handleEditRecipient(recipient)}
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button 
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      onClick={() => handleDeleteRecipient(recipient.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {recipients.length === 0 && (
              <div className="card-elevated text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{t("recipients.noRecipientsYet")}</h3>
                <p className="text-muted-foreground mb-4">{t("recipients.addPeopleWhoReceive")}</p>
                <Button variant="gold" onClick={() => setShowAddModal(true)} className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  {t("recipients.addYourFirstRecipient")}
                </Button>
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <Link to="/assets">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t("common.back")}
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {t("common.secure") || "Secure & Encrypted"}
              </p>
              <Link to="/review">
                <Button variant="gold" className="gap-2">
                  {t("wills.reviewWill")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Add Recipient Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-elevated w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {editingRecipient ? (t("recipients.editRecipient") || "Edit Recipient") : t("recipients.addRecipient")}
                </h2>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRecipient(null);
                    setNewRecipient({ full_name: "", email: "", phone: "", relationship: "" });
                  }} 
                  className="p-2 hover:bg-secondary rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("recipients.fullName")}</label>
                  <input
                    type="text"
                    value={newRecipient.full_name}
                    onChange={(e) => setNewRecipient({ ...newRecipient, full_name: e.target.value })}
                    placeholder="e.g., John Smith"
                    className="input-elevated"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("recipients.email")} ({t("common.optional") || "Optional"})</label>
                  <input
                    type="email"
                    value={newRecipient.email}
                    onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                    placeholder="e.g., john@email.com"
                    className="input-elevated"
                    maxLength={255}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("recipients.phone")} ({t("common.optional") || "Optional"})</label>
                  <input
                    type="tel"
                    value={newRecipient.phone}
                    onChange={(e) => setNewRecipient({ ...newRecipient, phone: e.target.value })}
                    placeholder="e.g., +1 555-0123"
                    className="input-elevated"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("recipients.relationship")}</label>
                  <div className="flex flex-wrap gap-2">
                    {relationships.map((rel) => (
                      <button
                        key={rel}
                        onClick={() => setNewRecipient({ ...newRecipient, relationship: rel })}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          newRecipient.relationship === rel
                            ? "bg-gold text-primary"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="ghost" 
                  className="flex-1" 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRecipient(null);
                    setNewRecipient({ full_name: "", email: "", phone: "", relationship: "" });
                  }}
                >
                  {t("common.cancel")}
                </Button>
                <Button variant="gold" className="flex-1" onClick={handleSaveRecipient} disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    editingRecipient ? (t("recipients.updateRecipient") || "Update Recipient") : t("recipients.addRecipient")
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recipients;
