with open("src/components/AdminDashboardView.tsx", "r") as f:
    content = f.read()

lucide_imports = "BarChart3, CalendarDays, Wallet, Banknote, "
if "Wallet" not in content[:1000]:
    content = content.replace("import { \n  ShieldCheck", "import { \n  " + lucide_imports + "\n  ShieldCheck")
    # Also handle if it's single line
    content = content.replace("import {   ShieldCheck", "import { " + lucide_imports + "  ShieldCheck")

with open("src/components/AdminDashboardView.tsx", "w") as f:
    f.write(content)
