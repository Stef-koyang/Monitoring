import { NextApiRequest, NextApiResponse } from "next";

// stockage temporaire en mémoire
let relayState = {
  relay1: false,
  relay2: false,
  switchLocal: false,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(relayState);
  }

  if (req.method === "POST") {
    const { relay1, relay2, switchLocal } = req.body;

    if (relay1 !== undefined) relayState.relay1 = relay1;
    if (relay2 !== undefined) relayState.relay2 = relay2;
    if (switchLocal !== undefined) relayState.switchLocal = switchLocal;

    return res.status(200).json({ message: "État mis à jour", state: relayState });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Méthode ${req.method} non autorisée`);
}
