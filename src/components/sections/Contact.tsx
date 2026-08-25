'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { contactInfo } from '../../constants';
import type { ContactData } from '@/lib/cms/blocks/schemas';

const FALLBACK: ContactData = {
  eyebrow: 'Inquiries',
  title_plain: 'START A',
  title_accent: 'PRECISION PROJECT.',
};

export default function Contact({
  data,
  contact,
}: {
  data?: ContactData;
  contact?: { email: string; phone: string; address: string };
}) {
  const content = data ?? FALLBACK;
  const info = contact ?? contactInfo;
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => setFormState('success'), 1500);
  };

  return (
    <section className="py-20 px-[5%] bg-black scroll-mt-[100px]" id="contact">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="h-[1px] w-12 bg-lime"></div>
                <span className="font-sans text-[10px] font-bold tracking-[6px] uppercase text-gray-400">{content.eyebrow}</span>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-space text-[clamp(40px,5vw,72px)] leading-[1] text-white tracking-tighter mb-12 font-bold uppercase"
              >
                {content.title_plain} <br />
                <span className="text-lime">{content.title_accent}</span>
              </motion.h2>

              <div className="space-y-12">
                <div className="group flex items-start gap-8">
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center border border-white/10 transition-colors group-hover:border-lime bg-zinc-950">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div>
                    <span className="font-sans text-[10px] font-bold text-gray-400 tracking-[3px] uppercase block mb-2">Email Baseline</span>
                    <a href={`mailto:${info.email}`} className="font-space text-xl text-white hover:text-lime transition-colors">{info.email}</a>
                  </div>
                </div>

                <div className="group flex items-start gap-8">
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center border border-white/10 transition-colors group-hover:border-lime bg-zinc-950">
                    <Phone size={20} className="text-white" />
                  </div>
                  <div>
                    <span className="font-sans text-[10px] font-bold text-gray-400 tracking-[3px] uppercase block mb-2">Direct Line</span>
                    <a href={`tel:${info.phone.replace(/\s/g, '')}`} className="font-space text-xl text-white hover:text-lime transition-colors">{info.phone}</a>
                  </div>
                </div>

                <div className="group flex items-start gap-8">
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center border border-white/10 transition-colors group-hover:border-lime bg-zinc-950">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div>
                    <span className="font-sans text-[10px] font-bold text-gray-400 tracking-[3px] uppercase block mb-2">Base Operations</span>
                    <p className="font-sans text-xs text-gray-400 leading-relaxed uppercase tracking-widest font-bold max-w-xs">{info.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-16 border border-white/10 bg-zinc-950 relative shadow-2xl">
              <AnimatePresence mode="wait">
                {formState === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 bg-zinc-950 z-20 flex flex-col items-center justify-center p-10 text-center"
                  >
                    <div className="w-20 h-20 bg-lime rounded-full flex items-center justify-center mb-8">
                      <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <h3 className="font-space text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Transmission Received</h3>
                    <p className="font-sans text-xs text-gray-400 uppercase tracking-widest font-bold leading-relaxed">Our engineering team will review your specifications and contact you shortly.</p>
                    <button 
                      onClick={() => setFormState('idle')}
                      className="mt-10 font-space text-[10px] font-bold text-lime hover:text-white transition-colors tracking-[4px] uppercase underline underline-offset-8"
                    >
                      New Submission
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-10"
                  >
                    <div className="grid sm:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="font-sans text-[10px] font-bold text-gray-400 tracking-[4px] uppercase">First Name</label>
                        <input required type="text" className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-lime transition-colors font-sans text-sm placeholder:text-white/30" placeholder="John" />
                      </div>
                      <div className="space-y-4">
                        <label className="font-sans text-[10px] font-bold text-gray-400 tracking-[4px] uppercase">Last Name</label>
                        <input required type="text" className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-lime transition-colors font-sans text-sm placeholder:text-white/30" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="font-sans text-[10px] font-bold text-gray-400 tracking-[4px] uppercase">Email Address</label>
                      <input required type="email" className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-lime transition-colors font-sans text-sm placeholder:text-white/30" placeholder="john@enterprise.com" />
                    </div>
                    <div className="space-y-4">
                      <label className="font-sans text-[10px] font-bold text-gray-400 tracking-[4px] uppercase">Project Description</label>
                      <textarea required rows={4} className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-lime transition-colors font-sans text-sm resize-none placeholder:text-white/30" placeholder="Describe your manufacturing requirements..." />
                    </div>
                    <button 
                      disabled={formState === 'submitting'}
                      className="btn-primary-custom w-full flex items-center justify-center gap-4 group"
                    >
                      {formState === 'submitting' ? 'Processing...' : (
                        <>
                          Send Message
                          <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
