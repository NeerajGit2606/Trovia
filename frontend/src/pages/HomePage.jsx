import React, { useEffect, useState } from 'react'
import { Navbar } from '../features/navigation/components/Navbar'
import { Footer } from '../features/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { resetAddressStatus, selectAddressStatus } from '../features/address/AddressSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  fetchProductsAsync, selectProducts, selectProductFetchStatus,
} from '../features/products/ProductSlice'
import { addToCartAsync, selectCartItems } from '../features/cart/CartSlice'
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, selectWishlistItems } from '../features/wishlist/WishlistSlice'
import { selectLoggedInUser } from '../features/auth/AuthSlice'
import { toast } from 'react-toastify'
import './HomePage.css'
import { hero1, hero2, hero3, hero4, model1, model2, model3, model4, brand1, brand2 } from '../assets'

const marqueeItems = [
  'FREE SHIPPING WORLDWIDE', 'NEW COLLECTION 2025', 'MONEY BACK WARRANTY',
  'ALL PRODUCTS ARE ECO', '24/7 CUSTOMER SUPPORT', 'SECURE PAYMENTS',
  'FREE SHIPPING WORLDWIDE', 'NEW COLLECTION 2025', 'MONEY BACK WARRANTY',
  'ALL PRODUCTS ARE ECO', '24/7 CUSTOMER SUPPORT', 'SECURE PAYMENTS',
]

const slides = [
  { id: 1, badge: 'NEW COLLECTION', title: 'LUXURY\nBEAUTY', subtitle: 'JOZY & MARCO', bg: '#f0ede8', model: model1 },
  { id: 2, badge: 'BESTSELLER', title: 'PINK\nQUEEN', subtitle: 'Free Shipping Worldwide', bg: '#f5eff0', model: model2 },
  { id: 3, badge: 'FEATURED', title: 'ALL\nNATURAL', subtitle: 'Top Quality Skincare', bg: '#edf0f5', model: model3 },
  { id: 4, badge: 'EXCLUSIVE', title: "L'OREAL\nPARIS", subtitle: "Because You're Worth It", bg: '#f0edf5', model: model4 },
]

const categories = [
  { name: 'FACE', icon: '💄' },
  { name: 'EYES', icon: '👁️' },
  { name: 'LIPS', icon: '💋' },
  { name: 'SKINCARE', icon: '🧴' },
  { name: 'MAKEUP', icon: '🪞' },
]

const brands = [
  { name: "L'OREAL", image: brand1 },
  { name: 'AERIN', image: brand2 },
  { name: 'DIOR', image: null },
  { name: 'CHANEL', image: null },
  { name: 'MAC', image: null },
]

const trustItems = [
  { icon: '🚚', title: 'FREE SHIPPING', desc: 'On orders over $50' },
  { icon: '↩️', title: 'EASY RETURNS', desc: '30-day return policy' },
  { icon: '🎧', title: '24/7 SUPPORT', desc: 'Always here for you' },
  { icon: '🔒', title: 'SECURE PAYMENT', desc: '100% protected' },
]

