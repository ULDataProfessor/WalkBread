// WalkBread App JavaScript
class WalkBreadApp {
    constructor() {
        this.map = null;
        this.storeLayer = null;
        this.userMarker = null;
        this.userLocation = null;
        this.stores = sampleStores;
        this.filteredStores = [...this.stores];
        this.currentFilters = {
            price: ['$', '$$', '$$$'],
            rating: 0,
            distance: 1,
            dietary: []
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeMap();
        this.renderStoreList();
        this.registerServiceWorker();
    }

    setupEventListeners() {
        // Location button
        document.getElementById('locationBtn').addEventListener('click', () => {
            this.getUserLocation();
        });

        // Filter button
        document.getElementById('filterBtn').addEventListener('click', () => {
            this.showFilterModal();
        });

        // Close filter modal
        document.getElementById('closeFilter').addEventListener('click', () => {
            this.hideFilterModal();
        });

        // Apply filters
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.applyFilters();
        });

        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Close store modal
        document.getElementById('closeStore').addEventListener('click', () => {
            this.hideStoreModal();
        });

        // Search input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Filter chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                this.handleFilterChip(e.target);
            });
        });

        // Close modals when clicking outside
        document.getElementById('filterModal').addEventListener('click', (e) => {
            if (e.target.id === 'filterModal') {
                this.hideFilterModal();
            }
        });

        document.getElementById('storeModal').addEventListener('click', (e) => {
            if (e.target.id === 'storeModal') {
                this.hideStoreModal();
            }
        });
    }

    initializeMap() {
        // Initialize map centered on San Francisco
        this.map = L.map('map').setView([37.7749, -122.4194], 13);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.storeLayer = L.layerGroup().addTo(this.map);
        this.addStoreMarkers();
    }

    addStoreMarkers() {
        if (!this.storeLayer) return;

        this.storeLayer.clearLayers();

        this.filteredStores.forEach(store => {
            const distanceText = typeof store.distance === 'number'
                ? `${store.distance.toFixed(1)} mi away`
                : 'Distance unavailable';

            const marker = L.marker([store.address.coordinates.lat, store.address.coordinates.lng])
                .addTo(this.storeLayer)
                .bindPopup(`
                    <div class="p-2">
                        <h3 class="font-bold text-bread-dark">${store.name}</h3>
                        <p class="text-sm text-bread-brown">${store.pricing} • ⭐ ${store.rating}</p>
                        <p class="text-xs text-bread-green">${distanceText}</p>
                        <button onclick="app.showStoreDetails(${store.id})" 
                                class="mt-2 bg-bread-green text-white px-3 py-1 rounded text-xs">
                            View Details
                        </button>
                    </div>
                `);

            marker.on('click', () => {
                this.showStoreDetails(store.id);
            });
        });
    }

    getUserLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }

        const locationBtn = document.getElementById('locationBtn');
        locationBtn.textContent = '📍 Getting Location...';
        locationBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Center map on user location
                this.map.setView([this.userLocation.lat, this.userLocation.lng], 15);

                if (!this.userMarker) {
                    this.userMarker = L.marker([this.userLocation.lat, this.userLocation.lng]);
                    this.userMarker.addTo(this.map);
                }

                this.userMarker
                    .setLatLng([this.userLocation.lat, this.userLocation.lng])
                    .bindPopup('📍 Your Location')
                    .openPopup();

                this.calculateDistances();

                locationBtn.textContent = '📍 My Location';
                locationBtn.disabled = false;
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please check your browser permissions.');
                locationBtn.textContent = '📍 My Location';
                locationBtn.disabled = false;
            }
        );
    }

    calculateDistances() {
        if (!this.userLocation) return;

        this.stores.forEach(store => {
            const distance = this.calculateDistance(
                this.userLocation.lat,
                this.userLocation.lng,
                store.address.coordinates.lat,
                store.address.coordinates.lng
            );
            store.distance = distance;
        });

        // Sort stores by distance
        this.stores.sort((a, b) => a.distance - b.distance);
        this.applyCurrentFilters();
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    renderStoreList() {
        const storeList = document.getElementById('storeList');
        const storeCount = document.getElementById('storeCount');
        
        storeList.innerHTML = '';
        const count = this.filteredStores.length;
        storeCount.textContent = `${count} ${count === 1 ? 'store' : 'stores'}`;

        if (count === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'text-center text-bread-brown text-sm py-6';
            emptyState.innerHTML = 'No bakeries match your filters yet. Try adjusting your search.';
            storeList.appendChild(emptyState);
            return;
        }

        this.filteredStores.forEach(store => {
            const storeCard = this.createStoreCard(store);
            storeList.appendChild(storeCard);
        });
    }

    createStoreCard(store) {
        const card = document.createElement('div');
        card.className = 'store-card bg-white rounded-lg p-4 bread-shadow cursor-pointer';
        card.onclick = () => this.showStoreDetails(store.id);

        const ratingStars = '⭐'.repeat(Math.floor(store.rating)) + 
                          (store.rating % 1 >= 0.5 ? '⭐' : '');
        const distanceText = typeof store.distance === 'number'
            ? `${store.distance.toFixed(1)} mi away`
            : 'Distance unavailable';

        card.innerHTML = `
            <div class="flex items-start space-x-3">
                <img src="${store.images[0]}" alt="${store.name}" 
                     class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <h3 class="font-semibold text-bread-dark">${store.name}</h3>
                        <span class="text-bread-gold font-bold">${store.pricing}</span>
                    </div>
                    <p class="text-sm text-bread-brown">${store.address.street}</p>
                    <div class="flex items-center space-x-2 mt-1">
                        <span class="text-sm">${ratingStars}</span>
                        <span class="text-sm text-bread-green">${store.rating}</span>
                        <span class="text-sm text-bread-brown">(${store.reviewCount})</span>
                    </div>
                    <div class="flex items-center justify-between mt-2">
                        <span class="text-xs text-bread-green">${distanceText}</span>
                        <div class="flex space-x-1">
                            ${store.dietary.glutenFree ? '<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">GF</span>' : ''}
                            ${store.dietary.vegan ? '<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">V</span>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    showStoreDetails(storeId) {
        const store = this.stores.find(s => s.id === storeId);
        if (!store) return;

        document.getElementById('storeName').textContent = store.name;
        
        const details = document.getElementById('storeDetails');
        details.innerHTML = `
            <div class="space-y-4">
                <img src="${store.images[0]}" alt="${store.name}" 
                     class="w-full h-48 object-cover rounded-lg">
                
                <div>
                    <h4 class="font-semibold text-bread-dark mb-2">📍 Address</h4>
                    <p class="text-bread-brown">${store.address.street}<br>
                    ${store.address.city}, ${store.address.state} ${store.address.zip}</p>
                </div>

                <div>
                    <h4 class="font-semibold text-bread-dark mb-2">📞 Contact</h4>
                    <p class="text-bread-brown">${store.contact.phone}</p>
                    <a href="${store.contact.website}" class="text-bread-green underline">Visit Website</a>
                </div>

                <div>
                    <h4 class="font-semibold text-bread-dark mb-2">🕒 Hours</h4>
                    <div class="text-sm text-bread-brown space-y-1">
                        <div>Mon: ${store.hours.monday}</div>
                        <div>Tue: ${store.hours.tuesday}</div>
                        <div>Wed: ${store.hours.wednesday}</div>
                        <div>Thu: ${store.hours.thursday}</div>
                        <div>Fri: ${store.hours.friday}</div>
                        <div>Sat: ${store.hours.saturday}</div>
                        <div>Sun: ${store.hours.sunday}</div>
                    </div>
                </div>

                <div>
                    <h4 class="font-semibold text-bread-dark mb-2">🍞 Specialties</h4>
                    <div class="flex flex-wrap gap-2">
                        ${store.specialties.map(specialty => 
                            `<span class="bg-bread-brown text-bread-dark px-2 py-1 rounded text-sm">${specialty}</span>`
                        ).join('')}
                    </div>
                </div>

                <div>
                    <h4 class="font-semibold text-bread-dark mb-2">📝 Description</h4>
                    <p class="text-bread-brown">${store.description}</p>
                </div>

                <div class="flex space-x-3">
                    <a href="tel:${store.contact.phone}" 
                       class="flex-1 bg-bread-green text-white py-2 px-4 rounded-lg text-center">
                        📞 Call Store
                    </a>
                    <button onclick="app.getDirections(${store.id})" 
                            class="flex-1 bg-bread-brown text-bread-dark py-2 px-4 rounded-lg">
                        🗺️ Directions
                    </button>
                </div>
            </div>
        `;

        document.getElementById('storeModal').classList.remove('hidden');
    }

    hideStoreModal() {
        document.getElementById('storeModal').classList.add('hidden');
    }

    showFilterModal() {
        document.getElementById('filterModal').classList.remove('hidden');
    }

    hideFilterModal() {
        document.getElementById('filterModal').classList.add('hidden');
    }

    applyFilters() {
        const priceFilters = Array.from(document.querySelectorAll('.price-filter:checked'))
            .map(cb => cb.value);
        const ratingFilter = parseInt(document.getElementById('ratingFilter').value);
        const distanceFilter = parseFloat(document.getElementById('distanceFilter').value);
        const dietaryFilters = Array.from(document.querySelectorAll('.dietary-filter:checked'))
            .map(cb => cb.value);

        this.currentFilters = {
            price: priceFilters,
            rating: ratingFilter,
            distance: distanceFilter,
            dietary: dietaryFilters
        };

        this.applyCurrentFilters();
        this.hideFilterModal();
    }

    applyCurrentFilters() {
        this.filteredStores = this.stores.filter(store => {
            // Price filter
            if (!this.currentFilters.price.includes(store.pricing)) {
                return false;
            }

            // Rating filter
            if (store.rating < this.currentFilters.rating) {
                return false;
            }

            // Distance filter
            const distance = typeof store.distance === 'number' ? store.distance : Infinity;
            if (distance > this.currentFilters.distance) {
                return false;
            }

            // Dietary filters
            if (this.currentFilters.dietary.length > 0) {
                const hasDietaryOption = this.currentFilters.dietary.some(diet => {
                    return store.dietary[diet] === true;
                });
                if (!hasDietaryOption) {
                    return false;
                }
            }

            return true;
        });

        this.renderStoreList();
        this.updateMapMarkers();
    }

    clearFilters() {
        // Reset all filter inputs
        document.querySelectorAll('.price-filter').forEach(cb => cb.checked = true);
        document.getElementById('ratingFilter').value = '0';
        document.getElementById('distanceFilter').value = '1';
        document.querySelectorAll('.dietary-filter').forEach(cb => cb.checked = false);

        this.currentFilters = {
            price: ['$', '$$', '$$$'],
            rating: 0,
            distance: 1,
            dietary: []
        };

        document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
        const allChip = document.querySelector('.filter-chip[data-filter="all"]');
        if (allChip) {
            allChip.classList.add('active');
        }

        this.applyCurrentFilters();
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.applyCurrentFilters();
            return;
        }

        const searchResults = this.filteredStores.filter(store => {
            const searchText = `${store.name} ${store.address.street} ${store.specialties.join(' ')}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        this.filteredStores = searchResults;
        this.renderStoreList();
        this.updateMapMarkers();
    }

    handleFilterChip(chip) {
        // Remove active class from all chips
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked chip
        chip.classList.add('active');

        const filter = chip.dataset.filter;
        
        if (filter === 'all') {
            this.clearFilters();
        } else if (filter.startsWith('price-')) {
            const priceLevel = filter.split('-')[1];
            const priceMap = {
                '1': '$',
                '2': '$$',
                '3': '$$$'
            };
            const mappedPrice = priceMap[priceLevel] || '$';
            this.currentFilters.price = [mappedPrice];
            this.applyCurrentFilters();
        } else if (filter.startsWith('rating-')) {
            const rating = parseInt(filter.split('-')[1]);
            this.currentFilters.rating = rating;
            this.applyCurrentFilters();
        } else if (filter === 'gluten-free') {
            this.currentFilters.dietary = ['glutenFree'];
            this.applyCurrentFilters();
        } else if (filter === 'vegan') {
            this.currentFilters.dietary = ['vegan'];
            this.applyCurrentFilters();
        }
    }

    updateMapMarkers() {
        this.addStoreMarkers();
    }

    getDirections(storeId) {
        const store = this.stores.find(s => s.id === storeId);
        if (!store) return;

        if (this.userLocation) {
            const url = `https://www.google.com/maps/dir/${this.userLocation.lat},${this.userLocation.lng}/${store.address.coordinates.lat},${store.address.coordinates.lng}`;
            window.open(url, '_blank');
        } else {
            const url = `https://www.google.com/maps/search/?api=1&query=${store.address.coordinates.lat},${store.address.coordinates.lng}`;
            window.open(url, '_blank');
        }
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WalkBreadApp();
});
