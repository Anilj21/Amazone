import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  Home,
  LocateFixed,
  MapPin,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Trash2,
  Truck,
  User
} from 'lucide-react';
import './styles.css';

const storage = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const heroSlides = [
  {
    title: 'Great Indian shopping starts here',
    subtitle: 'Mobiles, fashion, home essentials and daily deals delivered across India.',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1800&q=80'
  },
  {
    title: 'Upgrade your home for less',
    subtitle: 'Kitchen, decor, furniture and appliance picks with bank offers.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1800&q=80'
  },
  {
    title: 'Fresh styles for every plan',
    subtitle: 'Footwear, watches, bags and everyday fashion from top brands.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1800&q=80'
  }
];

const departments = [
  'All',
  'Fresh',
  'Amazone miniTV',
  'Sell',
  'Best Sellers',
  'Mobiles',
  "Today's Deals",
  'Customer Service',
  'Electronics',
  'Prime',
  'Fashion',
  'Home & Kitchen',
  'Sports',
  'Books'
];

const categories = ['All', 'Mobiles', 'Electronics', 'Fashion', 'Home & Kitchen', 'Fresh', 'Sports', 'Books'];

const defaultLocation = {
  label: 'Home',
  name: '',
  phone: '',
  line1: '',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560001',
  zone: 'South',
  lat: 12.9768,
  lng: 77.5863
};

