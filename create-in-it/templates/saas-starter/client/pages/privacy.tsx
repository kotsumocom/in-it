export function PrivacyPage() {
  return (
    <div class="ii-legal-page">
      <h1>Privacy Policy</h1>
      <p class="ii-legal-page__date">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us, such as:</p>
      <ul>
        <li>Account information (name, email, password)</li>
        <li>Profile information</li>
        <li>Payment information (processed by our payment provider)</li>
        <li>Communications you send to us</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve the Service</li>
        <li>Process transactions and send related information</li>
        <li>Send technical notices and support messages</li>
        <li>Respond to your comments and questions</li>
      </ul>

      <h2>3. Information Sharing</h2>
      <p>We do not sell or rent your personal information to third parties.</p>
      <ul>
        <li>With your consent</li>
        <li>With service providers who assist in operating our Service</li>
        <li>To comply with legal obligations</li>
        <li>To protect our rights and safety</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>
        We take reasonable measures to protect your personal information from unauthorized
        access, alteration, disclosure, or destruction.
      </p>

      <h2>5. Cookies</h2>
      <p>
        We use cookies and similar tracking technologies. You can control cookies through
        your browser settings.
      </p>

      <h2>6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Object to processing of your data</li>
        <li>Export your data</li>
      </ul>

      <h2>7. Contact</h2>
      <p>
        For any privacy-related questions, please contact us at{" "}
        <a href="mailto:privacy@example.com">privacy@example.com</a>.
      </p>
    </div>
  );
}
