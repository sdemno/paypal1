// Carica i dati salvati o usa i valori di partenza
let saldo = parseFloat(localStorage.getItem("saldo")) || 1250.00;
let transazioni = JSON.parse(localStorage.getItem("transazioni")) || [
  { tipo: "entrata", descrizione: "Saldo iniziale", importo: 1250.00, data: new Date().toLocaleString("it-IT") }
];

function formattaEuro(num) {
  return "€ " + num.toFixed(2).replace(".", ",");
}

function aggiornaSchermo() {
  document.getElementById("saldo").textContent = formattaEuro(saldo);
  
  const lista = document.getElementById("cronologia");
  lista.innerHTML = "";
  
  // mostra le ultime 10
  transazioni.slice().reverse().slice(0, 10).forEach(t => {
    const div = document.createElement("div");
    div.className = "transazione";
    div.innerHTML = `
      <div>
        <div>${t.descrizione}</div>
        <small style="color:#888">${t.data}</small>
      </div>
      <div class="${t.tipo === 'uscita' ? 'negativo' : 'positivo'}">
        ${t.tipo === 'uscita' ? '-' : '+'}${formattaEuro(t.importo)}
      </div>
    `;
    lista.appendChild(div);
  });
}

function mostraInvia() {
  document.getElementById("form-invia").classList.remove("hidden");
}

function nascondiInvia() {
  document.getElementById("form-invia").classList.add("hidden");
  document.getElementById("errore").classList.add("hidden");
  document.getElementById("email").value = "";
  document.getElementById("importo").value = "";
}

function inviaDenaro() {
  const email = document.getElementById("email").value.trim();
  const importo = parseFloat(document.getElementById("importo").value);
  const errore = document.getElementById("errore");

  if (!email || !email.includes("@")) {
    errore.textContent = "Inserisci un'email valida";
    errore.classList.remove("hidden");
    return;
  }
  if (!importo || importo <= 0) {
    errore.textContent = "Inserisci un importo valido";
    errore.classList.remove("hidden");
    return;
  }
  if (importo > saldo) {
    errore.textContent = "Saldo insufficiente";
    errore.classList.remove("hidden");
    return;
  }

  // Aggiorna saldo
  saldo -= importo;
  transazioni.push({
    tipo: "uscita",
    descrizione: "Inviato a " + email,
    importo: importo,
    data: new Date().toLocaleString("it-IT")
  });

  // Salva
  localStorage.setItem("saldo", saldo);
  localStorage.setItem("transazioni", JSON.stringify(transazioni));

  aggiornaSchermo();
  nascondiInvia();
  alert("Denaro inviato con successo (simulazione)!");
}

function aggiungiSoldi() {
  const quanti = parseFloat(prompt("Quanti euro vuoi aggiungere? (finti)", "100"));
  if (quanti && quanti > 0) {
    saldo += quanti;
    transazioni.push({
      tipo: "entrata",
      descrizione: "Aggiunta manuale",
      importo: quanti,
      data: new Date().toLocaleString("it-IT")
    });
    localStorage.setItem("saldo", saldo);
    localStorage.setItem("transazioni", JSON.stringify(transazioni));
    aggiornaSchermo();
  }
}

// Avvia
aggiornaSchermo();
