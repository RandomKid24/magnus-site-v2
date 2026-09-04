'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Copy,
  Download,
  Eye,
  MapPin,
  MessageCircle,
  Phone,
  QrCode,
  Send,
  Share2,
  Star,
} from 'lucide-react';
import type { BusinessProfile } from '@/lib/profile/data';
import { recordProfileViewAction } from '@/app/profile/actions';

const RATING_LABELS = ['Excellent', 'Very Good', 'Average', 'Poor', 'Terrible'] as const;

function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

function whatsappUrl(phone: string, text?: string): string {
  const digits = phoneDigits(phone);
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

function qrImageUrl(data: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-space text-lg font-bold tracking-tighter uppercase text-white mb-4">
      {children}
    </h2>
  );
}

const fieldClass =
  'w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-lime transition-colors font-sans text-sm placeholder:text-white/30';

export default function ProfilePage({ profile }: { profile: BusinessProfile }) {
  const [views, setViews] = useState(profile.views);
  const [toast, setToast] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [enquiryService, setEnquiryService] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquiryState, setEnquiryState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [sharePhone, setSharePhone] = useState('');
  const [profileUrl, setProfileUrl] = useState('/profile');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProfileUrl(`${window.location.origin}/profile`);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sessionKey = 'magnus-profile-view-recorded';
    void (async () => {
      try {
        if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(sessionKey)) {
          return;
        }
        sessionStorage?.setItem(sessionKey, '1');
        const result = await recordProfileViewAction();
        if (!cancelled) setViews(result.views);
      } catch {
        // Keep the SSR count if increment fails.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const shareText = useMemo(
    () => `${profile.businessName} — ${profile.tagline}. View profile: ${profileUrl}`,
    [profile.businessName, profile.tagline, profileUrl]
  );

  const showToast = (message: string) => setToast(message);

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      showToast('Profile link copied!');
    } catch {
      showToast('Could not copy link');
    }
  };

  const downloadQr = () => {
    const a = document.createElement('a');
    a.href = qrImageUrl(profileUrl);
    a.download = 'magnus-profile-qr.png';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackRating === null) return;
    setFeedbackState('submitting');
    window.setTimeout(() => setFeedbackState('success'), 900);
  };

  const submitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryService) return;
    setEnquiryState('submitting');
    window.setTimeout(() => setEnquiryState('success'), 900);
  };

  const shareToNumber = () => {
    const digits = phoneDigits(sharePhone);
    if (digits.length < 10) {
      showToast('Enter a valid WhatsApp number');
      return;
    }
    const full = digits.length === 10 ? `91${digits}` : digits;
    window.open(
      `https://wa.me/${full}?text=${encodeURIComponent(shareText)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const aboutRows: { label: string; value: string }[] = [
    { label: 'Business Name', value: profile.businessName },
    { label: 'Nature Of Business', value: profile.natureOfBusiness },
    { label: 'GST Number', value: profile.gstNumber },
    { label: 'GST Registration', value: profile.gstRegistration },
    { label: 'Contact Person', value: profile.contactPerson },
  ];

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-lime text-brand-dark px-5 py-2.5 font-sans text-[10px] font-bold tracking-[2px] uppercase whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phone-width card — matches reference max-w-[480px]; no site footer/nav */}
      <div className="mx-auto min-h-screen max-w-[480px] bg-black border-x border-white/10 pb-16">
        <div className="h-2.5 bg-lime" />

        {/* Hero */}
        <div className="px-5 pt-8 pb-6 text-center border-b border-white/10">
          <div className="mx-auto mb-4 w-16 h-16 border border-white/10 bg-zinc-950 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.logoUrl || '/logo.png'}
              alt={profile.businessName}
              className="w-12 h-12 object-contain"
            />
          </div>
          <p className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-lime mb-2">
            GST {profile.gstNumber} · {profile.locationLine}
          </p>
          <h1 className="font-space text-2xl font-bold tracking-tighter uppercase text-white leading-tight mb-3">
            {profile.businessName}
          </h1>
          <p className="font-sans text-sm text-gray-400 leading-relaxed mb-5">
            {profile.tagline} — precision machining & industrial solutions from Nashik,
            Maharashtra, India.
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
            <Eye size={14} className="text-lime" />
            <span className="font-sans text-xs font-bold tracking-widest uppercase">
              {views} views
            </span>
          </div>
          <div className="flex items-start justify-center gap-2 text-gray-400">
            <MapPin size={14} className="text-lime shrink-0 mt-0.5" />
            <span className="font-sans text-[11px] leading-relaxed text-left max-w-[320px]">
              {profile.address}
            </span>
          </div>
        </div>

        {/* About Us */}
        <div className="px-5 py-6 border-b border-white/10">
          <SectionTitle>About Us</SectionTitle>
          <div className="border border-white/10 overflow-hidden">
            {aboutRows.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[140px_1fr] ${i > 0 ? 'border-t border-white/10' : ''}`}
              >
                <div className="px-3 py-3 bg-zinc-950 font-sans text-[9px] font-bold tracking-[1px] uppercase text-gray-400">
                  {row.label} :
                </div>
                <div className="px-3 py-3 font-sans text-xs text-white break-words">{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialities */}
        <div className="px-5 py-6 border-b border-white/10">
          <SectionTitle>Our Specialities</SectionTitle>
          <ul className="space-y-2.5">
            {profile.specialities.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 size={14} className="text-lime opacity-50 shrink-0 mt-0.5" />
                <span className="font-sans text-xs text-white/80 font-medium leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Narrative */}
        <div className="px-5 py-6 border-b border-white/10">
          <p className="font-sans text-xs text-gray-400 leading-relaxed">{profile.narrative}</p>
        </div>

        {/* Services */}
        <div className="px-5 py-6 border-b border-white/10">
          <SectionTitle>Our Services</SectionTitle>
          <div className="space-y-3">
            {profile.services.map((service) => (
              <article key={service.title} className="border border-white/10 bg-zinc-950 p-4">
                <h3 className="font-space text-sm font-bold uppercase tracking-tight text-white mb-1.5">
                  {service.title}
                </h3>
                <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* How we work */}
        <div className="px-5 py-6 border-b border-white/10">
          <SectionTitle>How we work</SectionTitle>
          <div className="border border-white/10 overflow-hidden mb-4">
            {profile.howWeWork.map((step, i) => (
              <div
                key={step.title}
                className={`${i > 0 ? 'border-t border-white/10' : ''}`}
              >
                <div className="px-3 py-2.5 bg-zinc-950 font-space text-xs font-bold text-lime">
                  {step.title}
                </div>
                <div className="px-3 py-2.5 font-sans text-[11px] text-gray-400 leading-relaxed">
                  {step.description}
                </div>
              </div>
            ))}
          </div>
          <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
            UPI, bank transfer, and invoicing details are shared when you confirm an order — contact
            us on{' '}
            <a
              href={`tel:${phoneDigits(profile.phone)}`}
              className="text-lime hover:text-white font-bold"
            >
              {profile.phone}
            </a>{' '}
            or{' '}
            <a
              href={whatsappUrl(profile.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime hover:text-white font-bold inline-flex items-center gap-1"
            >
              WhatsApp <MessageCircle size={12} />
            </a>
            .
          </p>
        </div>

        {/* Gallery */}
        <div className="px-5 py-6 border-b border-white/10">
          <SectionTitle>Gallery</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {profile.gallery.map((item) => (
              <div
                key={item.url + item.title}
                className="relative aspect-square border border-white/10 overflow-hidden bg-zinc-950"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                  <p className="font-sans text-[9px] font-bold tracking-wider uppercase text-white truncate">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="px-5 py-6 border-b border-white/10">
          <SectionTitle>Feedbacks</SectionTitle>
          <div className="border border-white/10 bg-zinc-950 p-4 relative min-h-[160px]">
            <AnimatePresence mode="wait">
              {feedbackState === 'success' ? (
                <motion.div
                  key="fb-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-lime font-sans text-xs font-bold py-6"
                >
                  <CheckCircle2 size={16} /> Success: Feedback Given Successfully.
                </motion.div>
              ) : (
                <motion.form
                  key="fb-form"
                  onSubmit={submitFeedback}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <p className="font-sans text-xs font-bold text-white uppercase tracking-wide">
                    Give Feedback
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {RATING_LABELS.map((label, index) => {
                      const value = index + 1;
                      const active = feedbackRating === value;
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setFeedbackRating(value)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 border text-[9px] font-bold tracking-wide uppercase transition-colors ${
                            active
                              ? 'border-lime bg-lime text-brand-dark'
                              : 'border-white/20 text-gray-400 hover:border-lime hover:text-lime'
                          }`}
                        >
                          <Star size={10} fill={active ? 'currentColor' : 'none'} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="submit"
                    disabled={feedbackRating === null || feedbackState === 'submitting'}
                    className="w-full bg-white text-brand-dark font-bold text-[10px] tracking-[2px] uppercase px-4 py-3 transition-colors hover:bg-lime disabled:opacity-50"
                  >
                    {feedbackState === 'submitting' ? 'Processing...' : 'Submit Feedback'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Enquiry */}
        <div className="px-5 py-6 border-b border-white/10">
          <SectionTitle>Enquiry Form</SectionTitle>
          <div className="border border-white/10 bg-zinc-950 p-4 relative min-h-[180px]">
            <AnimatePresence mode="wait">
              {enquiryState === 'success' ? (
                <motion.div
                  key="eq-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-lime font-sans text-xs font-bold py-6"
                >
                  <CheckCircle2 size={16} /> Success: Enquiry Sent Successfully.
                </motion.div>
              ) : (
                <motion.form
                  key="eq-form"
                  onSubmit={submitEnquiry}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <select
                    value={enquiryService}
                    onChange={(e) => setEnquiryService(e.target.value)}
                    required
                    className={`${fieldClass} appearance-none`}
                  >
                    <option value="" className="bg-zinc-950">
                      Select Service...
                    </option>
                    {profile.services.map((s) => (
                      <option key={s.title} value={s.title} className="bg-zinc-950">
                        {s.title}
                      </option>
                    ))}
                    <option value="Other" className="bg-zinc-950">
                      Other
                    </option>
                  </select>
                  <textarea
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    rows={3}
                    placeholder="Describe your requirement..."
                    className={`${fieldClass} resize-none`}
                  />
                  <button
                    type="submit"
                    disabled={!enquiryService || enquiryState === 'submitting'}
                    className="w-full bg-white text-brand-dark font-bold text-[10px] tracking-[2px] uppercase px-4 py-3 transition-colors hover:bg-lime inline-flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send size={12} />
                    {enquiryState === 'submitting' ? 'Sending...' : 'Send'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Share */}
        <div className="px-5 py-6 border-b border-white/10">
          <SectionTitle>Share</SectionTitle>
          <div className="space-y-5">
            <code className="block font-sans text-[10px] text-gray-400 break-all border border-white/10 px-3 py-2.5 bg-zinc-950">
              {profileUrl}
            </code>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={copyProfileLink}
                className="w-full border border-white/20 text-white font-bold text-[10px] tracking-[2px] uppercase px-4 py-3 hover:border-lime hover:text-lime transition-colors inline-flex items-center justify-center gap-2"
              >
                <Copy size={12} /> Copy Profile Link
              </button>
              <a
                href={whatsappUrl(profile.phone, shareText)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white text-brand-dark font-bold text-[10px] tracking-[2px] uppercase px-4 py-3 hover:bg-lime transition-colors inline-flex items-center justify-center gap-2"
              >
                <Share2 size={12} /> Share on WhatsApp
              </a>
            </div>

            <div className="space-y-3">
              <p className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gray-400 flex items-center gap-2">
                <QrCode size={12} className="text-lime" /> Scan QR to open profile
              </p>
              <div className="border border-white/10 bg-white p-2 w-fit mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImageUrl(profileUrl)}
                  alt="Profile QR code"
                  width={160}
                  height={160}
                  className="w-40 h-40"
                />
              </div>
              <button
                type="button"
                onClick={downloadQr}
                className="w-full border border-white/20 text-white font-bold text-[10px] tracking-[2px] uppercase px-4 py-3 hover:border-lime hover:text-lime transition-colors inline-flex items-center justify-center gap-2"
              >
                <Download size={12} /> Save QR
              </button>
            </div>

            <div className="space-y-3">
              <p className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gray-400">
                Share profile to any WhatsApp number
              </p>
              <div className="flex items-center border-b border-white/10">
                <span className="pr-2 py-3 font-sans text-sm text-gray-500">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={sharePhone}
                  onChange={(e) =>
                    setSharePhone(e.target.value.replace(/[^\d]/g, '').slice(0, 12))
                  }
                  placeholder="WhatsApp number"
                  className="flex-1 bg-transparent py-3 font-sans text-sm text-white focus:outline-none placeholder:text-white/30"
                />
              </div>
              <button
                type="button"
                onClick={shareToNumber}
                className="w-full bg-white text-brand-dark font-bold text-[10px] tracking-[2px] uppercase px-4 py-3 hover:bg-lime transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone size={12} /> Share
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-8 text-center">
          <p className="font-sans text-[9px] font-bold tracking-[2px] uppercase text-gray-500 mb-3">
            © {new Date().getFullYear()} {profile.businessName}
          </p>
          <Link href="/" className="footer-link inline-block text-[10px]">
            Website home
          </Link>
        </div>
      </div>
    </main>
  );
}
