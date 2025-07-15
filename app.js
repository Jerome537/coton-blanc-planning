// Configuration
const PASSWORD = 'CotonBlanc2024!';
const DATA_URL = './data/interventions.json';

let interventionsData = [];
let currentDate = new Date();
let currentView = 'month';
let currentFilter = 'all';

// Données d'exemple pour cette semaine
function generateExampleData() {
    const today = new Date();
    const examples = [];
    
    // Forcer la semaine actuelle (14-20 juillet 2025 selon votre capture)
    const currentWeekStart = new Date(2025, 6, 14); // 14 juillet 2025
    
    // Exemples d'interventions pour chaque jour de la semaine
    const clients = [
        { name: "Mairie de Papeete", address: "Rue du Général de Gaulle, 98714 Papeete" },
        { name: "Centre Vaima", address: "Avenue du Prince Hinoi, 98714 Papeete" },
        { name: "Clinique Paofai", address: "Boulevard Pomare, 98713 Papeete" },
        { name: "OPT - Office des Postes", address: "Rue Édouard Ahnne, 98714 Papeete" },
        { name: "Hôtel InterContinental", address: "Pointe Tata'a, 98702 Faa'a" },
        { name: "Résidence Lotus", address: "Avenue du Commandant Destremau, 98713 Papeete" },
        { name: "Lycée Paul Gauguin", address: "Avenue de Taaone, 98716 Pirae" },
        { name: "Banque de Polynésie", address: "Boulevard Pomare, 98714 Papeete" },
        { name: "Restaurant Le Coco's", address: "Avenue du Prince Hinoi, 98714 Papeete" },
        { name: "Pharmacie de la Cathédrale", address: "Place Notre-Dame, 98714 Papeete" }
    ];
    
    const equipes = ["Équipe 1 - Rouge", "Équipe 2 - Verte", "Équipe 3 - Bleue", "Équipe 4 - Jaune", "Équipe 5 - Violette"];
    const equipesColors = {
        "Équipe 1 - Rouge": "red",
        "Équipe 2 - Verte": "green", 
        "Équipe 3 - Bleue": "blue",
        "Équipe 4 - Jaune": "yellow",
        "Équipe 5 - Violette": "purple"
    };
    
    const materiels = [
        ["Monobrosse", "Échafaudage"],
        ["Perche", "Traitement spécifique"],
        ["Monobrosse"],
        ["Échafaudage", "Perche"],
        []
    ];
    
    // Ajout des catégories de prestations
    const categories = [
        "Nettoyage bureaux",
        "Entretien extérieur", 
        "Vitrerie",
        "Désinfection",
        "Nettoyage industriel",
        "Entretien résidentiel"
    ];
    
    // Générer des interventions pour chaque jour de la semaine (lundi à dimanche)
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        
        // 2-4 interventions par jour
        const interventionsCount = Math.floor(Math.random() * 3) + 2;
        
        for (let j = 0; j < interventionsCount; j++) {
            const client = clients[Math.floor(Math.random() * clients.length)];
            const equipeIndex = Math.floor(Math.random() * equipes.length);
            const equipe = equipes[equipeIndex];
            const hour = 8 + Math.floor(Math.random() * 10); // Entre 8h et 18h
            const duration = 1 + Math.floor(Math.random() * 4); // 1 à 4 heures
            
            const startDate = new Date(date);
            startDate.setHours(hour, 0, 0, 0);
            
            const endDate = new Date(startDate);
            endDate.setHours(hour + duration, 0, 0, 0);
            
            examples.push({
                id: `example-${i}-${j}`,
                title: client.name,
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                equipe: equipe,
                equipeColor: equipesColors[equipe],
                adresse: client.address,
                commune: "Papeete",
                materiel: materiels[Math.floor(Math.random() * materiels.length)],
                instructions: j === 0 ? "Nettoyage complet des bureaux" : "Entretien régulier",
                statut: "Intervention programmée",
                membres: [],
                // NOUVEAUX CHAMPS
                categorie: categories[Math.floor(Math.random() * categories.length)],
                duree: duration,
                telephone: "+689 40 " + Math.floor(Math.random() * 900000 + 100000)
            });
        }
    }
    
    console.log('Interventions générées:', examples.length);
    console.log('Exemple d\'intervention:', examples[0]);
    
    return examples;
}

