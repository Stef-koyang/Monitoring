import { useEffect, useState } from "react";

type RelayState = {
  relay1: boolean;
  relay2: boolean;
  switchLocal: boolean;
};

export default function Dashboard() {
  const [state, setState] = useState<RelayState>({
    relay1: false,
    relay2: false,
    switchLocal: false,
  });
  const [status, setStatus] = useState<string>("");

  // Récupération état toutes les 2s
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch("/api/relay");
        const data = await res.json();
        setState(data);
      } catch {
        setStatus("❌ Erreur récupération état");
      }
    };
    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fonction mise à jour état
  const updateRelay = async (update: Partial<RelayState>) => {
    try {
      const res = await fetch("/api/relay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      const data = await res.json();
      setState(data.state);
      setStatus("✅ Action réussie");
    } catch {
      setStatus("❌ Action échouée");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-lg space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Tableau de Bord Maison Intelligente
      </h1>

      {/* État relais */}
      <div className="space-y-2">
        <p>💡 Ampoule : {state.relay1 ? "Allumée" : "Éteinte"}</p>
        <p>🛏️ Chambre (Relay2) : {state.relay2 ? "Actif" : "Coupé"}</p>
        <p>🔘 Switch local : {state.switchLocal ? "ON" : "OFF"}</p>
      </div>

      {/* Boutons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-700"
          onClick={() => updateRelay({ relay1: !state.relay1 })}
        >
          ⚡ Écran (Relay1)
        </button>
        <button
          className="p-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-700"
          onClick={() => updateRelay({ switchLocal: !state.switchLocal })}
        >
          💡 Éclairage (Switch Local)
        </button>
        <button
          className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-700 col-span-2"
          onClick={() => updateRelay({ relay2: !state.relay2 })}
        >
          🛏️ Chambre (Relay2)
        </button>
      </div>

      {/* Status temps réel */}
      <div className="text-center text-sm text-gray-600">{status}</div>
    </div>
  );
}
