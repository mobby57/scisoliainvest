document.addEventListener('DOMContentLoaded', function() {
    const investmentsList = document.getElementById('investments-list');
    const newInvestmentBtn = document.getElementById('new-investment-btn');
    
    // Données d'exemple
    const mockInvestments = [
        {
            id: 1,
            name: 'Appartement Paris 11ème',
            type: 'Résidentiel',
            value: 25000,
            currentValue: 27500,
            return: 10.0,
            status: 'Actif'
        },
        {
            id: 2,
            name: 'Local Commercial Lyon',
            type: 'Commercial',
            value: 20000,
            currentValue: 21250,
            return: 6.25,
            status: 'Actif'
        }
    ];

    function renderInvestments() {
        investmentsList.innerHTML = mockInvestments.map(inv => `
            <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-semibold text-lg">${inv.name}</h3>
                        <p class="text-gray-600">${inv.type}</p>
                        <div class="mt-2 flex space-x-4">
                            <span class="text-sm">Investi: ${inv.value.toLocaleString()}€</span>
                            <span class="text-sm">Valeur: ${inv.currentValue.toLocaleString()}€</span>
                            <span class="text-sm text-green-600">+${inv.return}%</span>
                        </div>
                    </div>
                    <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">${inv.status}</span>
                </div>
            </div>
        `).join('');
    }

    // Graphique de performance
    const ctx = document.getElementById('performanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Valeur du Portefeuille',
                data: [45000, 45500, 46200, 47000, 47800, 48750],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + '€';
                        }
                    }
                }
            }
        }
    });

    renderInvestments();
    
    newInvestmentBtn.addEventListener('click', () => {
        alert('Fonctionnalité en développement');
    });
});