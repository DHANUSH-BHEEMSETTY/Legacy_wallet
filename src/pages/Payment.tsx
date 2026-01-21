import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Lock, Check, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const Payment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "professional";
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const plans = {
    basic: {
      name: "Basic",
      price: "Free",
      period: "Forever",
      description: "Perfect for getting started",
    },
    professional: {
      name: "Professional",
      price: "$9.99",
      period: "per month",
      description: "Ideal for comprehensive estate planning",
    },
    legacy: {
      name: "Legacy",
      price: "$199",
      period: "one-time",
      description: "Complete peace of mind with lifetime access",
    },
  };

  const selectedPlan = plans[plan as keyof typeof plans] || plans.professional;

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, American Express",
      popular: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: "paypal",
      description: "Pay with your PayPal account",
      popular: true,
    },
    {
      id: "stripe",
      name: "Stripe",
      icon: "stripe",
      description: "Secure payment processing",
      popular: false,
    },
    {
      id: "apple",
      name: "Apple Pay",
      icon: "apple",
      description: "Pay with Apple Pay",
      popular: true,
    },
    {
      id: "google",
      name: "Google Pay",
      icon: "google",
      description: "Pay with Google Pay",
      popular: true,
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: "bank",
      description: "Direct bank transfer",
      popular: false,
    },
  ];

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData({ ...cardData, cardNumber: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setCardData({ ...cardData, expiryDate: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (plan === "basic") {
      // Free plan - no payment needed
      navigate("/login?plan=basic");
      return;
    }

    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      // TODO: Integrate actual payment processing here
      toast.success("Payment processed successfully! Redirecting...");
      navigate("/login?plan=" + plan);
    }, 2000);
  };

  const isFreePlan = plan === "basic";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link to="/pricing" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing
          </Link>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-1"
            >
              <div className="card-elevated p-6 sticky top-24">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-semibold text-foreground">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Billing</span>
                    <span className="font-semibold text-foreground">
                      {selectedPlan.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{selectedPlan.price}</span>
                  </div>
                  {!isFreePlan && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="text-foreground">$0.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Processing Fee</span>
                        <span className="text-foreground">$0.00</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-lg text-foreground">Total</span>
                    <span className="font-serif text-2xl font-bold text-gold">
                      {selectedPlan.price}
                    </span>
                  </div>
                  {selectedPlan.period !== "Forever" && (
                    <p className="text-xs text-muted-foreground">
                      {selectedPlan.period}
                    </p>
                  )}
                </div>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-gold" />
                  <span>256-bit SSL Encryption</span>
                </div>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-2"
            >
              <div className="card-elevated p-8">
                <div className="mb-8">
                  <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
                    {isFreePlan ? "Complete Your Signup" : "Complete Your Payment"}
                  </h1>
                  <p className="text-muted-foreground">
                    {isFreePlan
                      ? "No payment required. Create your account to get started."
                      : "Secure payment processing. Your information is encrypted and secure."}
                  </p>
                </div>

                {!isFreePlan && (
                  <>
                    {/* Payment Methods */}
                    <div className="mb-8">
                      <h3 className="font-semibold text-foreground mb-4">
                        Select Payment Method
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {paymentMethods.map((method) => {
                          const IconComponent = method.icon === "card" ? CreditCard : null;
                          return (
                            <button
                              key={method.id}
                              onClick={() => setPaymentMethod(method.id)}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                paymentMethod === method.id
                                  ? "border-gold bg-gold/10"
                                  : "border-border hover:border-gold/50"
                              } ${method.popular ? "ring-1 ring-gold/20" : ""}`}
                            >
                              <div className="flex flex-col items-center gap-2">
                                {IconComponent ? (
                                  <IconComponent className="w-6 h-6 text-gold" />
                                ) : (
                                  <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center">
                                    <span className="text-xs font-semibold">
                                      {method.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                                <span className="text-xs font-medium text-foreground text-center">
                                  {method.name}
                                </span>
                                {method.popular && (
                                  <span className="text-[10px] text-gold">Popular</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Card Payment Form */}
                    {paymentMethod === "card" && (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Cardholder Name
                          </label>
                          <Input
                            type="text"
                            placeholder="John Doe"
                            value={cardData.cardholderName}
                            onChange={(e) =>
                              setCardData({ ...cardData, cardholderName: e.target.value })
                            }
                            className="input-elevated"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Card Number
                          </label>
                          <Input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardData.cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            className="input-elevated"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Expiry Date
                            </label>
                            <Input
                              type="text"
                              placeholder="MM/YY"
                              value={cardData.expiryDate}
                              onChange={handleExpiryChange}
                              maxLength={5}
                              className="input-elevated"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              CVV
                            </label>
                            <Input
                              type="text"
                              placeholder="123"
                              value={cardData.cvv}
                              onChange={(e) =>
                                setCardData({
                                  ...cardData,
                                  cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                                })
                              }
                              maxLength={4}
                              className="input-elevated"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex items-start gap-2 p-4 bg-secondary/50 rounded-lg">
                          <Lock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground">
                            Your payment information is encrypted and secure. We never store your 
                            full card details on our servers.
                          </p>
                        </div>
                      </form>
                    )}

                    {/* Other Payment Methods */}
                    {paymentMethod !== "card" && (
                      <div className="p-6 bg-secondary/30 rounded-lg text-center">
                        <p className="text-muted-foreground mb-4">
                          {paymentMethod === "paypal" && "You will be redirected to PayPal to complete your payment."}
                          {paymentMethod === "apple" && "Complete your payment using Apple Pay on your device."}
                          {paymentMethod === "google" && "Complete your payment using Google Pay."}
                          {paymentMethod === "stripe" && "Secure payment processing via Stripe."}
                          {paymentMethod === "bank" && "Bank transfer details will be provided after order confirmation."}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Payment integration coming soon
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t border-border">
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleSubmit}
                    disabled={loading || (!isFreePlan && paymentMethod === "card" && (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.cardholderName))}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : isFreePlan ? (
                      "Create Free Account"
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Complete Payment
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>

                {/* Security Features */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">Security Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-gold" />
                      <span className="text-sm text-muted-foreground">256-bit SSL Encryption</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-gold" />
                      <span className="text-sm text-muted-foreground">PCI DSS Compliant</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-gold" />
                      <span className="text-sm text-muted-foreground">Secure Payment Gateway</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-gold" />
                      <span className="text-sm text-muted-foreground">No Card Storage</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
