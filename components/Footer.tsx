import Link from "next/link";
import { SITE } from "@/lib/site";
import FollowUs from "@/components/FollowUs";
import SocialShareBar from "@/components/SocialShareBar";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-ink/10">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="text-lg font-semibold">{SITE.name}</div>
            <p className="mt-2 text-sm text-mist max-w-xl md:hidden">
              Thai-inspired beauty & wellness in King&apos;s Cross, London.
            </p>
            <p className="mt-2 text-sm text-mist max-w-xl hidden md:block">{SITE.description}</p>

            <p className="mt-4 text-sm text-mist leading-relaxed">
              <span className="text-ink">Address:</span> {SITE.address}
              <br />
              <span className="text-ink">Hours:</span> {SITE.hours}
              <br />
              <span className="text-ink">Phone:</span> {SITE.phone}
            </p>
          </div>

          <div className="md:col-span-7 grid gap-8 sm:grid-cols-3">
            <div className="text-sm">
              <div className="text-ink font-medium mb-2">Explore</div>
              <ul className="space-y-1 text-mist">
                <li>
                  <Link href="/services" className="hover:text-ink">Services</Link>
                </li>
                <li>
                  <Link href="/story" className="hover:text-ink">Our Story</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-ink">Contact</Link>
                </li>
                <li>
                  <Link href="/book" className="hover:text-ink">Book via WhatsApp</Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-ink">Cookie Policy</Link>
                </li>
              </ul>
            </div>

            <div className="text-sm">
              <div className="text-ink font-medium mb-2">Academy</div>
              <ul className="space-y-1 text-mist">
                <li>
                  <a href={SITE.academy} target="_blank" rel="noreferrer" className="hover:text-ink">
                    Taitam-D Academy London
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-sm">
              <div className="text-ink font-medium mb-2">Share</div>
              <SocialShareBar compact />
            </div>

            <div className="text-sm">
              <FollowUs />
            </div>
          </div>
        </div>

        {/* Trading disclosure. Companies (Trading Disclosures) Regulations 2015 reg 25–26
            require the registered name, number, jurisdiction and registered office on the
            site — it carries a fine, so this is not decoration. Wording supplied verbatim
            by Legal (2026-08-11) after checking Companies House; do not paraphrase it, and
            keep the registered office labelled as such so it stays distinct from the shop
            address shown above. */}
        <p className="mt-10 text-xs leading-relaxed text-mist">
          {SITE.name} is a trading name of {SITE.legalName}, a company registered in{" "}
          {SITE.jurisdiction}, company number {SITE.companyNumber}.
          <br />
          Registered office: {SITE.registeredOffice}.
        </p>

        <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-mist">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span className="opacity-80">Bookings via WhatsApp · {SITE.whatsappDisplay}</span>
        </div>
      </div>
    </footer>
  );
}
