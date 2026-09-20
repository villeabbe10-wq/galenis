import re

with open("src/components/ApiPortal/ApiPortalView.tsx", "r") as f:
    content = f.read()

# 1. Update imports
old_import = "import {\n  Code2,"
if old_import not in content:
    old_import = "import { \n  Code2,"

new_imports_items = "  ShoppingBag,\n  Radio,\n  FileSpreadsheet,\n  Filter,\n  Smartphone,\n  CreditCard,\n  ChevronDown,\n"
content = content.replace("import { \n  Code2,", "import { \n" + new_imports_items + "  Code2,")
if new_imports_items not in content:
    content = content.replace("import {\n  Code2,", "import {\n" + new_imports_items + "  Code2,")

# 2. Update ApiPortalTab type
content = content.replace(
    "  | 'SDK'\n  | 'WEBHOOKS' \n  | 'STATUS'",
    "  | 'SDK'\n  | 'WEBHOOKS'\n  | 'LOGS'\n  | 'EVENTS'\n  | 'STATUS'"
)

print("Imports & types updated")
with open("src/components/ApiPortal/ApiPortalView.tsx", "w") as f:
    f.write(content)
