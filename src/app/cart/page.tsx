'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { calculateDeliveryFee } from '@/lib/delivery';
import styles from './cart.module.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const isPickup = cart.some((i) => i.customization?.deliveryType === 'pickup');
  const deliveryInfo = calculateDeliveryFee(cart, isPickup ? 'pickup' : 'delivery');
  const deliveryFee = deliveryInfo.deliveryFee;
  const estimatedTax = cartTotal * 0.0625; // MA meals tax 6.25%
  const grandTotal = cartTotal + deliveryFee + estimatedTax;

  if (cart.length === 0) {
    return (
      <div className={`tw-container ${styles.emptyContainer}`}>
        <div className={styles.emptyEmoji}>🍱</div>
        <h1 className={styles.emptyHeading}>Your Cart is Empty</h1>
        <p className={styles.emptySub}>
          You haven&apos;t added any tiffin meal plans or extra sides yet. Explore our delicious menu today!
        </p>
        <Link href="/tiffin" className="btn-primary">
          Explore Meal Plans
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartPageWrapper}>
      <div className="tw-container">
        <h1 className={styles.cartTitle}>Review Your Order</h1>

        <div className={styles.cartLayout}>
          {/* Left Column: Cart Items List */}
          <div className={styles.cartItemsCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Items in Cart ({cart.length})</h2>
              <button
                onClick={clearCart}
                className={styles.clearAllBtn}
              >
                Clear All
              </button>
            </div>

            <div className={styles.itemsList}>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItemRow}>
                  <img
                    src={item.image || 'https://tiffinwales.com/wp-content/uploads/2026/03/5-day-meal-1.webp'}
                    alt={item.name}
                    className={styles.cartItemImg}
                  />
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitleRow}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={styles.removeBtn}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.customization && (
                      <div className={styles.customTags}>
                        {item.customization.deliveryType && (
                          <span className={styles.customTag}>
                            🚚 {item.customization.deliveryType === 'pickup' ? 'Store Pick-up' : 'Delivery'}
                          </span>
                        )}
                        {item.customization.breadType && (
                          <span className={styles.customTag}>
                            🍞 {item.customization.breadType === 'naan' ? 'Naan' : '2 Rotis'}
                          </span>
                        )}
                        {item.customization.spiceLevel && (
                          <span className={styles.customTag}>
                            🌶️ {item.customization.spiceLevel}
                          </span>
                        )}
                      </div>
                    )}

                    <div className={styles.itemPriceRow}>
                      <div className={styles.qtyControl}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={styles.qtyBtn}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className={styles.qtyNumber}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={styles.qtyBtn}
                          aria-label="Increase quantity"
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
          </div>

          {/* Right Column: Order Summary Box */}
          <div className={styles.orderSummaryCard}>
            <h2 className={styles.summaryTitle}>
              Order Summary
            </h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>

              <div className={styles.summaryRow}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>Delivery Fee</span>
                  {!isPickup && deliveryInfo.totalDeliveryDays > 0 && (
                    <span className={styles.deliveryDetailTag}>
                      {deliveryInfo.totalDeliveryDays > 1 ? `${deliveryInfo.totalDeliveryDays} Deliveries × $8/day` : '1 Delivery'}
                    </span>
                  )}
                </div>
                {isPickup ? (
                  <strong className={styles.pickupFreeTag}>FREE (Store Pickup)</strong>
                ) : (
                  <strong>${deliveryFee.toFixed(2)}</strong>
                )}
              </div>

              <div className={styles.summaryRow}>
                <span>Estimated MA Tax (6.25%)</span>
                <strong>${estimatedTax.toFixed(2)}</strong>
              </div>

              <div className={styles.totalDividerRow}>
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className={`btn-primary ${styles.checkoutBtnFull}`}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </Link>

            <div className={styles.trustSecureBox}>
              <ShieldCheck size={18} className={styles.secureIcon} />
              <span>Safe &amp; Secure 256-Bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
