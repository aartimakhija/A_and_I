"use client";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "./StoreContext";

export function Footer() {
  const { siteSettings } = useStore();
  const social: [string, string | null][] = [
    ["Instagram", siteSettings.socialInstagram], ["WhatsApp", siteSettings.socialWhatsapp],
    ["Pinterest", siteSettings.socialPinterest], ["Facebook", siteSettings.socialFacebook], ["X", siteSettings.socialTwitter],
  ].filter(([, url]) => !!url) as [string, string][];

  const cols: [string, [string, string][]][] = [
    ["Shop", [["Collection", "/shop/all"], ["Lookbook", "/lookbook"], ["Journal", "/blog"], ["Bespoke", "/bespoke"], ["Gifting", "/gifting"]]],
    ["Studio", [["The founder", "/founder"], ["The craft", "/craft"], ["Responsibility", "/sustainability"], ["Visit", "/visit"], ["About", "/about"]]],
    ["Help", [["Size & fit", "/size-fit"], ["Shipping & returns", "/shipping-returns"], ["FAQ", "/faq"], ["Refer a friend", "/account/refer"], ["Press", "/press"], ["Contact", "/contact"]]],
    ...(social.length > 0 ? [["Connect", social] as [string, [string, string][]]] : []),
  ];

  return (
    <footer className="relative mt-auto overflow-hidden bg-paper px-5 pb-9 pt-12 text-paper-foreground md:px-12 md:pt-16">
      {siteSettings.footerImageUrl && (
        <>
          <Image src={siteSettings.footerImageUrl} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,12,11,0.55)_0%,rgba(13,12,11,0.8)_60%,rgba(13,12,11,0.92)_100%)]" />
        </>
      )}
      <div className="relative z-[1] mx-auto max-w-[1320px]">
        <div className="mb-11 grid grid-cols-2 gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            {siteSettings.logoUrl ? (
              <div className="relative h-[30px] w-[110px]">
                <Image src={siteSettings.logoUrl} alt="A&I" fill sizes="110px" className="object-contain object-left" />
              </div>
            ) : (
              <div className="font-display text-3xl text-paper-foreground">A <span className="gold-italic">&amp;</span> I</div>
            )}
            <p className="mt-3 max-w-[280px] text-[13px] font-light leading-relaxed text-paper-foreground/55">
              Womenswear where Indian craft meets a global silhouette. Made in small runs, by named hands.
            </p>
            {siteSettings.contactEmail && (
              <a href={`mailto:${siteSettings.contactEmail}`} className="mt-3.5 block text-xs text-paper-foreground/60">
                {siteSettings.contactEmail}
              </a>
            )}
          </div>
          {cols.map(([h, links]) => (
            <div key={h}>
              <div className="mb-3.5 text-[9px] uppercase tracking-[0.25em] text-primary">{h}</div>
              {links.map(([label, href]) => (
                href.startsWith("http") ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="link-underline mb-2 block text-xs font-light text-paper-foreground/60">{label}</a>
                ) : (
                  <Link key={label} href={href} className="link-underline mb-2 block text-xs font-light text-paper-foreground/60">{label}</Link>
                )
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-white/10 pt-5">
          <span className="text-[10px] text-paper-foreground/35">© {new Date().getFullYear()} A&I — Style With Us</span>
          <div className="flex gap-4.5">
            <Link href="/privacy" className="text-[10px] text-paper-foreground/50">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] text-paper-foreground/50">Terms of Service</Link>
          </div>
          <span className="text-[10px] text-paper-foreground/35">Made in India</span>
        </div>
      </div>
    </footer>
  );
}
