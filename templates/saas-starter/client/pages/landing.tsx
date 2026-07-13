import {
  LandingHeader, LandingHero, LandingFeatures, LandingSection,
  LandingFooter, PricingCard, Button, ThemeToggle,
} from "~/components.ts";
import { Icon } from "@kotsumo/in-it/icons";
import { Link } from "@kotsumo/in-it/router";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "/login", label: "Sign In" },
];

const FEATURES = [
  { icon: "rocket", title: "Quick Setup", description: "Get your SaaS running in minutes with pre-built components and templates." },
  { icon: "shield-check", title: "Secure by Default", description: "Built-in XSS protection, CSRF tokens, and CSP headers out of the box." },
  { icon: "palette", title: "Beautiful UI", description: "Material Design 3 inspired components with HCT color system and dark mode." },
  { icon: "puzzle", title: "50+ Components", description: "Forms, tables, dialogs, navigation — everything you need to build a SaaS." },
  { icon: "device-desktop", title: "Admin Dashboard", description: "Ready-to-use admin shell with sidebar, header, and responsive layout." },
  { icon: "code", title: "Developer First", description: "TypeScript, Deno/Bun, Hono — modern stack with great DX." },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for side projects",
    features: ["3 projects", "1,000 users", "Community support", "Basic analytics"],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing businesses",
    features: ["Unlimited projects", "10,000 users", "Priority support", "Advanced analytics", "Custom domain", "API access"],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: ["Unlimited everything", "SSO / SAML", "Dedicated support", "SLA guarantee", "Custom integrations", "On-premise option"],
  },
];

export function LandingPage() {
  return (
    <>
      <LandingHeader
        brand="My SaaS"
        navLinks={NAV_LINKS}
        themeToggle={<ThemeToggle compact />}
      />

      <LandingHero
        badge="Now in Beta"
        headline="Build your SaaS faster"
        subhead="Pre-built components, admin dashboard, auth, and everything you need — so you can focus on what matters."
        actions={
          <>
            <Link href="/signup"><Button variant="filled">Get Started Free</Button></Link>
            <Link href="#features"><Button variant="outlined">Learn More</Button></Link>
          </>
        }
      />

      <div id="features">
        <LandingFeatures
          features={FEATURES.map(f => ({
            ...f,
            icon: (<Icon name={f.icon} size={24} /> as any),
          }))}
        />
      </div>

      <div id="pricing">
        <LandingSection title="Pricing" subtitle="Simple, transparent pricing for every stage.">
          <div class="ii-pricing-grid">
            {PLANS.map(plan => (
              <PricingCard
                key={plan.name}
                {...plan}
                onCtaClick={() => window.location.href = "/signup"}
              />
            ))}
          </div>
        </LandingSection>
      </div>

      <LandingFooter>
        <div class="ii-lp-footer__row">
          <span>&copy; {new Date().getFullYear()} My SaaS. All rights reserved.</span>
          <nav class="ii-lp-footer__nav">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
        </div>
      </LandingFooter>
    </>
  );
}