export const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const addressStatus = useSelector(selectAddressStatus)
  const products = useSelector(selectProducts)
  const productStatus = useSelector(selectProductFetchStatus)
  const cartItems = useSelector(selectCartItems)
  const wishlistItems = useSelector(selectWishlistItems)
  const loggedInUser = useSelector(selectLoggedInUser)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [popup, setPopup] = useState(null)

  useEffect(() => {
    dispatch(fetchProductsAsync({ pagination: { page: 1, limit: 4 }, sort: { sort: 'createdAt', order: -1 }, user: true }))
  }, [dispatch])

  useEffect(() => {
    if (addressStatus === 'fulfilled') dispatch(resetAddressStatus())
  }, [addressStatus, dispatch])

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (popup) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [popup])

  const handleAddToCart = (e, productId) => {
    e.stopPropagation()
    if (!loggedInUser) { navigate('/login'); return }
    dispatch(addToCartAsync({ user: loggedInUser._id, product: productId }))
    toast.success('Added to cart!')
  }

  const handleWishlist = (e, product) => {
    e.stopPropagation()
    if (!loggedInUser) { navigate('/login'); return }
    const inWishlist = wishlistItems.some(i => i.product._id === product._id)
    if (inWishlist) {
      const item = wishlistItems.find(i => i.product._id === product._id)
      dispatch(deleteWishlistItemByIdAsync(item._id))
      toast.success('Removed from wishlist')
    } else {
      dispatch(createWishlistItemAsync({ user: loggedInUser._id, product: product._id }))
      toast.success('Added to wishlist!')
    }
  }

  if (productStatus === 'pending') {
    return (
      <>
        <Navbar isProductList={true} />
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading</p>
        </div>
        <Footer />
      </>
    )
  }

  const featuredProducts = products || []

  return (
    <>
      <Navbar isProductList={true} />

      {/* ===== MARQUEE STRIP ===== */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ===== HERO SLIDER ===== */}
      <section className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ background: slide.bg }}
          >
            <motion.div
              className="slide-content"
              key={`c-${currentSlide}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="slide-badge">{slide.badge}</span>
              <h1 style={{ whiteSpace: 'pre-line' }}>{slide.title}</h1>
              <h2>{slide.subtitle}</h2>
              <button className="shop-now-btn" onClick={() => navigate('/products')}>
                EXPLORE BRAND
              </button>
            </motion.div>
            <div className="slide-image-container">
              {slide.model && (
                <motion.img
                  key={`m-${currentSlide}`}
                  src={slide.model} alt={slide.title}
                  className="slide-model"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9 }}
                />
              )}
            </div>
          </div>
        ))}
        <div className="slide-dots">
          {slides.map((_, i) => (
            <span key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
          ))}
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <div className="trust-strip">
        {trustItems.map((item, i) => (
          <div className="trust-item" key={i}>
            <span className="trust-icon">{item.icon}</span>
            <div className="trust-text">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="featured-products">
        <p className="section-label">curated for you</p>
        <h2 className="section-title">NEW <span>COLLECTION</span></h2>
        {featuredProducts.length === 0 ? (
          <div className="no-products"><p>No products available yet</p></div>
        ) : (
          <>
            <div className="product-grid">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  className="product-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setPopup(product)}
                >
                  <div className="product-image">
                    <img
                      src={product.thumbnail || 'https://via.placeholder.com/400x400/f8f8f8/ccc?text=No+Image'}
                      alt={product.title}
                      onError={e => { e.target.src = 'https://via.placeholder.com/400x400/f8f8f8/ccc?text=No+Image' }}
                    />
                    <div className="product-overlay">
                      <button onClick={e => { e.stopPropagation(); setPopup(product) }}>QUICK VIEW</button>
                    </div>
                  </div>
                  <div className="product-info">
                    <p className="product-brand">{product.brand?.name || ''}</p>
                    <h3>{product.title}</h3>
                    <p className="product-price">${product.price}</p>
                    <button className="add-to-cart" onClick={e => handleAddToCart(e, product._id)}>
                      ADD TO CART
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="view-all-container">
              <button className="view-all-btn" onClick={() => navigate('/products')}>VIEW ALL PRODUCTS</button>
            </div>
          </>
        )}
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="promo-banner">
        <div className="promo-item" onClick={() => navigate('/products')}>
          <img src={hero1} alt="Skincare" />
          <div className="promo-overlay" />
          <div className="promo-text">
            <span>BEST OF</span>
            <h2>SKINCARE</h2>
            <button className="promo-btn">EXPLORE</button>
          </div>
        </div>
        <div className="promo-item" onClick={() => navigate('/products')}>
          <img src={hero2} alt="Makeup" />
          <div className="promo-overlay" />
          <div className="promo-text">
            <span>TOP BRANDS</span>
            <h2>MAKEUP</h2>
            <button className="promo-btn">EXPLORE</button>
          </div>
        </div>
      </section>

      {/* ===== FACE / EYES / LIPS STRIP ===== */}
      <section className="face-strip">
        {[
          { label: 'FACE', img: hero3 },
          { label: 'EYES', img: hero4 },
          { label: 'LIPS', img: hero1 },
        ].map(item => (
          <div key={item.label} className="face-item" onClick={() => navigate('/products')}>
            <img src={item.img} alt={item.label} />
            <div className="face-item-overlay" />
            <div className="face-item-text"><h3>{item.label}</h3></div>
          </div>
        ))}
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="categories-section">
        <p className="section-label">explore</p>
        <h2 className="section-title">SHOP BY <span>CATEGORY</span></h2>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              className="category-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              onClick={() => navigate('/products')}
            >
              <span className="category-icon">{cat.icon}</span>
              <h3>{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== BRANDS ===== */}
      <section className="brands-section">
        <p className="section-label">trusted partners</p>
        <h2 className="section-title">TOP <span>BRANDS</span></h2>
        <div className="brands-grid">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              className="brand-card"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.45 }}
              whileHover={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              {brand.image
                ? <img src={brand.image} alt={brand.name} />
                : <h3>{brand.name}</h3>
              }
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />

      {/* ===== COPYRIGHT BADGE ===== */}
      <div className="copyright-badge">
        © <span>Neeraj Verma</span> · rivavio.com
      </div>

      {/* ===== PRODUCT POPUP ===== */}
      <AnimatePresence>
        {popup && (
          <motion.div
            className="product-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopup(null)}
          >
            <motion.div
              className="product-popup"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="popup-close" onClick={() => setPopup(null)}>✕</button>
              <div className="popup-image">
                <img
                  src={popup.thumbnail || 'https://via.placeholder.com/400x400/f8f8f8/ccc?text=No+Image'}
                  alt={popup.title}
                  onError={e => { e.target.src = 'https://via.placeholder.com/400x400/f8f8f8/ccc?text=No+Image' }}
                />
              </div>
              <div className="popup-content">
                <p className="popup-brand">{popup.brand?.name}</p>
                <h2 className="popup-title">{popup.title}</h2>
                <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.7 }}>{popup.description?.slice(0, 120)}...</p>
                <p className="popup-price">${popup.price}</p>
                {popup.stockQuantity === 0
                  ? <p style={{ color: '#B12704', fontSize: '12px', letterSpacing: '1px' }}>OUT OF STOCK</p>
                  : <p style={{ color: '#007600', fontSize: '12px', letterSpacing: '1px' }}>In Stock</p>
                }
                <button className="popup-btn" onClick={e => { handleAddToCart(e, popup._id); setPopup(null) }}>
                  ADD TO CART
                </button>
                <button className="popup-wishlist-btn" onClick={e => { handleWishlist(e, popup); setPopup(null) }}>
                  ♡ ADD TO WISHLIST
                </button>
                <button
                  style={{ background: 'none', border: 'none', fontSize: '11px', color: '#C9A96E', letterSpacing: '2px', cursor: 'pointer', textTransform: 'uppercase', textAlign: 'left' }}
                  onClick={() => { navigate(`/product-details/${popup._id}`); setPopup(null) }}
                >
                  VIEW FULL DETAILS →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
