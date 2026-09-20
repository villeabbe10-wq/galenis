with open("src/components/AdminDashboardView.tsx", "r") as f:
    content = f.read()

content = content.replace("name: 'Pharmacie de l'Aéroport'", "name: \"Pharmacie de l'Aéroport\"")

with open("src/components/AdminDashboardView.tsx", "w") as f:
    f.write(content)
