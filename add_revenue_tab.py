import re

with open("src/components/AdminDashboardView.tsx", "r") as f:
    content = f.read()

# Update activeTab useState
content = content.replace(
    "const [activeTab, setActiveTab] = useState<'overview' | 'live_radar' | 'user_needs' | 'roles' | 'audit' | 'data' | 'billing'>('overview');",
    "const [activeTab, setActiveTab] = useState<'overview' | 'live_radar' | 'user_needs' | 'roles' | 'audit' | 'data' | 'billing' | 'revenue'>('overview');"
)

# Add Lucide react icons BarChart3, CalendarDays
if "BarChart3" not in content:
    content = content.replace("import {\n", "import {\n  BarChart3,\n  CalendarDays,\n  Wallet,\n  Banknote,\n")
elif "Wallet" not in content:
    content = content.replace("BarChart3", "BarChart3, CalendarDays, Wallet, Banknote")

# Add the button
btn_code = """
        <button
          onClick={() => setActiveTab('revenue')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'revenue'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Revenus & Abonnements</span>
        </button>
"""
content = content.replace(
    "<span>Tarifs & Quotas</span>\n        </button>",
    "<span>Tarifs & Quotas</span>\n        </button>\n" + btn_code
)

with open("src/components/AdminDashboardView.tsx", "w") as f:
    f.write(content)
