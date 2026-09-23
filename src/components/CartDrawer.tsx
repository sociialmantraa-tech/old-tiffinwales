'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from './CartDrawer.module.css';

export const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsCartOpen(false)}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <ShoppingBag size={22} className={styles.headerIcon} />
            <h2>Your Cart ({cartCount})</h2>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Delivery Banner */}
        <div className={styles.deliveryNotice}>
          <ShieldCheck size={16} />
          <span>Free store pickup or doorstep delivery in Cambridge & Boston</span>
        </div>

        {/* Cart Items List */}
        <div className={styles.itemsContainer}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyIcon}>🍱</div>
              <h3>Your cart is empty</h3>
              <p>Explore our fresh homemade Indian tiffin plans and delicious a la carte dishes.</p>
              <Link
                href="/tiffin"
                className="btn-primary btn-sm"
                onClick={() => setIsCartOpen(false)}
              >
                Explore Meal Plans
              </Link>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImageWrapper}>
                    <img
                      src={item.image || 'https://tiffinwales.com/wp-content/uploads/2026/03/5-day-meal-1.webp'}
                      alt={item.name}
                      className={styles.itemImage}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h4 className={styles.itemName}>{item.name}</h4>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Customizations tags */}
                    {item.customization && (
                      <div className={styles.customTags}>
                        {item.customization.deliveryType && (
                          <span className={styles.tag}>
                            🚚 {item.customization.deliveryType === 'pickup' ? 'Store Pick-up' : 'Home Delivery'}
                          </span>
                        )}
                        {item.customization.breadType && (
                          <span className={styles.tag}>
                            🍞 {item.customization.breadType === 'naan' ? 'Naan' : '2 Rotis'}
                          </span>
                        )}
                        {item.customization.spiceLevel && (
                          <span className={styles.tag}>
                            🌶️ {item.customization.spiceLevel}
                          </span>
                        )}
                      </div>
                    )}

                    <div className={styles.itemFooter}>
                      <div className={styles.qtyControl}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className={styles.qtyNumber}>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span>Subtotal</span>
              <span className={styles.subtotalAmount}>${cartTotal.toFixed(2)}</span>
            </div>
            <p className={styles.taxNote}>Taxes & delivery calculated at checkout</p>
            <div className={styles.footerActions}>
              <Link
                href="/checkout"
                className={`btn-primary ${styles.checkoutBtn}`}
                onClick={() => setIsCartOpen(false)}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/cart"
                className={styles.viewCartLink}
                onClick={() => setIsCartOpen(false)}
              >
                View Complete Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
