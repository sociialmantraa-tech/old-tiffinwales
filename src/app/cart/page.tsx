'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { calculateDeliveryFee } from '@/lib/delivery';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const isPickup = cart.some(i => i.customization?.deliveryType === 'pickup');
  const deliveryInfo = calculateDeliveryFee(cart, isPickup ? 'pickup' : 'delivery');
  const deliveryFee = deliveryInfo.deliveryFee;
  const estimatedTax = cartTotal * 0.0625; // MA meals tax 6.25%
  const grandTotal = cartTotal + deliveryFee + estimatedTax;

  if (cart.length === 0) {
    return (
      <div className="tw-container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🍱</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Your Cart is Empty</h1>
        <p style={{ color: 'var(--tw-muted)', maxWidth: '460px', margin: '0 auto 24px auto' }}>
          You haven&apos;t added any tiffin meal plans or extra sides yet. Explore our delicious menu today!
        </p>
        <Link href="/tiffin" className="btn-primary">
          Explore Meal Plans
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px 0', background: 'var(--tw-cream)', minHeight: '80vh' }}>
      <div className="tw-container">
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '30px' }}>Review Your Order</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '30px' }}>
          {/* Cart Items List */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--tw-border)', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--tw-border-light)', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Items in Cart ({cart.length})</h2>
              <button
                onClick={clearCart}
                style={{ background: 'none', border: 'none', color: 'var(--tw-muted)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Clear All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--tw-border-light)', paddingBottom: '20px' }}>
                  <img
                    src={item.image || 'https://tiffinwales.com/wp-content/uploads/2026/03/5-day-meal-1.webp'}
                    alt={item.name}
                    style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--tw-border)' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.customization && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '4px 0' }}>
                        {item.customization.deliveryType && (
                          <span style={{ fontSize: '0.75rem', background: 'var(--tw-cream)', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--tw-border)' }}>
                            🚚 {item.customization.deliveryType === 'pickup' ? 'Store Pick-up' : 'Delivery'}
                          </span>
                        )}
                        {item.customization.breadType && (
                          <span style={{ fontSize: '0.75rem', background: 'var(--tw-cream)', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--tw-border)' }}>
                            🍞 {item.customization.breadType === 'naan' ? 'Naan' : '2 Rotis'}
                          </span>
                        )}
                        {item.customization.spiceLevel && (
                          <span style={{ fontSize: '0.75rem', background: 'var(--tw-cream)', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--tw-border)' }}>
                            🌶️ {item.customization.spiceLevel}
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--tw-cream)', border: '1px solid var(--tw-border)', borderRadius: 'var(--radius-full)', padding: '2px' }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ padding: '0 10px', fontWeight: 800, fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--tw-orange)' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Box */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--tw-border)', padding: '28px', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid var(--tw-border-light)', paddingBottom: '14px' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                <span>Subtotal</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>Delivery Fee</span>
                  {!isPickup && deliveryInfo.totalDeliveryDays > 0 && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--tw-orange)', fontWeight: 600 }}>
                      {deliveryInfo.totalDeliveryDays > 1 ? `${deliveryInfo.totalDeliveryDays} Deliveries × $8/day` : '1 Delivery'}
                    </span>
                  )}
                </div>
                {isPickup ? (
                  <strong style={{ color: 'var(--tw-veg)' }}>FREE (Store Pickup)</strong>
                ) : (
                  <strong style={{ color: 'var(--tw-dark)' }}>${deliveryFee.toFixed(2)}</strong>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                <span>Estimated MA Tax (6.25%)</span>
                <strong>${estimatedTax.toFixed(2)}</strong>
              </div>
              <div style={{ borderTop: '1.5px solid var(--tw-border)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 900, color: 'var(--tw-dark)' }}>
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary" style={{ width: '100%', marginBottom: '14px' }}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#6b7280', background: 'var(--tw-cream)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <ShieldCheck size={18} style={{ color: 'var(--tw-veg)', flexShrink: 0 }} />
              <span>Safe &amp; Secure 256-Bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
