/* ========================================
   Gama Distillers - Main Application JavaScript
   ======================================== */

// WhatsApp Business Number
const WHATSAPP_NUMBER = '256758238514';

// Product Data
const products = [
    {
        id: 'cock-sherry-001',
        name: 'Cock Sherry Liqueur',
        category: 'Specialty',
        description: 'A premium Ugandan liqueur with a rich, velvety texture and deep aromatic notes. Perfectly balanced for sipping or cocktails.',
        retailPrice: 25000,
        trayPrice: 18000,
        image: 'cock sherry.png',
        abv: '22%',
        availability: true,
        bottlesPerTray: 12
    },
    {
        id: 'cock-sherry-750-001',
        name: 'Cock Sherry 750ml',
        category: 'Specialty',
        description: 'Premium 750ml bottle of Cock Sherry Liqueur. Rich, velvety texture with deep aromatic notes.',
        retailPrice: 32000,
        trayPrice: 24000,
        image: 'Cock sherry 750 ml.png',
        abv: '22%',
        availability: true,
        bottlesPerTray: 12
    },
    {
        id: 'cock-gin-001',
        name: 'Cock Gin',
        category: 'Gin',
        description: 'A bold and aromatic gin crafted for the modern spirit enthusiast. Notes of juniper with a smooth finish.',
        retailPrice: 22000,
        trayPrice: 15000,
        image: 'cock gin.png',
        abv: '40%',
        availability: true,
        bottlesPerTray: 12
    },
    {
        id: 'cock-gin-250-001',
        name: 'Cock Gin 250ml',
        category: 'Gin',
        description: 'Perfectly sized 250ml bottle of Cock Gin. Bold and aromatic with notes of juniper.',
        retailPrice: 9000,
        trayPrice: 6000,
        image: 'cock gin 250 ml.png',
        abv: '40%',
        availability: true,
        bottlesPerTray: 24
    },
    {
        id: 'yellow-cock-gin-001',
        name: 'Yellow Cock Gin',
        category: 'Gin',
        description: 'A distinctive golden gin with a unique botanical blend. Smooth, aromatic, and perfect for premium cocktails.',
        retailPrice: 24000,
        trayPrice: 17000,
        image: 'yellow cock gin.png',
        abv: '40%',
        availability: true,
        bottlesPerTray: 12
    },
    {
        id: 'cock-ug-gin-001',
        name: 'Cock Uganda Gin',
        category: 'Gin',
        description: 'The authentic Ugandan gin. Bold, smooth, and proudly local. A testament to quality craftsmanship.',
        retailPrice: 20000,
        trayPrice: 14000,
        image: 'cock ug gin.png',
        abv: '40%',
        availability: true,
        bottlesPerTray: 12
    },
    {
        id: 'jogoo-vodka-750-001',
        name: 'Jogoo Vodka 750ml',
        category: 'Vodka',
        description: 'Ultra-premium vodka distilled to perfection. Crystal clear with a clean, smooth finish.',
        retailPrice: 28000,
        trayPrice: 20000,
        image: 'jogoo vodka 750 ml.png',
        abv: '40%',
        availability: true,
        bottlesPerTray: 12
    },
    {
        id: 'cock-sherry-small-001',
        name: 'Cock Sherry Small',
        category: 'Specialty',
        description: 'The perfect introduction to Cock Sherry. Rich, sweet, and wonderfully smooth.',
        retailPrice: 12000,
        trayPrice: 8000,
        image: 'cock sherry small.png',
        abv: '22%',
        availability: true,
        bottlesPerTray: 24
    },
    {
        id: 'cock-small-001',
        name: 'Cock Small',
        category: 'Gin',
        description: 'Compact yet powerful. Our small bottle Cock Gin delivers big flavor.',
        retailPrice: 10000,
        trayPrice: 6500,
        image: 'cock small.png',
        abv: '40%',
        availability: true,
        bottlesPerTray: 24
    }
];

// State Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let orderForm = JSON.parse(localStorage.getItem('orderForm')) || {
    customerName: '',
    phoneNumber: '',
    deliveryAddress: '',
    deliveryGate: '',
    notes: ''
};
let customerType = localStorage.getItem('customerType') || 'retail';
let currentFilter = 'All';
let searchQuery = '';
let cartStep = 'cart';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
    
    const verified = localStorage.getItem('age-verified');
    if (verified === 'true') {
        showMainApp();
    } else {
        document.getElementById('ageGate').classList.remove('hidden');
    }

    renderCategoryFilters();
    renderProducts();
    updateCartCount();
});