// Vérifier si déjà connecté
if (sessionStorage.getItem('authenticated') === 'true') {
    showApp();
}

// Fonctions d'authentification
function login() {
    const password = document.getElementById('passwordInput').value;
    if (password === PASSWORD) {
        sessionStorage.setItem('authenticated', 'true');
        showApp();
    } else {
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('passwordInput').value = '';
    }
}

function logout() {
    sessionStorage.removeItem('authenticated');
    location.reload();
}

function showApp() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    loadInterventions();
}

// Charger les données
async function loadInterventions() {
    try {
        // Pour la démo, utiliser les données d'exemple
        interventionsData = generateExampleData();
        
        // Debug : afficher les équipes présentes
        const equipes = [...new Set(interventionsData.map(i => i.equipe))];
        console.log('Équipes dans les données:', equipes);
        console.log('Nombre total d\'interventions:', interventionsData.length);
        
        // Dans un cas réel, décommenter ce qui suit :
        // const response = await fetch(DATA_URL);
        // const data = await response.json();
        // interventionsData = data.interventions;
        
        // Afficher la dernière mise à jour
        document.getElementById('lastUpdate').textContent = 
            `Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`;
        
        renderView();
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Utiliser les données d'exemple en cas d'erreur
        interventionsData = generateExampleData();
        renderView();
    }
}

// Gestion des vues
function switchView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Cacher toutes les vues
    document.getElementById('monthlyView').style.display = 'none';
    document.getElementById('weeklyView').style.display = 'none';
    document.getElementById('dailyView').style.display = 'none';
    
    renderView();
}

function renderView() {
    switch(currentView) {
        case 'month':
            renderMonthlyView();
            break;
        case 'week':
            renderWeeklyView();
            break;
        case 'day':
            renderDailyView();
            break;
    }
    updatePeriodTitle();
}

function updatePeriodTitle() {
    let title = '';
    const options = { month: 'long', year: 'numeric' };
    
    switch(currentView) {
        case 'month':
            title = currentDate.toLocaleDateString('fr-FR', options);
            break;
        case 'week':
            const weekStart = getWeekStart(currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            title = `Semaine du ${weekStart.toLocaleDateString('fr-FR')} au ${weekEnd.toLocaleDateString('fr-FR')}`;
            break;
        case 'day':
            title = currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            break;
    }
    
    document.getElementById('currentPeriod').textContent = title;
}

// Vue mensuelle
function renderMonthlyView() {
    document.getElementById('monthlyView').style.display = 'grid';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    let html = '';
    
    // En-têtes des jours
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    dayNames.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Jours vides avant le premier jour
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day" style="background: #f7fafc;"></div>';
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayInterventions = getInterventionsForDate(dateStr);
        const isToday = today.toDateString() === new Date(year, month, day).toDateString();
        
        html += `<div class="calendar-day ${isToday ? 'today' : ''}">
            <div class="calendar-day-number">${day}</div>`;
        
        dayInterventions.forEach(intervention => {
            const equipeClass = getEquipeClass(intervention.equipe);
            html += `<div class="intervention-card ${equipeClass}" onclick="showIntervention('${intervention.id}')" title="${intervention.categorie} - ${intervention.duree}h">
                <strong>${intervention.title}</strong>
                <small style="display: block; font-size: 10px; opacity: 0.8;">
                    ${intervention.categorie} • ${intervention.duree}h
                </small>
            </div>`;
        });
        
        html += '</div>';
    }
    
    document.getElementById('monthlyView').innerHTML = html;
}

