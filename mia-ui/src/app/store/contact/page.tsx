"use client";

import React from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <div className="space-y-12">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight mb-6">Get in Touch</h1>
            <p className="text-gray-500 text-lg font-light leading-relaxed max-w-md">
              Whether you have a question about our collection, your order, or just want to say hello, we're here to help.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-900 mb-1">Email Us</h3>
                <p className="text-gray-500 text-sm">concierge@miastore.ai</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-900 mb-1">Call Us</h3>
                <p className="text-gray-500 text-sm">+234 800 MIA STORE</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-900 mb-1">Visit Us</h3>
                <p className="text-gray-500 text-sm">
                  123 Agentic Way, Victoria Island<br />
                  Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-8 sm:p-12 rounded-sm relative overflow-hidden">
          {submitted ? (
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
              <h2 className="font-serif text-2xl font-bold mb-4">Message Received</h2>
              <p className="text-gray-500 text-sm mb-8">
                Thank you for reaching out. Our team (and our AI) will get back to you shortly.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-[10px] uppercase tracking-widest font-bold underline underline-offset-8"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-900">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Jane Doe"
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-900">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="jane@example.com"
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-900">Subject</label>
                <select className="w-full bg-white border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-black transition-colors appearance-none">
                  <option>Order Inquiry</option>
                  <option>Product Question</option>
                  <option>Returns & Exchanges</option>
                  <option>General Feedback</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-900">Message</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="How can we help?"
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-black transition-colors resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-black text-white py-4 text-[11px] uppercase tracking-[0.2em] font-bold rounded-sm hover:bg-gray-900 transition-all flex items-center justify-center gap-3 group"
              >
                Send Message <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}