const pincodeDirectory = {
  '560001': { city: 'Bengaluru', state: 'Karnataka', zone: 'South', lat: 12.9768, lng: 77.5863 },
  '110001': { city: 'New Delhi', state: 'Delhi', zone: 'North', lat: 28.6328, lng: 77.2197 },
  '400001': { city: 'Mumbai', state: 'Maharashtra', zone: 'West', lat: 18.9388, lng: 72.8354 },
  '700001': { city: 'Kolkata', state: 'West Bengal', zone: 'East', lat: 22.5726, lng: 88.3639 },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', zone: 'South', lat: 13.0836, lng: 80.2825 },
  '500001': { city: 'Hyderabad', state: 'Telangana', zone: 'South', lat: 17.385,
    lng: 78.4867 },
  '411001': { city: 'Pune', state: 'Maharashtra', zone: 'West', lat: 18.5289, lng: 73.8744 },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', zone: 'West', lat: 23.0225, lng: 72.5714 },
  '302001': { city: 'Jaipur', state: 'Rajasthan', zone: 'North', lat: 26.9124, lng: 75.7873 },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh', zone: 'North', lat: 26.8467, lng: 80.9462 },
  '431001': { city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', zone: 'West', lat: 19.8762, lng: 75.3433 }
};

const cityOptions = Object.entries(pincodeDirectory).map(([pincode, details]) => ({
  pincode,
  ...details
}));

function resolvePincode(pincode) {
  const clean = String(pincode || '').replace(/\D/g, '').slice(0, 6);
  const fallback = clean.length === 6
    ? { city: `Service area ${clean}`, state: 'India', zone: 'Standard', lat: defaultLocation.lat, lng: defaultLocation.lng }
    : {};
  return {
    ...defaultLocation,
    ...(pincodeDirectory[clean] || fallback),
    pincode: clean
  };
}

function deliveryEstimate(location, product) {
  const base = location.zone === 'South' ? 1 : location.zone === 'West' ? 2 : 3;
  const bulky = product?.category === 'Home & Kitchen' && product?.price > 10000 ? 2 : 0;
  const days = base + bulky;
  if (days === 1) return 'Tomorrow by 10 PM';
  return `${days} days`;
}

function discountPercent(product) {
  return Math.round(((product.mrp - product.price) / product.mrp) * 100);
}

function mapUrl(location) {
  const lat = Number(location.lat || defaultLocation.lat);
  const lng = Number(location.lng || defaultLocation.lng);
  const delta = 0.035;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function nearestCity(latitude, longitude) {
  return cityOptions.reduce((nearest, option) => {
    const distance = Math.hypot(Number(option.lat) - latitude, Number(option.lng) - longitude);
    if (!nearest || distance < nearest.distance) return { ...option, distance };
    return nearest;
  }, null);
}

const featureCards = [
  {
    title: 'Appliances for your home',
    category: 'Home & Kitchen',
    items: ['Air conditioners', 'Refrigerators', 'Microwaves', 'Washing machines'],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Revamp your home in style',
    category: 'Home & Kitchen',
    items: ['Bedsheets', 'Lighting', 'Home storage', 'Wall decor'],
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Starting Rs.149 | Headphones',
    category: 'Electronics',
    items: ['boAt', 'Boult', 'Noise', 'Zebronics'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Automotive essentials',
    category: 'Sports',
    items: ['Cleaning', 'Tyre care', 'Helmets', 'Vacuum cleaners'],
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80'
  }
];

function money(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

function App() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('All');
  const [slide, setSlide] = useState(0);
  const [cart, setCart] = useState(() => storage.get('amazonCloneCart', []));
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState(() => storage.get('amazonCloneWishlist', []));
  const [sort, setSort] = useState('featured');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(80000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [dealOnly, setDealOnly] = useState(false);
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [user, setUser] = useState(() => storage.get('amazonCloneUser', defaultLocation));
  const [formUser, setFormUser] = useState(user);
  const [savedAddresses, setSavedAddresses] = useState(() => storage.get('amazonCloneAddresses', [defaultLocation]));
  const [orders, setOrders] = useState(() => storage.get('amazonCloneOrders', []));
  const [paymentMethod, setPaymentMethod] = useState(() => storage.get('amazonClonePayment', 'UPI'));
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => storage.set('amazonCloneCart', cart), [cart]);
  useEffect(() => storage.set('amazonCloneWishlist', wishlist), [wishlist]);
  useEffect(() => storage.set('amazonCloneUser', user), [user]);
  useEffect(() => storage.set('amazonCloneAddresses', savedAddresses), [savedAddresses]);
  useEffect(() => storage.set('amazonCloneOrders', orders), [orders]);
  useEffect(() => storage.set('amazonClonePayment', paymentMethod), [paymentMethod]);
  useEffect(() => {
    let active = true;
    fetch('/api/products')
      .then((response) => {
        if (!response.ok) throw new Error('Product API failed');
        return response.json();
      })
      .then((items) => {
        if (active) {
          setProducts(items);
          setProductsError('');
        }
      })
      .catch(() => {
        if (active) setProductsError('Could not load products from the Express API.');
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((product) => [product.title, product.category, product.badge, ...product.specs].join(' ').toLowerCase().includes(q))
      .slice(0, 5);
  }, [query]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const results = products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const discountPercent = (product.mrp - product.price) / product.mrp;
      const searchable = [product.title, product.category, product.badge, ...product.specs].join(' ').toLowerCase();
      const matchesQuery = !q || searchable.includes(q);
      return (
        matchesCategory &&
        matchesQuery &&
        product.rating >= minRating &&
        product.price <= maxPrice &&
        (!inStockOnly || product.stock > 0) &&
        (!dealOnly || discountPercent >= 0.35 || product.badge.toLowerCase().includes('deal')) &&
        (!wishlistOnly || wishlist.includes(product.id))
      );
    });

    return [...results].sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'discount') return (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp;
      return a.id - b.id;
    });
  }, [category, dealOnly, inStockOnly, maxPrice, minRating, products, query, sort, wishlist, wishlistOnly]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const deliveryFee = subtotal === 0 || subtotal > 499 ? 0 : 49;
  const payable = Math.max(0, subtotal - discount + deliveryFee);
  const soonestDelivery = cart.length > 0 ? deliveryEstimate(user, cart[0]) : deliveryEstimate(user);

  function addToCart(product, openCart = true) {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) => (item.id === product.id ? { ...item, qty: Math.min(product.stock, item.qty + 1) } : item));
      }
      return [...items, { ...product, qty: 1 }];
    });
    if (openCart) setCartOpen(true);
  }

  function updateQty(id, delta) {
    setCart((items) =>
      items
        .map((item) => (item.id === id ? { ...item, qty: Math.min(item.stock, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function toggleWishlist(id) {
    setWishlist((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  }

  function scrollToProducts() {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  function chooseDepartment(value) {
    setActiveTab(value);
    if (categories.includes(value)) {
      setCategory(value);
      setDealOnly(false);
      scrollToProducts();
      return;
    }
    if (value === "Today's Deals") {
      setCategory('All');
      setDealOnly(true);
      setSort('discount');
      scrollToProducts();
      return;
    }
    if (value === 'Best Sellers') {
      setCategory('All');
      setDealOnly(false);
      setSort('rating');
      scrollToProducts();
      return;
    }
    if (value === 'Prime') {
      setCategory('All');
      setQuery('Prime');
      setDealOnly(false);
      scrollToProducts();
      return;
    }
    if (value === 'Customer Service') {
      setOrdersOpen(true);
      return;
    }
    if (value === 'Sell') {
      setAccountOpen(true);
    }
  }

  function selectCategory(value) {
    setActiveTab(value);
    setCategory(value);
    setDealOnly(false);
    scrollToProducts();
  }

  function searchCatalog(event) {
    event.preventDefault();
    setActiveTab(category);
    scrollToProducts();
  }

  function applyFeature(card, item = '') {
    setActiveTab(card.category);
    setCategory(card.category);
    setQuery(item);
    setDealOnly(false);
    scrollToProducts();
  }

  function clearFilters() {
    setActiveTab('All');
    setCategory('All');
    setQuery('');
    setMaxPrice(80000);
    setMinRating(0);
    setSort('featured');
    setInStockOnly(false);
    setDealOnly(false);
    setWishlistOnly(false);
  }

  function handlePincodeChange(value) {
    const clean = value.replace(/\D/g, '').slice(0, 6);
    const resolved = clean.length === 6 ? resolvePincode(clean) : { ...formUser, pincode: clean };
    setFormUser({ ...formUser, ...resolved, pincode: clean });
  }

  function useDeviceLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = Number(position.coords.latitude.toFixed(5));
      const longitude = Number(position.coords.longitude.toFixed(5));
      const nearest = nearestCity(latitude, longitude);
      setFormUser({
        ...formUser,
        ...(nearest || {}),
        city: nearest?.city || formUser.city || '',
        state: nearest?.state || formUser.state || '',
        pincode: nearest?.pincode || formUser.pincode || '',
        zone: nearest?.zone || formUser.zone || '',
        lat: latitude,
        lng: longitude
      });
    });
  }

  function saveLocation(event) {
    event.preventDefault();
    const resolved = resolvePincode(formUser.pincode);
    const nextLocation = {
      ...resolved,
      ...formUser,
      pincode: formUser.pincode || resolved.pincode,
      city: formUser.city || resolved.city,
      state: formUser.state || resolved.state,
      zone: formUser.zone || resolved.zone,
      lat: formUser.lat ?? resolved.lat,
      lng: formUser.lng ?? resolved.lng
    };
    setUser(nextLocation);
    setSavedAddresses((addresses) => {
      const exists = addresses.some((address) => address.pincode === nextLocation.pincode && address.line1 === nextLocation.line1);
      return exists ? addresses : [nextLocation, ...addresses].slice(0, 4);
    });
    setLocationOpen(false);
  }

  function chooseCity(option) {
    setFormUser({
      ...formUser,
      ...option,
      label: formUser.label || 'Home',
      pincode: option.pincode
    });
  }

  function chooseSavedAddress(address) {
    setFormUser(address);
    setUser(address);
    setLocationOpen(false);
  }

  function signIn(event) {
    event.preventDefault();
    setUser({ ...user, name: formUser.name || 'Amazone Shopper' });
    setAccountOpen(false);
  }

  function applyCoupon() {
    setCouponApplied(coupon.trim().toUpperCase() === 'AMAZON10');
  }

  function placeOrder() {
    const order = {
      id: `OD${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: cart.map((item) => ({ id: item.id, title: item.title, qty: item.qty, price: item.price })),
      total: payable,
      address: user,
      paymentMethod,
      delivery: soonestDelivery,
      status: 'Placed'
    };
    setOrders((items) => [order, ...items]);
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    setCoupon('');
    setCouponApplied(false);
  }

  const currentSlide = heroSlides[slide];

  return (
    <>
      <header className="site-header">
        <div className="topbar">
          <button className="logo" aria-label="Amazone home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span>amazone</span>
          </button>

          <button className="deliver" onClick={() => { setFormUser(user); setLocationOpen(true); }}>
            <MapPin size={18} />
            <span>
              <small>Deliver to {user.name || 'you'}</small>
              <strong title={`${user.city || 'Choose city'}, ${user.state || 'India'} ${user.pincode || ''}`}>
                {user.city || 'Choose city'} {user.pincode || ''}
              </strong>
            </span>
          </button>

          <form className="searchbar" onSubmit={searchCatalog}>
            <select value={category} onChange={(event) => selectCategory(event.target.value)} aria-label="Search category">
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <div className="search-field">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Amazone"
                aria-label="Search products"
              />
              {suggestions.length > 0 && (
                <div className="suggestions">
                  {suggestions.map((product) => (
                    <button key={product.id} type="button" onClick={() => { setSelectedProduct(product); setQuery(product.title); }}>
                      <Search size={14} /> {product.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" aria-label="Search">
              <Search size={24} />
            </button>
          </form>

          <button className="header-link" onClick={() => setAccountOpen(true)}>
            <small>Hello, {user.name || 'sign in'}</small>
            <strong>
              Account & Lists <ChevronDown size={13} />
            </strong>
          </button>
          <button className="header-link" onClick={() => setOrdersOpen(true)}>
            <small>Returns</small>
            <strong>& Orders</strong>
          </button>
          <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Open cart">
            <span>{cartCount}</span>
            <ShoppingCart size={29} />
            <strong>Cart</strong>
          </button>
        </div>

        <nav className="navrow" aria-label="Departments">
          <button className={`nav-all ${activeTab === 'All' ? 'active' : ''}`} onClick={() => chooseDepartment('All')}>
            <Menu size={19} /> All
          </button>
          {departments.slice(1).map((department) => (
            <button
              key={department}
              className={activeTab === department ? 'active' : ''}
              onClick={() => chooseDepartment(department)}
            >
              {department}
            </button>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.72), rgba(0,0,0,.18), rgba(234,237,237,.1)), url(${currentSlide.image})` }}>
          <button className="hero-control left" onClick={() => setSlide((slide + heroSlides.length - 1) % heroSlides.length)} aria-label="Previous hero">
            <ChevronLeft size={42} />
          </button>
          <div className="hero-dots" aria-label="Hero slides">
            {heroSlides.map((item, index) => (
              <button key={item.title} className={index === slide ? 'active' : ''} onClick={() => setSlide(index)} aria-label={`Show slide ${index + 1}`} />
            ))}
          </div>
          <button className="hero-control right" onClick={() => setSlide((slide + 1) % heroSlides.length)} aria-label="Next hero">
            <ChevronRight size={42} />
          </button>
        </section>

        <section className="hero-copy">
          <p>Amazone local demo</p>
          <h1>{currentSlide.title}</h1>
          <span>{currentSlide.subtitle}</span>
        </section>

        <section className="service-strip" aria-label="Shopping benefits">
          <div><Truck size={18} /><span>Delivery to <strong>{user.city} {user.pincode}</strong></span></div>
          <div><PackageCheck size={18} /><span>Free delivery above <strong>Rs.499</strong></span></div>
          <div><ShieldCheck size={18} /><span>Secure payments and easy returns</span></div>
        </section>

        <section className="feature-grid" aria-label="Shop by department">
          {featureCards.map((card) => (
            <article className={`feature-card ${activeTab === card.category ? 'active' : ''}`} key={card.title}>
              <h2>{card.title}</h2>
              <button className="feature-image" onClick={() => applyFeature(card)} aria-label={`Shop ${card.title}`}>
                <img src={card.image} alt="" />
              </button>
              <div>
                {card.items.map((item) => (
                  <button key={item} onClick={() => applyFeature(card, item)}>{item}</button>
                ))}
              </div>
              <button className="see-more" onClick={() => applyFeature(card)}>See more</button>
            </article>
          ))}
        </section>

        <section className="deal-strip">
          <div>
            <strong>Today&apos;s Deals</strong>
            <span>Use coupon AMAZON10 for 10% off your cart</span>
          </div>
          <button onClick={() => { setActiveTab("Today's Deals"); setDealOnly(true); setSort('discount'); scrollToProducts(); }}>View best discounts</button>
        </section>

        <section className="products-section" id="products">
          <div className="section-title">
            <div>
              <h2>Results for your Amazone search</h2>
              <p>{filteredProducts.length} items found</p>
            </div>
            <div className="sort-box">
              <SlidersHorizontal size={16} />
              <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products">
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>

          <div className="shopping-layout">
            <aside className="filters">
              <strong>Filters</strong>
              <label>
                Category
                <select value={category} onChange={(event) => selectCategory(event.target.value)}>
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Max price: {money(maxPrice)}
                <input type="range" min="500" max="80000" step="500" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />
              </label>
              <label>
                Minimum rating
                <select value={minRating} onChange={(event) => setMinRating(Number(event.target.value))}>
                  <option value="0">Any rating</option>
                  <option value="4">4 stars & up</option>
                  <option value="4.3">4.3 stars & up</option>
                </select>
              </label>
              <label className="checkline">
                <input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} />
                In stock only
              </label>
              <label className="checkline">
                <input type="checkbox" checked={dealOnly} onChange={(event) => { setDealOnly(event.target.checked); if (event.target.checked) setActiveTab("Today's Deals"); }} />
                Deals and discounts
              </label>
              <label className="checkline">
                <input type="checkbox" checked={wishlistOnly} onChange={(event) => setWishlistOnly(event.target.checked)} />
                Wishlist only
              </label>
              <button onClick={clearFilters}>Clear filters</button>
            </aside>

            <div className="product-grid">
              <div className="active-filters">
                <span className="filter-pill selected">{activeTab}</span>
                {query && <button onClick={() => setQuery('')}>Search: {query} x</button>}
                {dealOnly && <button onClick={() => setDealOnly(false)}>Deals x</button>}
                {inStockOnly && <button onClick={() => setInStockOnly(false)}>In stock x</button>}
                {wishlistOnly && <button onClick={() => setWishlistOnly(false)}>Wishlist x</button>}
                {(query || dealOnly || inStockOnly || wishlistOnly || category !== 'All' || minRating > 0 || maxPrice < 80000) && (
                  <button className="clear-pill" onClick={clearFilters}>Clear all</button>
                )}
              </div>
              {productsLoading && <div className="catalog-message">Loading products from Express API...</div>}
              {productsError && <div className="catalog-message error">{productsError}</div>}
              {!productsLoading && !productsError && filteredProducts.length === 0 && (
                <div className="catalog-message">No products match these filters.</div>
              )}
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <button
                    className={`wish ${wishlist.includes(product.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Add to wishlist"
                  >
                    <Heart size={18} />
                  </button>
                  <button className="product-image" onClick={() => setSelectedProduct(product)}>
                    <img src={product.image} alt={product.title} />
                  </button>
                  <span className="badge">{product.badge}</span>
                  <button className="product-title" onClick={() => setSelectedProduct(product)}>{product.title}</button>
                  <div className="rating">
                    <span>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={14} fill={index < Math.round(product.rating) ? 'currentColor' : 'none'} />
                      ))}
                    </span>
                    <a>{product.reviews}</a>
                  </div>
                  <p className="price">
                    <strong>{money(product.price)}</strong>
                    <span>M.R.P: <s>{money(product.mrp)}</s> · {discountPercent(product)}% off</span>
                  </p>
                  <p className="stock">{product.stock < 10 ? `Only ${product.stock} left in stock` : 'In stock'}</p>
                  <p className="delivery">
                    <Truck size={16} /> FREE delivery {deliveryEstimate(user, product)}
                  </p>
                  <button className="add-cart" onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
        <div className="drawer-header">
          <div>
            <strong>Shopping Cart</strong>
            <span>{cartCount} item{cartCount === 1 ? '' : 's'}</span>
          </div>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart">x</button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={46} />
            <h2>Your Amazone Cart is empty</h2>
            <p>Shop today&apos;s deals and add items here.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{money(item.price)}</span>
                    <div className="qty">
                      <button onClick={() => updateQty(item.id, -1)} aria-label="Decrease quantity">
                        {item.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} aria-label="Increase quantity">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="checkout">
              <p>
                <PackageCheck size={18} />
                Your order is eligible for FREE delivery.
              </p>
              <p className="cart-location">
                <MapPin size={16} />
                Deliver to {user.city}, {user.pincode} in {soonestDelivery}
              </p>
              <label className="coupon">
                <span>Coupon</span>
                <input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Try AMAZON10" />
                <button onClick={applyCoupon}>Apply</button>
              </label>
              {coupon && <small className={couponApplied ? 'coupon-ok' : 'coupon-bad'}>{couponApplied ? 'Coupon applied' : 'Enter AMAZON10 to apply discount'}</small>}
              <strong>Subtotal: {money(subtotal)}</strong>
              <strong className="discount-line">Delivery: {deliveryFee === 0 ? 'FREE' : money(deliveryFee)}</strong>
              {couponApplied && <strong className="discount-line">Discount: -{money(discount)}</strong>}
              <button onClick={() => setCheckoutOpen(true)}>Proceed to Buy</button>
            </div>
          </>
        )}
      </aside>

      {selectedProduct && (
        <div className="modal-wrap">
          <section className="modal product-modal">
            <button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close product">x</button>
            <img src={selectedProduct.image} alt="" />
            <div>
              <span className="badge">{selectedProduct.badge}</span>
              <h2>{selectedProduct.title}</h2>
              <div className="rating">
                <span>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill={index < Math.round(selectedProduct.rating) ? 'currentColor' : 'none'} />
                  ))}
                </span>
                <a>{selectedProduct.reviews} ratings</a>
              </div>
              <p className="price">
                <strong>{money(selectedProduct.price)}</strong>
                <span>M.R.P: <s>{money(selectedProduct.mrp)}</s> · {discountPercent(selectedProduct)}% off</span>
              </p>
              <ul>
                {selectedProduct.specs.map((spec) => <li key={spec}>{spec}</li>)}
              </ul>
              <p className="delivery"><Truck size={16} /> FREE delivery {deliveryEstimate(user, selectedProduct)} to {user.pincode}</p>
              <p className="secure"><ShieldCheck size={16} /> Secure transaction with easy returns.</p>
              <button className="add-cart" onClick={() => addToCart(selectedProduct)}>Add to Cart</button>
              <button className="buy-now" onClick={() => { addToCart(selectedProduct, false); setSelectedProduct(null); setCheckoutOpen(true); }}>Buy Now</button>
            </div>
          </section>
        </div>
      )}

      {locationOpen && (
        <div className="modal-wrap">
          <form className="modal location-modal" onSubmit={saveLocation}>
            <button type="button" className="modal-close" onClick={() => setLocationOpen(false)} aria-label="Close location">x</button>
            <h2>Choose your location</h2>
            <div className="city-selector" aria-label="Popular delivery cities">
              {cityOptions.map((option) => (
                <button
                  type="button"
                  key={option.pincode}
                  className={formUser.pincode === option.pincode ? 'active' : ''}
                  onClick={() => chooseCity(option)}
                >
                  <strong>{option.city}</strong>
                  <span>{option.state} · {option.pincode}</span>
                </button>
              ))}
            </div>
            <div className="location-layout">
              <div className="address-form">
                <label>Address label<input value={formUser.label || ''} onChange={(event) => setFormUser({ ...formUser, label: event.target.value })} placeholder="Home, Work, Hostel" /></label>
                <label>Full name<input value={formUser.name || ''} onChange={(event) => setFormUser({ ...formUser, name: event.target.value })} placeholder="Receiver name" /></label>
                <label>Phone<input value={formUser.phone || ''} onChange={(event) => setFormUser({ ...formUser, phone: event.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10 digit mobile number" /></label>
                <label>Flat / House / Street<input value={formUser.line1 || ''} onChange={(event) => setFormUser({ ...formUser, line1: event.target.value })} placeholder="House no, building, street" /></label>
                <div className="form-row">
                  <label>Pincode<input value={formUser.pincode || ''} onChange={(event) => handlePincodeChange(event.target.value)} placeholder="560001" /></label>
                  <label>City<input value={formUser.city || ''} onChange={(event) => setFormUser({ ...formUser, city: event.target.value })} /></label>
                </div>
                <p className="location-hint">
                  Showing {formUser.city || 'city'}, {formUser.state || 'state'} for pincode {formUser.pincode || '------'}.
                </p>
                <div className="form-row">
                  <label>State<input value={formUser.state || ''} onChange={(event) => setFormUser({ ...formUser, state: event.target.value })} /></label>
                  <label>Zone<input value={formUser.zone || ''} onChange={(event) => setFormUser({ ...formUser, zone: event.target.value })} /></label>
                </div>
                <div className="location-actions">
                  <button type="button" onClick={useDeviceLocation}><LocateFixed size={16} /> Use device location</button>
                  <button className="primary-action">Save location</button>
                </div>
              </div>
              <div className="map-panel">
                <iframe title="Delivery map preview" src={mapUrl(formUser)} loading="lazy" />
                <div>
                  <strong>{formUser.city || 'Choose a city'}, {formUser.pincode || 'pincode'}</strong>
                  <span>{formUser.state || 'Select a city or enter pincode'} · {formUser.zone || 'Delivery'} zone</span>
                  <span>Estimated delivery: {deliveryEstimate(formUser)}</span>
                </div>
              </div>
            </div>
            {savedAddresses.length > 0 && (
              <div className="saved-addresses">
                <strong>Saved addresses</strong>
                {savedAddresses.map((address, index) => (
                  <button type="button" key={`${address.pincode}-${index}`} onClick={() => chooseSavedAddress(address)}>
                    <Home size={16} />
                    <span>{address.label || 'Saved'} · {address.city}, {address.pincode}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      )}

      {accountOpen && (
        <div className="modal-wrap">
          <form className="modal small-modal" onSubmit={signIn}>
            <button type="button" className="modal-close" onClick={() => setAccountOpen(false)} aria-label="Close account">x</button>
            <User size={30} />
            <h2>Sign in</h2>
            <label>Your name<input value={formUser.name} onChange={(event) => setFormUser({ ...formUser, name: event.target.value })} placeholder="Amazone Shopper" /></label>
            <div className="account-stats">
              <span>{savedAddresses.length} saved address{savedAddresses.length === 1 ? '' : 'es'}</span>
              <span>{wishlist.length} wishlist item{wishlist.length === 1 ? '' : 's'}</span>
              <span>{orders.length} order{orders.length === 1 ? '' : 's'}</span>
            </div>
            <button className="primary-action">Continue</button>
          </form>
        </div>
      )}

      {ordersOpen && (
        <div className="modal-wrap">
          <section className="modal orders-modal">
            <button className="modal-close" onClick={() => setOrdersOpen(false)} aria-label="Close orders">x</button>
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
              <p>No recent orders yet. Add products to your cart and place a demo order.</p>
            ) : (
              <div className="order-list">
                {orders.map((order) => (
                  <article key={order.id}>
                    <div>
                      <strong>{order.id}</strong>
                      <span>{order.date} · {order.status}</span>
                    </div>
                    <p>{order.items.length} item{order.items.length === 1 ? '' : 's'} · {money(order.total)} · {order.paymentMethod}</p>
                    <p>Delivering to {order.address.city} {order.address.pincode} in {order.delivery}</p>
                  </article>
                ))}
              </div>
            )}
            <button className="primary-action" onClick={() => setOrdersOpen(false)}>Done</button>
          </section>
        </div>
      )}

      {checkoutOpen && (
        <div className="modal-wrap">
          <section className="modal checkout-modal">
            <button className="modal-close" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout">x</button>
            <h2>Checkout</h2>
            <div className="checkout-grid">
              <div>
                <h3>Delivery address</h3>
                <p>{user.name || 'Amazone Shopper'}</p>
                <p>{user.line1 || 'Address line not added'}</p>
                <p>{user.city}, {user.state} {user.pincode}</p>
                <button className="link-button" onClick={() => { setFormUser(user); setCheckoutOpen(false); setLocationOpen(true); }}>Change address</button>
              </div>
              <div>
                <h3>Payment method</h3>
                {['UPI', 'Card', 'Cash on Delivery'].map((method) => (
                  <label className="radio-line" key={method}>
                    <input type="radio" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                    <CreditCard size={16} /> {method}
                  </label>
                ))}
              </div>
              <div className="summary-box">
                <h3>Order summary</h3>
                <p><span>Items</span><strong>{cartCount}</strong></p>
                <p><span>Subtotal</span><strong>{money(subtotal)}</strong></p>
                <p><span>Delivery</span><strong>{deliveryFee === 0 ? 'FREE' : money(deliveryFee)}</strong></p>
                {couponApplied && <p><span>Coupon</span><strong>-{money(discount)}</strong></p>}
                <p><span>Arrives</span><strong>{soonestDelivery}</strong></p>
                <strong className="payable">Total payable: {money(payable)}</strong>
              </div>
            </div>
            <button className="primary-action" disabled={cart.length === 0} onClick={placeOrder}>Place demo order</button>
          </section>
        </div>
      )}

      {(cartOpen || selectedProduct || locationOpen || accountOpen || ordersOpen || checkoutOpen) && (
        <button
          className="scrim"
          onClick={() => {
            setCartOpen(false);
            setSelectedProduct(null);
            setLocationOpen(false);
            setAccountOpen(false);
            setOrdersOpen(false);
            setCheckoutOpen(false);
          }}
          aria-label="Close overlay"
        />
      )}

      <footer>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</button>
        <div className="footer-grid">
          <div><strong>Get to Know Us</strong><span>About this clone</span><span>Careers</span><span>Press Releases</span></div>
          <div><strong>Connect with Us</strong><span>Facebook</span><span>Twitter</span><span>Instagram</span></div>
          <div><strong>Make Money with Us</strong><span>Sell on Amazone</span><span>Advertise products</span><span>Fulfilment tools</span></div>
          <div><strong>Let Us Help You</strong><span>Your Account</span><span>Returns Centre</span><span>Help</span></div>
        </div>
        <p>This is a local educational clone and is not affiliated with Amazon.</p>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

