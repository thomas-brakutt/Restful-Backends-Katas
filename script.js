const pEl = document.querySelector("p");
const btn = document.querySelector("button");

// Funktion für die Datenabfrage
function text() {
  fetch("https://dummy-apis.netlify.app/api/quote")
    .then((response) => {
      // empfängt die Daten aus der api
      if (!response.ok) {
        // testet ob status ok ist
        throw new Error("Netzwerkantwort war nicht ok"); // wenn nicht = errormeldung
      }
      return response.json();
    })
    // empfangenen Daten aus der api werden im p-Element eingefügt
    .then((data) => {
      pEl.innerText = data.quote + " - " + data.author + " - "; // Zitat + Autor einfügen
    })
    .catch((error) => {
      console.error("Es gab ein Problem mit der Fetch-Operation:", error);
      pEl.innerText = "Fehler beim Laden des Zitats.";
    });
}

// Event Listener hinzufügen
btn.addEventListener("click", text);
