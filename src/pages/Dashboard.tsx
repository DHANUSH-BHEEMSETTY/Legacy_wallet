import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Plus,
  FileText,
  Mic,
  Video,
  MessageSquare,
  FolderOpen,
  Users,
  Settings,
  Bell,
  Shield,
  ChevronRight,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import Header from "@/components/layout/Header";

const Dashboard = () => {
  const [wills] = useState([
    {
      id: 1,
      title: "Primary Will",
      status: "In Progress",
      progress: 75,
      lastUpdated: "2 hours ago",
      assets: 12,
      recipients: 5,
    },
    {
      id: 2,
      title: "Backup Digital Will",
      status: "Draft",
      progress: 30,
      lastUpdated: "3 days ago",
      assets: 4,
      recipients: 2,
    },
  ]);

  const quickActions = [
    { icon: Mic, label: "Record Audio", href: "/create/audio", color: "from-gold to-gold-light" },
    { icon: Video, label: "Record Video", href: "/create/video", color: "from-navy to-navy-light" },
    { icon: MessageSquare, label: "Chat Will", href: "/create/chat", color: "from-sage-dark to-sage" },
    { icon: FolderOpen, label: "Manage Assets", href: "/assets", color: "from-gold to-gold-light" },
  ];

  const stats = [
    { label: "Total Assets", value: "16", icon: FolderOpen },
    { label: "Recipients", value: "7", icon: Users },
    { label: "Media Files", value: "5", icon: Video },
    { label: "Last Backup", value: "Today", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="heading-section text-foreground mb-2">Welcome back, John</h1>
            <p className="text-muted-foreground">Manage your digital legacy with confidence.</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="card-elevated text-center">
                <stat.icon className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="font-serif text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.href}>
                  <div className="card-interactive flex flex-col items-center py-6 group">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* My Wills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-semibold text-foreground">My Wills</h2>
              <Link to="/create">
                <Button variant="gold" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Will
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {wills.map((will) => (
                <Link key={will.id} to={`/will/${will.id}`}>
                  <div className="card-interactive flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{will.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          will.status === "In Progress" 
                            ? "bg-gold/20 text-gold" 
                            : "bg-secondary text-muted-foreground"
                        }`}>
                          {will.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FolderOpen className="w-3 h-3" />
                          {will.assets} assets
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {will.recipients} recipients
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {will.lastUpdated}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2">
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-500"
                            style={{ width: `${will.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Link>
              ))}

              {/* Empty State */}
              {wills.length === 0 && (
                <div className="card-elevated text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No wills yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first digital will to get started.</p>
                  <Link to="/create">
                    <Button variant="gold" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Your First Will
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
