import re

with open("src/components/ApiPortal/ApiPortalView.tsx", "r") as f:
    content = f.read()

# Add AlertTriangle to lucide-react imports if not there (it is there)
# Let's insert the warning box
alert_box = """
                      {/* Alert Quota */}
                      {percentage >= 80 && (
                        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-4">
                          <div className="flex gap-3">
                            <div className="bg-rose-100 p-2 rounded-full h-fit">
                              <AlertTriangle className="w-5 h-5 text-rose-600" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-rose-900 text-sm">Attention : Quota API presque atteint ({percentage}%)</h4>
                              <p className="text-xs text-rose-700 mt-1 font-medium">Votre clé API atteindra bientôt sa limite journalière de {limit.toLocaleString()} requêtes. Vous risquez des erreurs HTTP 429.</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => askAiContextual("Bonjour, mon application approche de la limite de quota gratuit. Je souhaite demander une extension ou mettre à jour mon plan tarifaire.")}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs whitespace-nowrap shadow-sm transition-colors cursor-pointer shrink-0"
                          >
                            Augmenter mon quota
                          </button>
                        </div>
                      )}
"""

content = content.replace("{/* Stat Cards */}", alert_box + "\n                      {/* Stat Cards */}")

# Modify displayUsed calculation to trigger the warning
# const displayUsed = rawUsed > 0 ? rawUsed : 327;
content = content.replace("const displayUsed = rawUsed > 0 ? rawUsed : 327;", "const displayUsed = rawUsed > 0 ? rawUsed : 870;")

with open("src/components/ApiPortal/ApiPortalView.tsx", "w") as f:
    f.write(content)
