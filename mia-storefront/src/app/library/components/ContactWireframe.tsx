"use client";

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Clock, CheckCircle } from 'lucide-react';

export interface ContactProps {
  storeSettings?: {
    primaryColor?: string;
    headingFont?: string;
    bodyFont?: string;
    storeName?: string;
    contactEmail?: string;
    contactPhone?: string;
    contactAddress?: string;
  };
}

export default function ContactWireframe({ storeSettings }: ContactProps) {
  const primaryColor = storeSettings?.primaryColor || "#000000";
  const headingFont = storeSettings?.headingFont || "inherit";
  const bodyFont = storeSettings?.bodyFont || "inherit";
  const email = storeSettings?.contactEmail || "hello@storebrand.com";
  const phone = storeSettings?.contactPhone || "+234 800 123 4567";
  const address = storeSettings?.contactAddress || "123 Fashion Avenue, Lagos, Nigeria";

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-full min-h-full bg-white no-scrollbar" style={{ fontFamily: bodyFont }}>
      {/* Hero Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4" style={{ fontFamily: headingFont }}>
            Get in Touch
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: bodyFont }}>
            Have a question or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: headingFont }}>
                Contact Information
              </h3>
              <p className="text-gray-500 mb-8">
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-500 mt-1">{email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-500 mt-1">{phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Office</h4>
                    <p className="text-gray-500 mt-1">{address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Hours</h4>
                    <p className="text-gray-500 mt-1">Mon - Fri: 9am - 6pm</p>
                    <p className="text-gray-500">Sat: 10am - 4pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {isSent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                </p>
                <button 
                  onClick={() => setIsSent(false)}
                  className="mt-8 text-sm font-medium text-gray-600 underline hover:text-gray-900"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-black text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed font-medium text-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