// Age Gate Functions
function verifyAge() {
    localStorage.setItem('age-verified', 'true');
    document.getElementById('ageVerificationStep').classList.add('hidden');
    document.getElementById('customerTypeStep').classList.remove('hidden');
}

function rejectAge() {
    document.getElementById('ageError').classList.remove('hidden');
}

function selectCustomerType(type) {
    customerType = type;
    localStorage.setItem('customerType', type);
    
    const message = type === 'b2b' 
        ? 'B2B Mode activated! Tray pricing applied.'
        : 'Retail Mode activated!';
    showToast(message, 'success');
    
    showMainApp();
    renderProducts();
}

function showMainApp() {
    document.getElementById('ageGate').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
}

// Get current price based on customer type
function getPrice(product) {
    return customerType === 'b2b' ? product.trayPrice : product.retailPrice;
}

function getPriceLabel() {
    return customerType === 'b2b' ? 'Per Tray (12 bottles)' : 'Per Bottle';
}

// Category Filters
function renderCategoryFilters() {
    const categories = ['All', 'Whiskey', 'Gin', 'Vodka', 'Specialty'];
    const container = document.getElementById('categoryFilters');
    container.innerHTML = categories.map(cat => `
        <button onclick="setFilter('${cat}')" class="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
            currentFilter === cat 
                ? 'bg-[#b91c1c] text-white shadow-lg' 
                : 'bg-white text-stone-600 border border-stone-200 hover:border-[#b91c1c] hover:text-[#b91c1c]'
        }">
            ${cat}
        </button>
    `).join('');
}

function setFilter(category) {
    currentFilter = category;
    renderCategoryFilters();
    renderProducts();
}

