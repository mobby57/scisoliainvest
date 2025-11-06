import React, { useEffect, useState } from "react";
import { fetchAnnonces } from "./api";

export default function Annonces() {
  const [annonces, setAnnonces] = useState<any[]>([]);
  useEffect(() => { fetchAnnonces().then(setAnnonces); }, []);
  return (
    <div>
      <h2>Annonces immobilières</h2>
      {annonces.map(a => (
        <div key={a.id}>
          <h3>{a.titre}</h3>
          <p>{a.description}</p>
          <b>{a.prix} €</b> {a.localisation}
        </div>
      ))}
    </div>
  );
}
