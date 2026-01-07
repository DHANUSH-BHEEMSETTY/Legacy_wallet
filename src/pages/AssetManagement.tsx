import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Home,
  Car,
  Wallet,
  Smartphone,
  Package,
  Trash2,
  Edit2,
  Check,
  Users,
  X,
} from "lucide-react";
import Header from "@/components/layout/Header";

type AssetCategory = "property" | "vehicle" | "financial" | "digital" | "other";

interface Asset {
  id: number;
  name: string;
  category: AssetCategory;
  value: string;
  description: string;
  recipients: { name: string; share: number }[];
}

const AssetManagement = () => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 1,
      name: "Family Home",
      category: "property",
      value: "$450,000",
      description: "123 Main Street, Springfield",
      recipients: [{ name: "Sarah", share: 50 }, { name: "Michael", share: 50 }],
    },
    {
      id: 2,
      name: "Investment Portfolio",
      category: "financial",
      value: "$125,000",
      description: "Stocks and bonds at Fidelity",
      recipients: [{ name: "Sarah", share: 100 }],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "property" as AssetCategory,
    value: "",
    description: "",
  });

  const categories = [
    { id: "property", icon: Home, label: "Property" },
    { id: "vehicle", icon: Car, label: "Vehicle" },
    { id: "financial", icon: Wallet, label: "Financial" },
    { id: "digital", icon: Smartphone, label: "Digital" },
    { id: "other", icon: Package, label: "Other" },
  ];

  const getCategoryIcon = (category: AssetCategory) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.icon || Package;
  };

  const handleAddAsset = () => {
    if (newAsset.name && newAsset.value) {
      setAssets([
        ...assets,
        {
          id: Date.now(),
          ...newAsset,
          recipients: [],
        },
      ]);
      setNewAsset({ name: "", category: "property", value: "", description: "" });
      setShowAddModal(false);
    }
  };

  const handleDeleteAsset = (id: number) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link to="/create/audio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Recording
          </Link>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`progress-step ${step === 3 ? "progress-step-active" : step < 3 ? "progress-step-completed" : "progress-step-pending"}`}>
                  {step < 3 ? <Check className="w-4 h-4" /> : step}
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
              <h1 className="heading-section text-foreground mb-2">Manage Your Assets</h1>
              <p className="text-muted-foreground">Add and organize the assets you want to include in your will.</p>
            </div>
            <Button variant="gold" className="gap-2" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" />
              Add Asset
            </Button>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <button className="px-4 py-2 rounded-full bg-gold text-primary text-sm font-medium">
              All Assets
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Assets List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 mb-8"
          >
            {assets.map((asset) => {
              const Icon = getCategoryIcon(asset.category);
              return (
                <div key={asset.id} className="card-elevated">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground">{asset.name}</h3>
                        <span className="font-serif text-lg font-semibold text-gold">{asset.value}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{asset.description}</p>
                      
                      {/* Recipients */}
                      {asset.recipients.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {asset.recipients.map((r, i) => (
                            <span key={i} className="px-2 py-1 rounded-full bg-secondary text-xs font-medium">
                              {r.name}: {r.share}%
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button 
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                        onClick={() => handleDeleteAsset(asset.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {assets.length === 0 && (
              <div className="card-elevated text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No assets yet</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first asset.</p>
                <Button variant="gold" onClick={() => setShowAddModal(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Asset
                </Button>
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <Link to="/create/audio">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <Link to="/recipients">
              <Button variant="gold" className="gap-2">
                Continue to Recipients
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Add Asset Modal */}
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
                <h2 className="font-serif text-xl font-semibold text-foreground">Add New Asset</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-secondary rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Asset Name</label>
                  <input
                    type="text"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    placeholder="e.g., Family Home"
                    className="input-elevated"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <div className="grid grid-cols-5 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setNewAsset({ ...newAsset, category: cat.id as AssetCategory })}
                        className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                          newAsset.category === cat.id
                            ? "bg-gold text-primary"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        <cat.icon className="w-5 h-5" />
                        <span className="text-xs">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Estimated Value</label>
                  <input
                    type="text"
                    value={newAsset.value}
                    onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
                    placeholder="e.g., $100,000"
                    className="input-elevated"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description (Optional)</label>
                  <textarea
                    value={newAsset.description}
                    onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                    placeholder="Additional details about this asset..."
                    rows={3}
                    className="input-elevated resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="ghost" className="flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button variant="gold" className="flex-1" onClick={handleAddAsset}>
                  Add Asset
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetManagement;