// Vue hebdomadaire
function renderWeeklyView() {
    document.getElementById('weeklyView').style.display = 'block';
    
    const weekStart = getWeekStart(currentDate);
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    let html = '<div class="weekly-grid">';
    
    // En-tête avec heures
    html += '<div class="time-slot"></div>';
    
    // En-têtes des jours
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const isToday = date.toDateString() === new Date().toDateString();
        
        html += `<div class="weekly-day-header ${isToday ? 'today' : ''}">
            ${dayNames[date.getDay()]}<br>
            <small>${date.getDate()}/${date.getMonth() + 1}</small>
        </div>`;
    }
    
    // Créer les colonnes pour chaque jour
    html += '</div><div class="weekly-grid" style="grid-template-rows: repeat(13, 60px);">';
    
    // Heures (8h à 20h)
    for (let hour = 8; hour <= 20; hour++) {
        html += `<div class="time-slot">${hour}:00</div>`;
        
        // Colonnes pour chaque jour
        for (let day = 0; day < 7; day++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + day);
            const dateStr = date.toISOString().split('T')[0];
            
            html += '<div class="weekly-day-column">';
            
            // Interventions pour cette heure
            const dayInterventions = getInterventionsForDate(dateStr);
            dayInterventions.forEach(intervention => {
                const startHour = new Date(intervention.start).getHours();
                if (startHour === hour) {
                    const duration = (new Date(intervention.end) - new Date(intervention.start)) / (1000 * 60 * 60);
                    const equipeClass = getEquipeClass(intervention.equipe);
                    
                    html += `<div class="weekly-intervention ${equipeClass}" 
                        style="height: ${duration * 60 - 10}px;"
                        onclick="showIntervention('${intervention.id}')">
                        <strong>${intervention.title}</strong><br>
                        <small>${intervention.categorie}</small><br>
                        ${new Date(intervention.start).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                    </div>`;
                }
            });
            
            html += '</div>';
        }
    }
    
    html += '</div>';
    document.getElementById('weeklyView').innerHTML = html;
}

// Vue journalière
function renderDailyView() {
    document.getElementById('dailyView').style.display = 'block';
    
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayInterventions = getInterventionsForDate(dateStr);
    
    let html = '<div class="daily-timeline">';
    
    // Créer les tranches horaires de 8h à 20h
    for (let hour = 8; hour <= 20; hour++) {
        html += `<div class="daily-hour">
            <div class="daily-hour-label">${hour}:00</div>
            <div class="daily-hour-content">`;
        
        // Filtrer les interventions pour cette heure
        dayInterventions.forEach(intervention => {
            const startHour = new Date(intervention.start).getHours();
            if (startHour === hour) {
                const equipeClass = getEquipeClass(intervention.equipe);
                const startTime = new Date(intervention.start).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
                const endTime = new Date(intervention.end).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
                
                html += `<div class="daily-intervention ${equipeClass}" onclick="showIntervention('${intervention.id}')">
                    <strong>${intervention.title}</strong> - ${intervention.equipe}<br>
                    <small>${intervention.categorie} • Durée: ${intervention.duree}h</small><br>
                    ${startTime} - ${endTime}<br>
                    📍 ${intervention.adresse}<br>
                    📞 ${intervention.telephone || 'Non renseigné'}
                </div>`;
            }
        });
        
        html += '</div></div>';
    }
    
    html += '</div>';
    
    // Résumé du jour
    html += `<div style="margin-top: 20px; padding: 20px; background: #f7fafc; border-radius: 8px;">
        <h3>Résumé du jour</h3>
        <p>${dayInterventions.length} intervention(s) programmée(s)</p>
    </div>`;
    
    document.getElementById('dailyView').innerHTML = html;
}

// Fonctions utilitaires
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

function getInterventionsForDate(dateStr) {
    return interventionsData.filter(intervention => {
        // Vérifier le filtre d'équipe
        if (currentFilter !== 'all') {
            // Le filtre est maintenant simplement "1", "2", etc.
            const interventionEquipe = intervention.equipe || '';
            
            // Vérifier si l'intervention appartient à l'équipe filtrée
            if (!interventionEquipe.includes(`Équipe ${currentFilter}`) && 
                !interventionEquipe.includes(`équipe ${currentFilter}`)) {
                return false;
            }
        }
        
        // Vérifier la date
        const startDate = intervention.start ? intervention.start.split('T')[0] : '';
        return startDate === dateStr;
    });
}

