const products = [
    { id: 1, name: "Blue de Chanel", category: "ətir", price: 85, oldPrice: 110, gender: "Kişi", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=500" },
    { id: 2, name: "Victoria's Secret Bombshell", category: "sprey", price: 35, oldPrice: 50, gender: "Qadın", img: "https://images.unsplash.com/photo-1615037524239-c3a5dd07121e?auto=format&fit=crop&q=80&w=500" },
    { id: 3, name: "MAC Lipstick Red", category: "kosmetika", price: 25, oldPrice: 35, gender: "Qadın", img: "https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=500" },
    { id: 4, name: "Creed Aventus", category: "ətir", price: 150, oldPrice: 190, gender: "Unisex", img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=500" },
    { id: 5, name: "Dior Sauvage", category: "ətir", price: 95, oldPrice: 130, gender: "Kişi", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=500" },
    { id: 6, name: "Nivea Body Mist", category: "sprey", price: 15, oldPrice: 22, gender: "Unisex", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=500" },
    { id: 7, name: "Huda Beauty Palette", category: "kosmetika", price: 55, oldPrice: 75, gender: "Qadın", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=500" },
    { id: 8, name: "Tom Ford Lost Cherry", category: "ətir", price: 180, oldPrice: 240, gender: "Unisex", img: "https://images.unsplash.com/photo-1563170351-be8d1882273f?auto=format&fit=crop&q=80&w=500" }
];

const faqs = [
    { q: "Məhsullarınız orijinaldırmı?", a: "Bəli, AYTAC PARFUM olaraq satdığımız bütün məhsullar 100% orijinaldır." },
    { q: "Çatdırılma necə həyata keçirilir?", a: "Bakı daxili kuryer, bölgələrə poçt vasitəsilə 3-5 iş günü ərzində." },
    { q: "Geri qaytarılma mümkündür?", a: "Qablaşdırması açılmayan məhsullar 3 gün ərzində dəyişdirilə bilər." },
    { q: "Ödəniş üsulları hansılardır?", a: "Nəqd və ya onlayn kart (M10, E-manat) vasitəsilə." }
];

const notifs = [
    { title: "TikTok-da Bizimləsiniz?", text: "Səhifəmizi izləyirsiniz? Ən son endirimləri qaçırmayın!", btn: "TikTok-a get", link: "https://tiktok.com/@aytacparfumm" },
    { title: "ŞOK Endirimlər!", text: "Bütün məhsullarda bu günə özəl 60%-dək endirim var!", btn: "Məhsullara bax", link: "#products" },
    { title: "Instagram-da bizə yazın", text: "1 mesaj kifayyətdir! ", btn: "Instagram", link: "https://instagram.com/aytac.parfummm" }
];

let cart = JSON.parse(localStorage.getItem('aytac_cart')) || [];

window.onload = () => {
    lucide.createIcons();
    renderProducts(products);
    renderFAQ();
    updateCartUI();
    startNotificationTimer();
};

function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }

function renderProducts(data) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = data.map(p => {
        // Уникальное время для каждого товара на основе ID (в секундах)
        const initialSeconds = ((p.id * 7919) % 28800) + 7200; 

        return `
        <div class="product-card p-4 rounded-3xl relative overflow-hidden">
            <div class="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">-${Math.round(((p.oldPrice-p.price)/p.oldPrice)*100)}%</div>
            <img src="${p.img}" class="w-full h-64 object-cover rounded-2xl mb-4 transition-transform hover:scale-110">
            <h4 class="font-bold text-lg">${p.name}</h4>
            <div class="flex gap-3 items-center my-2">
                <span class="text-2xl font-black">${p.price} AZN</span>
                <span class="text-sm opacity-50 line-through">${p.oldPrice} AZN</span>
            </div>
            
       
<div class="countdown-timer">
    <div class="timer-display" data-base-seconds="${initialSeconds}">00:00:00</div>
</div>
            <button onclick="addToCart(${p.id})" class="w-full py-4 border-2 border-[var(--text-color)] rounded-2xl hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] transition-all font-bold">Səbətə at</button>
        </div>
    `;}).join('');
    
    lucide.createIcons();
    initIntersectionObserver();
    startAllTimers(); // Запуск логики тиканья
}
function filterProducts() {
    const search = document.getElementById('productSearch').value.toLowerCase();
    const cat = document.getElementById('categoryFilter').value;
    const gen = document.getElementById('genderFilter').value;
    const sort = document.getElementById('sortFilter').value;

    let filtered = products.filter(p => 
        p.name.toLowerCase().includes(search) &&
        (cat === 'all' || p.category === cat) &&
        (gen === 'all' || p.gender === gen)
    );

    if (sort === 'cheap') filtered.sort((a,b) => a.price - b.price);
    if (sort === 'expensive') filtered.sort((a,b) => b.price - a.price);
    renderProducts(filtered);
}

function renderFAQ() {
    const container = document.getElementById('faq-container');
    container.innerHTML = faqs.map((f, i) => `
        <div class="faq-item">
            <button onclick="toggleFAQ(${i})">${f.q} <i data-lucide="chevron-down"></i></button>
            <div class="faq-content"><div class="faq-answer-box">${f.a}</div></div>
        </div>
    `).join('');
    lucide.createIcons();
}

function toggleFAQ(i) {
    document.querySelectorAll('.faq-item')[i].classList.toggle('active');
}

function addToCart(id) {
    const p = products.find(x => x.id === id);
    const item = cart.find(x => x.id === id);
    if(item) item.qty++; else cart.push({...p, qty: 1});
    saveCart(); updateCartUI(); toggleCart(true);
}

function saveCart() { localStorage.setItem('aytac_cart', JSON.stringify(cart)); }

function updateCartUI() {
    const list = document.getElementById('cart-items');
    document.getElementById('cart-count').innerText = cart.reduce((a,b) => a + b.qty, 0);
    list.innerHTML = cart.map(i => `
        <div class="flex items-center gap-4 bg-[var(--card-bg)] p-4 rounded-2xl border">
            <img src="${i.img}" class="w-16 h-16 rounded-xl object-cover">
            <div class="flex-grow">
                <h5 class="font-bold text-sm">${i.name}</h5>
                <p>${i.price} AZN</p>
                <div class="flex items-center gap-2 mt-1">
                    <button onclick="changeQty(${i.id}, -1)" class="w-6 h-6 border rounded">-</button>
                    <span>${i.qty}</span>
                    <button onclick="changeQty(${i.id}, 1)" class="w-6 h-6 border rounded">+</button>
                </div>
            </div>
        </div>
    `).join('');
    const sum = cart.reduce((a,b) => a + (b.price * b.qty), 0);
    document.getElementById('cart-total').innerText = sum.toFixed(2) + " AZN";
}

function changeQty(id, d) {
    const i = cart.find(x => x.id === id);
    i.qty += d;
    if(i.qty <= 0) cart = cart.filter(x => x.id !== id);
    saveCart(); updateCartUI();
}

function toggleCart(f) {
    const s = document.getElementById('cart-sidebar');
    if(f === true) s.classList.remove('translate-x-full');
    else s.classList.toggle('translate-x-full');
}

function checkoutWhatsApp() {
    let msg = "Salam! Sifarişlərim:\n" + cart.map(i => `• ${i.name} (${i.qty} ədəd)`).join('\n');
    window.open(`https://wa.me/994515975206?text=${encodeURIComponent(msg)}`);
}

function startNotificationTimer() {
    setTimeout(() => {
        showNotification(notifs[Math.floor(Math.random() * notifs.length)]);
    }, 30000);
}

function showNotification(data) {
    const el = document.getElementById('notification');
    document.getElementById('notif-title').innerText = data.title;
    document.getElementById('notif-text').innerText = data.text;
    const btn = document.getElementById('notif-btn');
    btn.innerText = data.btn;
    btn.onclick = () => {
        if(data.link.startsWith('#')) document.querySelector(data.link).scrollIntoView({behavior:'smooth'});
        else window.open(data.link, '_blank');
        closeNotification();
    };
    el.classList.add('show');lucide.createIcons(); 
}

function closeNotification() { document.getElementById('notification').classList.remove('show'); }

function initIntersectionObserver() {
    const obs = new IntersectionObserver((es) => {
        es.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.product-card').forEach(c => obs.observe(c));
}




function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
    
    // Меняем иконку с меню на крестик
    const icon = document.getElementById('menu-icon');
    const isHidden = menu.classList.contains('hidden');
    icon.setAttribute('data-lucide', isHidden ? 'menu' : 'x');
    lucide.createIcons();
}

function startAllTimers() {
    const timers = document.querySelectorAll('.timer-display');
    const startTime = Date.now();

    setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);

        timers.forEach(timer => {
            const baseSeconds = parseInt(timer.getAttribute('data-base-seconds'));
            let timeLeft = baseSeconds - elapsed;
            if (timeLeft <= 0) timeLeft = 0;

            const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
            const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');

            // Теперь здесь ТОЛЬКО цифры, без тега <i>
            timer.innerHTML = `<span style="color:#ff0000 !important;">${h}:${m}:${s}</span>`;
        });
    }, 1000);
}
