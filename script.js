const SUPABASE_URL = 'https://tfhbetulmcvlunklzypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmaGJldHVsbWN2bHVua2x6eXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODUyMzIsImV4cCI6MjA1NTk2MTIzMn0.WOniG3Gv-9iCAsfQ-jS9X2Z2S7m0f-8u9vWvG1-pE_k'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const animals = { "00": "Ballena", "0": "Delfín", "1": "Carnero", "2": "Toro", "3": "Ciempiés", "4": "Alacrán", "5": "León", "6": "Rana", "7": "Perico", "8": "Ratón", "9": "Águila", "10": "Tigre", "11": "Gato", "12": "Caballo", "13": "Mono", "14": "Paloma", "15": "Zorro", "16": "Oso", "17": "Pavo", "18": "Burro", "19": "Chivo", "20": "Cochino", "21": "Gallo", "22": "Camello", "23": "Cebra", "24": "Iguana", "25": "Gallina", "26": "Vaca", "27": "Perro", "28": "Zamuro", "29": "Elefante", "30": "Caimán", "31": "Lapa", "32": "Ardilla", "33": "Pescado", "34": "Venado", "35": "Jirafa", "36": "Culebra" };

const hours = ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM"];

let selectedDate = new Date().toISOString().split('T')[0];

function initApp() {
    document.getElementById('date-picker').value = selectedDate;
    updateTable();
}

function updateTable() {
    const tableBody = document.getElementById('main-table');
    tableBody.innerHTML = "";
    const now = new Date();
    const isToday = selectedDate === now.toISOString().split('T')[0];
    
    hours.forEach((h, r) => {
        const row = document.createElement('tr');
        let h24 = parseInt(h);
        if (h.includes("PM") && h24 !== 12) h24 += 12;
        if (h.includes("AM") && h24 === 12) h24 = 0;
        if (isToday && now.getHours() === h24) row.classList.add('live-row');

        let html = `<td class="hour-cell">${h}</td>`;
        for (let c = 0; c < 7; c++) {
            html += `<td>
                <input type="text" class="cell-input" maxlength="2" id="r${r}c${c}" oninput="handleInput(this)" placeholder="-">
                <div class="animal-display" id="animal-r${r}c${c}"></div>
            </td>`;
        }
        row.innerHTML = html;
        tableBody.appendChild(row);
    });
    
    const displayDate = new Date(selectedDate + "T00:00:00");
    document.getElementById('current-date').innerText = displayDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    loadFromSupabase();
}

function changeDate() {
    selectedDate = document.getElementById('date-picker').value;
    updateTable();
}

function handleInput(input) {
    const val = input.value.trim();
    const animalDiv = document.getElementById('animal-' + input.id);
    if (animals[val]) {
        animalDiv.innerText = animals[val];
        animalDiv.style.color = "#39ff14";
        input.style.borderColor = "#39ff14";
    } else {
        animalDiv.innerText = val === "" ? "" : "??";
        animalDiv.style.color = "#ff3131";
        input.style.borderColor = val === "" ? "#444" : "#ff3131";
    }
}

async function saveToSupabase() {
    const updates = [];
    document.querySelectorAll('.cell-input').forEach(input => {
        if(input.value) {
            // Guardamos con ID único: fecha + id de celda
            updates.push({ celda_id: selectedDate + "_" + input.id, valor: input.value });
        }
    });
    const { error } = await _supabase.from('resultados').upsert(updates);
    if (error) alert("Error: " + error.message);
    else alert("🚀 Guardado para el día: " + selectedDate);
}

async function loadFromSupabase() {
    const { data } = await _supabase.from('resultados').select('*');
    if (data) {
        data.forEach(item => {
            // Solo cargamos los que correspondan a la fecha seleccionada
            if(item.celda_id.startsWith(selectedDate)) {
                const realId = item.celda_id.split('_')[1];
                const el = document.getElementById(realId);
                if (el) { el.value = item.valor; handleInput(el); }
            }
        });
    }
}

function resetWeek() { if(confirm("¿Limpiar vista actual?")) updateTable(); }
window.onload = initApp;
