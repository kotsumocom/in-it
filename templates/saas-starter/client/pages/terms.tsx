export function TermsPage() {
  return (
    <div class="ii-legal-page">
      <h1>Terms of Service</h1>
      <p class="ii-legal-page__date">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using this service ("Service"), you accept and agree to be bound by
        the terms and provision of this agreement.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        The Service provides [describe your service]. We reserve the right to modify or
        discontinue the Service at any time without notice.
      </p>

      <h2>3. User Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials
        and for all activities that occur under your account.
      </p>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose</li>
        <li>Attempt to gain unauthorized access to the Service</li>
        <li>Interfere with or disrupt the Service</li>
        <li>Upload malicious code or content</li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>
        The Service and its original content are owned by [Your Company] and are protected by
        international copyright, trademark, and other intellectual property laws.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        In no event shall [Your Company] be liable for any indirect, incidental, special,
        consequential, or punitive damages.
      </p>

      <h2>7. Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. We will provide notice of
        significant changes by posting the new terms on this page.
      </p>

      <h2>8. Contact</h2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a href="mailto:support@example.com">support@example.com</a>.
      </p>
    </div>
  );
}