function getEquipeClass(equipe) {
    if (!equipe) return '';
    if (equipe.includes('Rouge') || equipe.includes('1')) return 'equipe-1';
    if (equipe.includes('Verte') || equipe.includes('2')) return 'equipe-2';
    if (equipe.includes('Bleue') || equipe.includes('3')) return 'equipe-3';
    if (equipe.includes('Jaune') || equipe.includes('4')) return 'equipe-4';
    if (equipe.includes('Violette') || equipe.includes('5')) return 'equipe-5';
    return '';
}

function filterInterventions() {
    currentFilter = document.getElementById('teamFilter').value;
    console.log('Filtre sélectionné:', currentFilter);
    
    // Debug : compter les interventions par équipe
    if (currentFilter !== 'all') {
        const filtered = interventionsData.filter(i => 
            i.equipe && i.equipe.includes(`Équipe ${currentFilter}`)
        );
        console.log(`Interventions pour Équipe ${currentFilter}:`, filtered.length);
        console.log('Exemples:', filtered.slice(0, 3));
    }
    
    renderView();
}

// Navigation
function navigatePrevious() {
    switch(currentView) {
        case 'month':
            currentDate.setMonth(currentDate.getMonth() - 1);
            break;
        case 'week':
            currentDate.setDate(currentDate.getDate() - 7);
            break;
        case 'day':
            currentDate.setDate(currentDate.getDate() - 1);
            break;
    }
    renderView();
}

function navigateNext() {
    switch(currentView) {
        case 'month':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
        case 'week':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
        case 'day':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
    }
    renderView();
}

function navigateToday() {
    currentDate = new Date();
    renderView();
}

// Modal
function showIntervention(id) {
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) return;
    
    const startDate = new Date(intervention.start);
    const endDate = intervention.end ? new Date(intervention.end) : null;
    
    let html = `
        <div class="info-row">
            <div class="info-label">Client :</div>
            <div class="info-value">${intervention.title}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Téléphone :</div>
            <div class="info-value">${intervention.telephone || 'Non renseigné'}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Catégorie :</div>
            <div class="info-value">${intervention.categorie || 'Non catégorisé'}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Date :</div>
            <div class="info-value">${startDate.toLocaleDateString('fr-FR')}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Horaires :</div>
            <div class="info-value">
                ${startDate.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                ${endDate ? ' - ' + endDate.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) : ''}
            </div>
        </div>
        <div class="info-row">
            <div class="info-label">Durée :</div>
            <div class="info-value">${intervention.duree} heure(s)</div>
        </div>
        <div class="info-row">
            <div class="info-label">Équipe :</div>
            <div class="info-value">${intervention.equipe}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Adresse :</div>
            <div class="info-value">${intervention.adresse || 'Non renseignée'}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Statut :</div>
            <div class="info-value">${intervention.statut}</div>
        </div>`;
    
    if (intervention.materiel && intervention.materiel.length > 0) {
        html += `
        <div class="info-row">
            <div class="info-label">Matériel :</div>
            <div class="info-value">${intervention.materiel.join(', ')}</div>
        </div>`;
    }
    
    if (intervention.instructions) {
        html += `
        <div class="info-row">
            <div class="info-label">Instructions :</div>
            <div class="info-value">${intervention.instructions}</div>
        </div>`;
    }
    
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('interventionModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('interventionModal').style.display = 'none';
}

// Fermer la modal en cliquant en dehors
window.onclick = function(event) {
    const modal = document.getElementById('interventionModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Rafraîchir automatiquement toutes les 5 minutes
setInterval(() => {
    if (sessionStorage.getItem('authenticated') === 'true') {
        loadInterventions();
    }
}, 5 * 60 * 1000);