// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react'
import { Navbar } from '../features/navigation/components/Navbar'
import { Footer } from '../features/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { resetAddressStatus, selectAddressStatus } from '../features/address/AddressSlice'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  fetchProductsAsync,
  selectProducts,
  selectProductFetchStatus,
} from '../features/products/ProductSlice'
import './HomePage.css'

import {
  hero1, hero2, hero3, hero4,
  model1, model2, model3, model4,
  brand1, brand2
} from '../assets'

export const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const addressStatus = useSelector(selectAddressStatus)
  const products = useSelector(selectProducts)
  const productStatus = useSelector(selectProductFetchStatus)
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      badge: 'NEW COLLECTION',
      title: 'LUXURY\nBEAUTY',
      subtitle: 'JOZY & MARCO',
      bg: '#f0ede8',
      model: model1,
    },
    {
      id: 2,
      badge: 'BESTSELLER',
      title: 'PINK\nQUEEN',
      subtitle: 'Free Shipping Worldwide',
      bg: '#f5eff0',
      model: model2,
    },
    {
      id: 3,
      badge: 'FEATURED',
      title: 'ALL\nNATURAL',
      subtitle: 'Top Quality Skincare',
      bg: '#edf0f5',
      model: model3,
    },
    {
      id: 4,
      badge: 'EXCLUSIVE',
      title: "L'OREAL\nPARIS",
      subtitle: "Because You're Worth It",
      bg: '#f0edf5',
      model: model4,
    },
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

  useEffect(() => {
    dispatch(fetchProductsAsync({
      pagination: { page: 1, limit: 4 },
      sort: { sort: 'createdAt', order: -1 }
    }))
  }, [dispatch])

  useEffect(() => {
    if (addressStatus === 'fulfilled') dispatch(resetAddressStatus())
  }, [addressStatus, dispatch])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

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
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <span className="slide-badge">{slide.badge}</span>
              <h1 style={{ whiteSpace: 'pre-line' }}>{slide.title}</h1>
              <h2>{slide.subtitle}</h2>
              <button
                className="shop-now-btn"
                onClick={() => navigate('/products')}
              >
                EXPLORE BRAND
              </button>
            </motion.div>

            <div className="slide-image-container">
              {slide.model && (
                <motion.img
                  key={`model-${currentSlide}`}
                  src={slide.model}
                  alt={slide.title}
                  className="slide-model"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              )}
            </div>
          </div>
        ))}

        <div className="slide-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
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
          <div className="no-products">
            <p>No products available yet.</p>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  className="product-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => navigate(`/product-details/${product._id}`)}
                >
                  <div className="product-image">
                    <img
                      src={product.thumbnail || 'https://via.placeholder.com/400x400/f8f8f8/ccc?text=No+Image'}
                      alt={product.title}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400/f8f8f8/ccc?text=No+Image' }}
                    />
                    <div className="product-overlay">
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/product-details/${product._id}`) }}>
                        QUICK VIEW
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <p className="product-brand">{product.brand?.name || ''}</p>
                    <h3>{product.title}</h3>
                    <p className="product-price">${product.price}</p>
                    <button
                      className="add-to-cart"
                      onClick={(e) => { e.stopPropagation(); navigate(`/product-details/${product._id}`) }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="view-all-container">
              <button className="view-all-btn" onClick={() => navigate('/products')}>
                VIEW ALL PRODUCTS
              </button>
            </div>
          </>
        )}
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="promo-banner">
        <div className="promo-item">
          <img src={hero1} alt="Skincare" />
          <div className="promo-overlay" />
          <div className="promo-text">
            <span>BEST OF</span>
            <h2>SKINCARE</h2>
            <button className="promo-btn" onClick={() => navigate('/products')}>SHOP NOW</button>
          </div>
        </div>
        <div className="promo-item">
          <img src={hero2} alt="Makeup" />
          <div className="promo-overlay" />
          <div className="promo-text">
            <span>TOP BRANDS</span>
            <h2>MAKEUP</h2>
            <button className="promo-btn" onClick={() => navigate('/products')}>SHOP NOW</button>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="categories-section">
        <p className="section-label">explore</p>
        <h2 className="section-title">SHOP BY <span>CATEGORY</span></h2>
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              className="category-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
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
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              className="brand-card"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              whileHover={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {brand.image ? (
                <img src={brand.image} alt={brand.name} />
              ) : (
                <h3 style={{ fontSize: '1.1rem', fontWeight: 300, letterSpacing: '4px', color: '#333' }}>
                  {brand.name}
                </h3>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}
