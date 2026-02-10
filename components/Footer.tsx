import Link from "next/link";
import { SITE } from "@/lib/site";
import FollowUs from "@/components/FollowUs";
import SocialShareBar from "@/components/SocialShareBar";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="text-lg font-semibold">{SITE.name}</div>
            <p className="mt-2 text-sm text-mist max-w-xl">{SITE.description}</p>

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
                  <Link href="/book" className="hover:text-ink">Book on Treatwell</Link>
                </li>
              </ul>
            </div>

            <div className="text-sm">
              <div className="text-ink font-medium mb-2">Academy</div>
              <ul className="space-y-1 text-mist">
                <li>
                  <a href={SITE.academy} target="_blank" rel="noreferrer" className="hover:text-ink">
                    Taitam-D Beauty Academy
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-sm">
              <div className="text-ink font-medium mb-2">Share on social</div>
              <SocialShareBar compact />
              <div className="mt-5">
                <FollowUs />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-mist">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span className="opacity-80">Bookings via Treatwell</span>
        </div>
      </div>
    </footer>
  );
}
