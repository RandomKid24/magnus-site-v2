'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Linkedin, Twitter, Facebook, ArrowUpRight, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { contactInfo } from '../../constants';
import type { PublicNavigationItem } from '@/lib/cms/navigation';
import type { SiteSettings } from '@/lib/cms/settings';

const DEFAULT_ITEMS = ['Products', 'Solutions', 'Fleet', 'Gallery', 'About', 'Contact'];

export default function Footer({
  scrollToId,
  items,
  settings,
}: {
  scrollToId: (e: React.MouseEvent, id: string) => void;
  /** CMS-driven navigation; falls back to the original anchor menu. */
  items?: PublicNavigationItem[];
  settings?: SiteSettings;
}) {
  const identity = settings?.identity;
  const contact = settings?.contact ?? contactInfo;
  const social = settings?.social;

  const navTargets = React.useMemo(() => {
    if (!items || items.length === 0) {
      return DEFAULT_ITEMS.map((label) => ({
        label,
        id: label.toLowerCase().replace(' ', '-'),
        url: `#${label.toLowerCase().replace(' ', '-')}`,
        external: false,
        newTab: false,
      }));
    }
    return items.map((item) => {
      const isAnchor = item.url.startsWith('#');
      return {
        label: item.label,
        id: isAnchor ? item.url.slice(1) : '',
        url: item.url,
        external: !isAnchor && /^https?:\/\//i.test(item.url),
        newTab: item.opensInNewTab,
      };
    });
  }, [items]);

  const socials = [
    ...(social?.linkedin ? [{ Icon: Linkedin, href: social.linkedin }] : []),
    ...(social?.twitter ? [{ Icon: Twitter, href: social.twitter }] : []),
    ...(social?.facebook ? [{ Icon: Facebook, href: social.facebook }] : []),
  ];

  return (
    <footer className="relative py-24 px-[5%] bg-black text-white border-t border-white/10 overflow-hidden">
      {/* Background Dots & Glow */}
      <div className="absolute inset-0 bg-dots opacity-[0.02] pointer-events-none text-white/5 z-0" />
      <div className="absolute -bottom-24 -left-24 w-[300px] h-[300px] bg-lime/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          
          {/* Column 1: Branding & Quality Statement */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center relative select-none">
                <img src={identity?.logo_url ?? '/logo.png'} alt="Magnus Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(204,255,0,0.1)]" />
              </div>
              <div className="flex flex-col -space-y-0.5">
                <span className="font-space text-2xl font-bold tracking-tight">{identity?.name ?? 'Magnus'}</span>
                <span className="font-sans text-[8px] font-bold tracking-[3px] text-lime">{identity?.suffix ?? 'Enterprises'}</span>
              </div>
            </div>
            <p className="font-sans text-xs text-gray-400 leading-relaxed max-w-xs">
              {identity?.footer_blurb ?? 'ISO 9001:2015 Certified Precision Machining & Switchgear Assembly Facility. Nashik, India.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 flex items-center justify-center bg-zinc-950 border border-white/10 text-lime">
                <ShieldCheck size={16} />
              </div>
              <span className="font-space text-[10px] font-bold tracking-[2px]">{identity?.certification_label ?? 'QMS Certified'}</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-6">
            <h4 className="font-space text-xs font-bold text-white/60 border-b border-white/10 pb-2">
              Site Navigation
            </h4>
            <ul className="space-y-3 list-none">
              {navTargets.map((target) => (
                <li key={target.label}>
                  <motion.a 
                    whileHover={{ x: 4, color: "#CCFF00" }}
                    href={target.url}
                    target={target.newTab || target.external ? '_blank' : undefined}
                    rel={target.newTab || target.external ? 'noopener noreferrer' : undefined}
                    className="group inline-flex items-center gap-2 font-sans text-[13px] font-bold text-gray-400 transition-colors duration-300"
                    onClick={(e) => {
                      if (target.id) scrollToId(e, target.id);
                    }}
                  >
                    <span>{target.label}</span>
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Capabilities */}
          <div className="space-y-6">
            <h4 className="font-space text-xs font-bold text-white/60 border-b border-white/10 pb-2">
              Our Capabilities
            </h4>
            <ul className="space-y-3 list-none font-sans text-[13px] font-bold text-gray-400">
              <li>CNC VMC Milling</li>
              <li>CNC Turning</li>
              <li>Switchgear Mechanism</li>
              <li>Automatic Tapping</li>
              <li>Laser Sheet Processing</li>
            </ul>
          </div>

          {/* Column 4: Quick Contact */}
          <div className="space-y-6">
            <h4 className="font-space text-xs font-bold text-white/60 border-b border-white/10 pb-2">
              Contact Base
            </h4>
            <ul className="space-y-4 list-none">
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-lime flex-shrink-0" />
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="font-sans text-[13px] font-bold text-gray-400 hover:text-white transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-lime flex-shrink-0" />
                <a href={`mailto:${contact.email}`} className="font-sans text-[13px] font-bold text-gray-400 hover:text-white transition-colors break-all">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-lime flex-shrink-0 mt-0.5" />
                <span className="font-sans text-[13px] font-bold text-gray-400 leading-relaxed">
                  {contact.address}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Copyright */}
          <span className="font-sans text-[13px] font-bold text-white text-center md:text-left">
            © 2026 Magnus Enterprises | Nashik, India | ISO 9001:2015
          </span>

          {/* Legal */}
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
            <Link href="/terms" className="footer-link">Terms &amp; Conditions</Link>
          </div>

          {/* Socials */}
          {socials.length > 0 && <div className="flex gap-6">
            {socials.map(({ Icon, href }, i) => (
              <motion.a 
                key={i} 
                whileHover={{ scale: 1.15, rotate: 5, color: "#CCFF00", borderColor: "#CCFF00" }}
                whileTap={{ scale: 0.95 }}
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:text-lime transition-colors duration-300"
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>}

          {/* Developer Marker */}
          <span className="font-sans text-[13px] font-bold text-white hover:text-lime transition-colors cursor-default">
            Forged by Beforth
          </span>
        </div>
      </div>
    </footer>
  );
}
