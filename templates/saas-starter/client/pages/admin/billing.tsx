import { PricingCard, Badge, Button } from "@kotsumo/in-it/components";
import { Icon } from "@kotsumo/in-it/icons";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["3 projects", "1,000 users", "Community support"],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    features: ["Unlimited projects", "10,000 users", "Priority support", "Advanced analytics"],
    highlighted: true,
    badge: "Current Plan",
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited everything", "SSO / SAML", "Dedicated support", "SLA guarantee"],
  },
];

const INVOICES = [
  { id: "INV-001", date: "2024-06-01", amount: "$29.00", status: "Paid" },
  { id: "INV-002", date: "2024-05-01", amount: "$29.00", status: "Paid" },
  { id: "INV-003", date: "2024-04-01", amount: "$29.00", status: "Paid" },
];

export function BillingPage() {
  return (
    <>
      <h2 style={{ margin: "0 0 8px", fontSize: "1.25rem", fontWeight: 600 }}>Billing</h2>
      <p style={{ margin: "0 0 24px", color: "var(--ii-on-surface-variant)" }}>Manage your plan and payment method.</p>

      {/* Current Plan */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>Change Plan</h3>
        <div class="ii-pricing-grid">
          {PLANS.map(plan => (
            <PricingCard
              key={plan.name}
              {...plan}
              cta={plan.highlighted ? "Current Plan" : "Switch"}
            />
          ))}
        </div>
      </div>

      {/* Invoices */}
      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>Invoice History</h3>
      <table class="ii-data-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {INVOICES.map(inv => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.date}</td>
              <td>{inv.amount}</td>
              <td><Badge variant="success">{inv.status}</Badge></td>
              <td>
                <Button variant="text">
                  <Icon name="download" size={16} /> Download
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