// Search with Live Results
function handleSearch(value) {
    const resultsContainer = document.getElementById('searchResults');
    searchQuery = value.trim();
    
    if (searchQuery === '') {
        resultsContainer.classList.add('hidden');
        renderProducts();
        return;
    }
    
    const results = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="p-4 text-center">
                <p class="text-stone-500">No products found for "${searchQuery}"</p>
                <button onclick="clearSearch()" class="mt-2 text-[#b91c1c] text-sm font-bold">Clear search</button>
            </div>
        `;
    } else {
        resultsContainer.innerHTML = `
            <div class="p-2 bg-stone-50 border-b border-stone-100">
                <p class="text-xs text-stone-500 font-bold">${results.length} product(s) found</p>
            </div>
            ${results.map(p => {
                const price = getPrice(p);
                return `
                <div onclick="selectProduct('${p.id}')" class="flex items-center gap-3 p-3 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-0 transition-colors">
                    <img src="${p.image}" alt="${p.name}" class="w-12 h-12 object-contain">
                    <div class="flex-grow">
                        <p class="font-bold text-stone-900 text-sm">${p.name}</p>
                        <p class="text-xs text-[#b91c1c] font-bold">UGX ${price.toLocaleString()}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-[10px] bg-stone-100 text-stone-600 px-2 py-1 rounded-full">${p.category}</span>
                    </div>
                </div>
                `;
            }).join('')}
            <div class="p-2 bg-stone-50 border-t border-stone-100 text-center">
                <button onclick="viewAllResults()" class="text-xs text-[#b91c1c] font-bold hover:underline">View all results in catalog</button>
            </div>
        `;
    }
    
    resultsContainer.classList.remove('hidden');
    renderProducts();
}

function selectProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('searchInput').value = product.name;
        document.getElementById('searchResults').classList.add('hidden');
        scrollToCatalog();
        setTimeout(() => {
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (productCard) {
                productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                productCard.classList.add('ring-2', 'ring-[#b91c1c]');
                setTimeout(() => productCard.classList.remove('ring-2', 'ring-[#b91c1c]'), 2000);
            }
        }, 500);
    }
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').classList.add('hidden');
    searchQuery = '';
    renderProducts();
}

function viewAllResults() {
    document.getElementById('searchResults').classList.add('hidden');
    scrollToCatalog();
}

// Products with B2B Tray Support
function renderProducts() {
    const container = document.getElementById('productGrid');
    const noResults = document.getElementById('noResults');
    const searchInfo = document.getElementById('searchInfo');

    const filteredProducts = products.filter(p => {
        const matchesCategory = currentFilter === 'All' || p.category === currentFilter;
        const matchesSearch = searchQuery === '' || 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Update search info
    if (searchQuery !== '') {
        searchInfo.classList.remove('hidden');
        searchInfo.innerHTML = `<span class="text-[#b91c1c] font-bold">Searching for "${searchQuery}"</span> — <span class="font-semibold">${filteredProducts.length} product(s) found</span>`;
    } else {
        searchInfo.classList.add('hidden');
    }

    if (filteredProducts.length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');
    
    // Customer type badge
    const typeBadge = customerType === 'b2b' 
        ? `<div class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            B2B Wholesale
           </div>`
        : `<div class="bg-[#b91c1c] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Retail
           </div>`;

    container.innerHTML = filteredProducts.map((product, index) => {
        const price = getPrice(product);
        const isB2B = customerType === 'b2b';
        const inWishlist = isInWishlist(product.id);
        
        return `
        <div class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100 flex flex-col relative product-card" data-product-id="${product.id}" style="animation-delay: ${index * 50}ms">
            <div class="relative aspect-square overflow-hidden bg-stone-50 cursor-pointer" onclick="openZoom('${product.image}', '${product.name}')">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain p-4 product-image">
                <!-- Zoom hint -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-stone-600">
                        Tap to zoom
                    </div>
                </div>
                <div class="absolute top-3 left-3 z-10">
                    ${typeBadge}
                </div>
                
                <!-- Wishlist Button -->
                <button onclick="event.stopPropagation(); toggleWishlist('${product.id}')" class="absolute top-3 right-14 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center transition-all ${inWishlist ? 'text-[#b91c1c]' : 'text-stone-400 hover:text-[#b91c1c]'}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ${inWishlist ? 'fill-current' : 'fill-none'}" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
                
                <div class="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black text-[#b91c1c] shadow-sm uppercase tracking-wider">
                    ${product.abv}
                </div>
                ${!product.availability ? `
                    <div class="absolute inset-0 bg-stone-900/70 backdrop-blur-[2px] flex items-center justify-center">
                        <span class="text-white font-black tracking-[0.3em] uppercase border-2 border-white px-4 py-1 text-xs">Sold Out</span>
                    </div>
                ` : ''}
            </div>
            <div class="p-4 flex flex-col flex-grow">
                <p class="text-xs font-bold text-brand-red uppercase tracking-widest mb-1">${product.category}</p>
                <h3 class="text-lg font-bold text-stone-800 mb-2 leading-tight">${product.name}</h3>
                <p class="text-xs text-stone-500 line-clamp-2 mb-3 flex-grow">${product.description}</p>
                
                <!-- Price Display -->
                <div class="flex items-end justify-between mb-3">
                    <div class="${isB2B ? 'bg-amber-50' : 'bg-red-50'} ${isB2B ? 'text-amber-700' : 'text-[#b91c1c]} px-3 py-1.5 rounded-lg">
                        <p class="text-xs font-bold uppercase tracking-wider mb-0.5">${isB2B ? 'Per Tray' : 'Per Bottle'}</p>
                        <p class="font-black text-lg">UGX ${price.toLocaleString()}</p>
                    </div>
                    ${isB2B ? `
                    <div class="text-right">
                        <p class="text-[10px] text-amber-600 font-bold uppercase tracking-wider">12 Bottles</p>
                        <p class="text-sm font-bold text-amber-700">UGX ${(price * 12).toLocaleString()}</p>
                    </div>
                    ` : ''}
                </div>
                
                <button onclick="addToCart('${product.id}')" ${!product.availability ? 'disabled' : ''} class="w-full ${isB2B ? 'bg-amber-500 hover:bg-amber-400' : 'bg-[#b91c1c] hover:bg-[#991b1b]'} text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:bg-stone-300 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    ${!product.availability ? 'Sold Out' : (isB2B ? 'Add to Quote' : 'Add to Cart')}
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// Scroll to catalog
function scrollToCatalog() {
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
}

// Wishlist Functions
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = wishlist.find(item => item.id === productId);
    if (existing) {
        wishlist = wishlist.filter(item => item.id !== productId);
        showToast('Removed from wishlist', 'success');
    } else {
        wishlist.push(product);
        showToast('Added to wishlist', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    renderProducts();
    renderWishlist();
}

function isInWishlist(productId) {
    return wishlist.some(item => item.id === productId);
}

function renderWishlist() {
    const emptyState = document.getElementById('wishlistEmpty');
    const itemsContainer = document.getElementById('wishlistItems');
    const footer = document.getElementById('wishlistFooter');
    
    if (wishlist.length === 0) {
        emptyState.classList.remove('hidden');
        itemsContainer.classList.add('hidden');
        footer.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    itemsContainer.classList.remove('hidden');
    footer.classList.remove('hidden');
    
    const isB2B = customerType === 'b2b';
    itemsContainer.innerHTML = wishlist.map(item => {
        const price = isB2B ? item.trayPrice : item.retailPrice;
        return `
        <div class="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-stone-100">
            <div class="w-20 h-20 bg-stone-50 rounded-xl overflow-hidden flex-shrink-0">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-grow">
                <h4 class="font-black text-stone-900 leading-tight uppercase text-sm">${item.name}</h4>
                <p class="text-xs text-[#b91c1c] font-bold mt-1">UGX ${price.toLocaleString()} ${isB2B ? '/tray' : ''}</p>
                <div class="flex items-center gap-2 mt-3">
                    <button onclick="addToCart('${item.id}')" class="flex-1 bg-[#b91c1c] text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#991b1b] transition-colors">
                        Add to Cart
                    </button>
                    <button onclick="toggleWishlist('${item.id}')" class="p-2 text-stone-400 hover:text-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function clearWishlist() {
    if (confirm('Are you sure you want to clear your wishlist?')) {
        wishlist = [];
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        renderWishlist();
        renderProducts();
        showToast('Wishlist cleared', 'success');
    }
}

function addAllToCartFromWishlist() {
    if (wishlist.length === 0) return;
    
    wishlist.forEach(product => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            cart = cart.map(item => item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item);
        } else {
            cart.push({ ...product, quantity: 1 });
        }
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    closeWishlist();
    showToast(`${wishlist.length} items added to cart`, 'success');
    openCart();
}

// Toast Notification System
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    
    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-[#b91c1c]',
        warning: 'bg-amber-500'
    };
    
    toast.className = `px-6 py-4 ${bgColors[type] || bgColors.info} text-white rounded-xl shadow-xl font-bold text-sm flex items-center gap-3 animate-slide-up`;
    
    const icons = {
        success: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>',
        error: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        warning: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>'
    };
    
    toast.innerHTML = `${icons[type] || icons.info} <span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function openCart() {
    document.getElementById('cartSidebar').classList.remove('hidden');
    renderCartItems();
}

function closeCart() {
    document.getElementById('cartSidebar').classList.add('hidden');
}

function goBackToCart() {
    cartStep = 'cart';
    renderCartItems();
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Are you sure you want to clear all items from your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        showToast('Cart cleared', 'success');
    }
}

function renderCartItems() {
    const container = document.getElementById('cartContent');
    const footer = document.getElementById('cartFooter');
    const isB2B = customerType === 'b2b';
    
    const total = cart.reduce((acc, item) => {
        const price = isB2B ? item.trayPrice : item.retailPrice;
        return acc + (price * item.quantity);
    }, 0);
    
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cartItemCount').textContent = `${totalItems} ${isB2B ? 'trays' : 'items'}`;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full min-h-[60vh] text-stone-300 space-y-8 px-6">
                <div class="p-12 bg-stone-100 rounded-full relative">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-6xl">🛒</span>
                    </div>
                </div>
                <div class="text-center max-w-md">
                    <p class="text-3xl font-black text-stone-500 uppercase tracking-tight">${isB2B ? 'No trays selected' : 'Your cart is empty'}</p>
                    <p class="text-lg text-stone-400 mt-4">${isB2B ? 'Add trays to start your wholesale order' : 'Discover our premium spirits from Gama Distillers.'}</p>
                </div>
                <button onclick="scrollToCatalog(); closeCart();" class="bg-[#b91c1c] text-white px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl hover:bg-[#991b1b] transition-all hover:scale-105 active:scale-95">
                    Browse Spirits
                </button>
            </div>
        `;
        document.getElementById('cartFooter').classList.add('hidden');
        return;
    }

    document.getElementById('cartFooter').classList.remove('hidden');
    document.getElementById('cartTotal').textContent = `UGX ${total.toLocaleString()}`;
    document.getElementById('cartSubtotal').textContent = `UGX ${total.toLocaleString()}`;

    if (cartStep === 'cart') {
        // Checkout button
        const checkoutText = isB2B 
            ? `Request Quote • ${cart.reduce((a, b) => a + b.quantity, 0)} trays`
            : 'Proceed to Checkout';
            
        document.getElementById('cartActions').innerHTML = `
            <div class="grid grid-cols-2 gap-4 mb-6">
                <button onclick="clearCart()" class="bg-stone-100 text-stone-600 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-stone-200 transition-colors">
                    Clear Cart
                </button>
                <button onclick="goToCheckout()" class="bg-[#b91c1c] text-white py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-[#991b1b] transition-colors">
                    ${checkoutText}
                </button>
            </div>
            <button onclick="submitOrder()" class="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-lg active:scale-[0.98]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                </svg>
                Order via WhatsApp
            </button>
        `;

        container.innerHTML = `
            <div class="max-w-2xl mx-auto px-8 py-8">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-black text-stone-900 uppercase tracking-wider text-lg">Cart Items (${cart.length})</h3>
                    <span class="text-sm text-stone-500">Click items to preview</span>
                </div>
            </div>
        ` + cart.map(item => {
            const price = isB2B ? item.trayPrice : item.retailPrice;
            const itemTotal = price * item.quantity;
            const bottles = isB2B ? item.quantity * item.bottlesPerTray : item.quantity;
            
            return `
            <div class="max-w-2xl mx-auto px-8 pb-4">
                <div class="group bg-white rounded-2xl border border-stone-200 hover:border-[#b91c1c]/30 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer" onclick="previewProduct('${item.id}')">
                    <div class="flex gap-6 p-6">
                        <div class="w-28 h-28 bg-stone-50 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-inner">
                            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain p-2">
                            ${isB2B ? `
                            <div class="absolute top-2 right-2 bg-amber-500 text-white text-xs font-black px-2 py-1 rounded-lg">
                                12/case
                            </div>
                            ` : ''}
                        </div>
                        <div class="flex-grow">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-xs font-bold text-[#b91c1c] uppercase tracking-widest mb-1">${item.category}</p>
                                    <h4 class="font-black text-stone-900 leading-tight uppercase text-xl">${item.name}</h4>
                                </div>
                                <button onclick="event.stopPropagation(); removeFromCart('${item.id}')" class="w-10 h-10 flex items-center justify-center text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div class="flex items-end justify-between mt-4">
                                <div class="flex items-center bg-stone-100 rounded-xl p-1">
                                    <button onclick="event.stopPropagation(); updateQuantity('${item.id}', -1)" class="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-[#b91c1c] hover:bg-white rounded-lg transition-all font-bold text-lg">
                                        −
                                    </button>
                                    <span class="font-black text-stone-900 text-lg w-14 text-center">${item.quantity}</span>
                                    <button onclick="event.stopPropagation(); updateQuantity('${item.id}', 1)" class="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-[#b91c1c] hover:bg-white rounded-lg transition-all font-bold text-lg">
                                        +
                                    </button>
                                </div>
                                <div class="text-right">
                                    <p class="text-2xl font-black text-stone-900">UGX ${itemTotal.toLocaleString()}</p>
                                    <p class="text-xs text-stone-400 mt-1">${bottles} ${isB2B ? 'bottles' : 'bottles'} • UGX ${price.toLocaleString()} ${isB2B ? '/tray' : '/btl'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    } else {
        document.getElementById('cartActions').innerHTML = `
            <div class="flex items-center gap-3 mb-6">
                <button onclick="goBackToCart()" class="w-10 h-10 flex items-center justify-center text-[#b91c1c] hover:bg-red-50 rounded-xl transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h3 class="font-black text-stone-900 uppercase tracking-wider text-lg">Checkout</h3>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h4 class="font-bold text-stone-900 uppercase tracking-wider text-sm mb-4">Your Details</h4>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-[#b91c1c] uppercase tracking-wider mb-2">Full Name</label>
                            <input type="text" id="customerName" value="${orderForm.customerName}" onchange="updateOrderForm('customerName', this.value)" class="w-full border border-stone-200 rounded-xl px-4 py-3 focus:border-[#b91c1c] focus:ring-0 bg-stone-50 font-medium text-stone-900" placeholder="Enter your full name">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#b91c1c] uppercase tracking-wider mb-2">Phone Number</label>
                            <input type="tel" id="phoneNumber" value="${orderForm.phoneNumber}" onchange="updateOrderForm('phoneNumber', this.value)" class="w-full border border-stone-200 rounded-xl px-4 py-3 focus:border-[#b91c1c] focus:ring-0 bg-stone-50 font-medium text-stone-900" placeholder="07XX XXX XXX">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#b91c1c] uppercase tracking-wider mb-2">Delivery Area</label>
                            <select id="deliveryGate" onchange="updateOrderForm('deliveryGate', this.value)" class="w-full border border-stone-200 rounded-xl px-4 py-3 focus:border-[#b91c1c] focus:ring-0 bg-stone-50 font-medium text-stone-900">
                                <option value="">Select delivery area</option>
                                <optgroup label="Kampala">
                                    <option value="Nakawa" ${orderForm.deliveryGate === 'Nakawa' ? 'selected' : ''}>Nakawa</option>
                                    <option value="Bweyogerere" ${orderForm.deliveryGate === 'Bweyogerere' ? 'selected' : ''}>Bweyogerere</option>
                                    <option value="Kireka" ${orderForm.deliveryGate === 'Kireka' ? 'selected' : ''}>Kireka</option>
                                    <option value="Ntinda" ${orderForm.deliveryGate === 'Ntinda' ? 'selected' : ''}>Ntinda</option>
                                    <option value="Mbuya" ${orderForm.deliveryGate === 'Mbuya' ? 'selected' : ''}>Mbuya</option>
                                    <option value="Bugolobi" ${orderForm.deliveryGate === 'Bugolobi' ? 'selected' : ''}>Bugolobi</option>
                                    <option value="City Center" ${orderForm.deliveryGate === 'City Center' ? 'selected' : ''}>City Center</option>
                                </optgroup>
                                <optgroup label="Other Areas">
                                    <option value="Entebbe" ${orderForm.deliveryGate === 'Entebbe' ? 'selected' : ''}>Entebbe</option>
                                    <option value="Mukono" ${orderForm.deliveryGate === 'Mukono' ? 'selected' : ''}>Mukono</option>
                                    <option value="Jinja" ${orderForm.deliveryGate === 'Jinja' ? 'selected' : ''}>Jinja</option>
                                    <option value="Masaka" ${orderForm.deliveryGate === 'Masaka' ? 'selected' : ''}>Masaka</option>
                                </optgroup>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#b91c1c] uppercase tracking-wider mb-2">Full Address</label>
                            <textarea id="deliveryAddress" onchange="updateOrderForm('deliveryAddress', this.value)" rows="2" class="w-full border border-stone-200 rounded-xl px-4 py-3 focus:border-[#b91c1c] focus:ring-0 bg-stone-50 font-medium text-stone-900" placeholder="Enter your delivery address">${orderForm.deliveryAddress}</textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#b91c1c] uppercase tracking-wider mb-2">Notes (Optional)</label>
                            <input type="text" id="notes" value="${orderForm.notes}" onchange="updateOrderForm('notes', this.value)" class="w-full border border-stone-200 rounded-xl px-4 py-3 focus:border-[#b91c1c] focus:ring-0 bg-stone-50 font-medium text-stone-900" placeholder="Any special instructions">
                        </div>
                    </div>
                </div>
                <div>
                    <h4 class="font-bold text-stone-900 uppercase tracking-wider text-sm mb-4">Order Summary</h4>
                    <div class="bg-stone-50 rounded-xl p-6">
                        <div class="space-y-3 mb-6">
                            ${cart.map(item => {
                                const price = isB2B ? item.trayPrice : item.retailPrice;
                                const itemTotal = price * item.quantity;
                                return `
                                <div class="flex justify-between items-center py-2 border-b border-stone-200">
                                    <div class="flex items-center gap-3">
                                        <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-contain bg-white rounded-lg p-1">
                                        <div>
                                            <p class="font-bold text-stone-900 text-sm">${item.name}</p>
                                            <p class="text-xs text-stone-500">Qty: ${item.quantity}</p>
                                        </div>
                                    </div>
                                    <p class="font-bold text-stone-900">UGX ${itemTotal.toLocaleString()}</p>
                                </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="border-t border-stone-200 pt-4">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-stone-500">Subtotal</span>
                                <span class="font-bold text-stone-900">UGX ${total.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between items-center mb-4">
                                <span class="text-stone-500">Delivery</span>
                                <span class="font-bold text-green-600">Free</span>
                            </div>
                            <div class="flex justify-between items-center pt-4 border-t border-stone-200">
                                <span class="font-black text-stone-900 uppercase tracking-wider">Total</span>
                                <span class="text-2xl font-black text-[#b91c1c]">UGX ${total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-8">
                <button onclick="submitOrder()" ${!orderForm.customerName || !orderForm.deliveryAddress || !orderForm.phoneNumber ? 'disabled' : ''} class="w-full bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-lg active:scale-[0.98]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                    </svg>
                    Order via WhatsApp
                </button>
            </div>
        `;

        container.innerHTML = '';
    }
}

function goToCheckout() {
    cartStep = 'checkout';
    renderCartItems();
}

function updateOrderForm(field, value) {
    orderForm[field] = value;
    localStorage.setItem('orderForm', JSON.stringify(orderForm));
}

function submitOrder() {
    const isB2B = customerType === 'b2b';
    const subtotal = cart.reduce((acc, item) => {
        const price = isB2B ? item.trayPrice : item.retailPrice;
        return acc + (price * item.quantity);
    }, 0);
    
    if (cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    
    // Validate customer details are provided
    if (!orderForm.customerName || !orderForm.phoneNumber || !orderForm.deliveryAddress) {
        showToast('Please fill in all required customer details before ordering', 'error');
        goToCheckout();
        return;
    }
    
    const orderItemsText = cart.map(i => {
        const price = isB2B ? i.trayPrice : i.retailPrice;
        const itemTotal = price * i.quantity;
        const bottles = isB2B ? i.quantity * i.bottlesPerTray : i.quantity;
        return `━━━━━━━━━━━━━━━━
📦 *${i.name}*
🖼️ Ref: ${i.image}
📊 Qty: ${i.quantity} ${isB2B ? 'tray(s)' : 'bottle(s)'} (${bottles} bottles)
💵 Price: UGX ${price.toLocaleString()} ${isB2B ? '/tray' : '/bottle'}
💰 Subtotal: UGX ${itemTotal.toLocaleString()}`;
    }).join('\n\n');

    const customerTypeText = isB2B ? '🧾 B2B WHOLESALE ORDER' : '🛒 RETAIL ORDER';
    
    const orderText = `*🥃 GAMA DISTILLERS UGANDA*
${customerTypeText}
━━━━━━━━━━━━━━━━

*👤 CUSTOMER DETAILS*
━━━━━━━━━━━━━━━━
📛 Name: ${orderForm.customerName}
📞 Phone: ${orderForm.phoneNumber}
📍 Address: ${orderForm.deliveryAddress}` + 
        (orderForm.deliveryGate ? `\n🚩 Area: ${orderForm.deliveryGate}` : '') +
        (orderForm.notes ? `\n📝 Notes: ${orderForm.notes}` : '') +
        `\n\n*📦 ORDER ITEMS*
━━━━━━━━━━━━━━━━
${orderItemsText}

━━━━━━━━━━━━━━━━
*💰 TOTAL: UGX ${subtotal.toLocaleString()}*
━━━━━━━━━━━━━━━━

_✅ Order submitted via Rozan The Ledger_
_Please confirm delivery & send payment details._`;

    const encoded = encodeURIComponent(orderText);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
    
    // Clear cart and order form after submission
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    orderForm = { customerName: '', phoneNumber: '', deliveryAddress: '', deliveryGate: '', notes: '' };
    localStorage.setItem('orderForm', JSON.stringify(orderForm));
    updateCartCount();
    cartStep = 'cart';
    renderCartItems();
    showToast('Order submitted successfully!', 'success');
}

function contactUs() {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCartItems();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    showToast('Removed from cart', 'success');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let quantity = 1;
    
    // In B2B mode, get quantity from input field
    if (customerType === 'b2b') {
        const qtyInput = document.getElementById(`qty-${productId}`);
        if (qtyInput) {
            quantity = parseInt(qtyInput.value) || 1;
        }
    }

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        cart = cart.map(item => item.id === productId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item);
    } else {
        cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Added to cart', 'success');
}

function toggleWishlistModal() {
    const modal = document.getElementById('wishlistModal');
    if (modal.classList.contains('hidden')) {
        renderWishlist();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function updateWishlistCount() {
    const badge = document.getElementById('wishlistCount');
    if (badge) {
        badge.textContent = wishlist.length;
    }
}

// Zoom Functions
function openZoom(imageSrc, productName) {
    const modal = document.getElementById('zoomModal');
    const img = document.getElementById('zoomImage');
    const nameEl = document.getElementById('zoomProductName');
    
    img.src = imageSrc;
    nameEl.textContent = productName;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeZoom() {
    const modal = document.getElementById('zoomModal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Close zoom on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeZoom();
    }
});

function previewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const isB2B = customerType === 'b2b';
    const price = isB2B ? product.trayPrice : product.retailPrice;
    
    document.getElementById('previewImage').src = product.image;
    document.getElementById('previewName').textContent = product.name;
    document.getElementById('previewCategory').textContent = product.category;
    document.getElementById('previewPrice').textContent = `UGX ${price.toLocaleString()} ${isB2B ? '/tray' : '/bottle'}`;
    document.getElementById('previewDescription').textContent = product.description || 'Premium quality spirit from Gama Distillers Uganda.';
    document.getElementById('previewAbv').textContent = product.abv || 'N/A';
    document.getElementById('previewModal').classList.remove('hidden');
}

function closePreview() {
    document.getElementById('previewModal').classList.add('hidden');
}

// Slideshow Functions
let slideInterval;

function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('hidden', i !== index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('bg-white', i === index);
            dot.classList.toggle('bg-white/50', i !== index);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Auto-advance slides
    slideInterval = setInterval(nextSlide, 4000);
    
    // Pause on hover
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        slideshowContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 4000);
        });
    }
    
    showSlide(0);
}

// Dashboard Functions
let isDashboardLoggedIn = false;

function openDashboard() {
    document.getElementById('dashboardModal').classList.remove('hidden');
    renderDashboard();
}

function closeDashboard() {
    document.getElementById('dashboardModal').classList.add('hidden');
}

function renderDashboard() {
    const loginSection = document.getElementById('dashboardLogin');
    const loggedInSection = document.getElementById('dashboardLoggedIn');
    
    if (isDashboardLoggedIn) {
        loginSection.classList.add('hidden');
        loggedInSection.classList.remove('hidden');
    } else {
        loginSection.classList.remove('hidden');
        loggedInSection.classList.add('hidden');
    }
}

function loginToDashboard() {
    const email = document.getElementById('dashboardEmail').value;
    const password = document.getElementById('dashboardPassword').value;
    
    if (!email || !password) {
        showToast('Please enter email and password', 'error');
        return;
    }
    
    // Simulate login (in production, this would call an API)
    isDashboardLoggedIn = true;
    renderDashboard();
    showToast('Welcome back!', 'success');
}

function logoutDashboard() {
    isDashboardLoggedIn = false;
    renderDashboard();
    showToast('Logged out successfully', 'success');
}

function socialLogin(provider) {
    showToast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'info');
}

function showB2BRegistration() {
    showToast('B2B registration form will open. Contact us at +256 758 238 514 for wholesale account.', 'info');
}

function showOrderTracking() {
    showToast('Enter your order number to track. This feature is coming soon!', 'info');
}

function showContactSupport() {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
}

function viewAllOrders() {
    showToast('Order history will be displayed here', 'info');
}

function quickOrder() {
    closeDashboard();
    scrollToCatalog();
}

// AI Recommendation
async function fetchAiRecommendation(mood, occasion) {
    document.getElementById('aiLoading').classList.remove('hidden');
    document.getElementById('aiRecommendation').classList.add('hidden');

    try {
        // Since we don't have API access in static HTML, we'll provide a simulated response
        // In production, you'd call your backend API here
        const recommendation = await getSimulatedRecommendation(mood, occasion);
        
        document.getElementById('aiLoading').classList.add('hidden');
        document.getElementById('aiSuggestion').textContent = recommendation.suggestion;
        document.getElementById('aiReasoning').textContent = `"${recommendation.reasoning}"`;
        document.getElementById('aiRecommendation').classList.remove('hidden');
    } catch (error) {
        document.getElementById('aiLoading').classList.add('hidden');
        // Fallback to simulated recommendation
        const recommendation = await getSimulatedRecommendation(mood, occasion);
        document.getElementById('aiSuggestion').textContent = recommendation.suggestion;
        document.getElementById('aiReasoning').textContent = `"${recommendation.reasoning}"`;
        document.getElementById('aiRecommendation').classList.remove('hidden');
    }
}

async function getSimulatedRecommendation(mood, occasion) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const recommendations = [
        {
            suggestion: "Cock Sherry Liqueur",
            reasoning: "Perfect for celebratory moments. Its rich, velvety texture and smooth finish make it ideal for toasting special occasions with elegance."
        },
        {
            suggestion: "Cock Gin",
            reasoning: "A versatile choice for social gatherings. Its bold botanical profile creates memorable cocktails that impress any crowd."
        },
        {
            suggestion: "Jogoo Vodka 750ml",
            reasoning: "Crystal clear and exceptionally smooth. Perfect for hosting elegant parties or enjoying pure on the rocks."
        },
        {
            suggestion: "Yellow Cock Gin",
            reasoning: "Distinctive golden hue with unique botanical notes. Creates stunning cocktails that are both visually appealing and delicious."
        },
        {
            suggestion: "Cock Sherry Small",
            reasoning: "The perfect introduction to premium sherry. Rich, sweet, and wonderfully smooth for intimate gatherings."
        },
        {
            suggestion: "Cock Uganda Gin",
            reasoning: "Proudly Ugandan with bold, smooth character. Perfect for those who appreciate local craftsmanship and quality."
        },
        {
            suggestion: "Cock Sherry Liqueur",
            reasoning: "A sophisticated choice for romantic evenings. Its deep aromatic notes create an intimate and luxurious atmosphere."
        },
        {
            suggestion: "Jogoo Vodka",
            reasoning: "Clean and crisp, ideal for formal business events. Its premium quality reflects success and good taste."
        },
        {
            suggestion: "Cock Gin Cocktail Set",
            reasoning: "Creates the ultimate party centerpiece. Impress your guests with professional-quality mixed drinks."
        },
        {
            suggestion: "Cock Sherry Liqueur",
            reasoning: "Rich and velvety, this premium liqueur offers a sophisticated finish to any evening. Perfect for those who appreciate depth and complexity in their drink."
        }
    ];

    // Return a random recommendation
    return recommendations[Math.floor(Math.random() * recommendations.length)];
}

function closeAiRecommendation() {
    document.getElementById('aiRecommendation').classList.add('hidden');
}
