import type { Metadata } from 'next'
import StaticPageShell from '@/app/_components/static-page-shell'

export const metadata: Metadata = {
  title: 'Terms of Service | The One Million Miles Challenge',
  description: 'The terms that govern use of the One Million Miles Challenge application.',
}

export default function TermsPage() {
  return (
    <StaticPageShell title="Terms of Service">
      <p style={{ marginBottom: 16 }}>
        <strong>Last updated: May 28, 2026</strong>
      </p>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>1. Acceptance of Terms</h3>
      <p style={{ marginBottom: 12 }}>
        By accessing or using the One Million Miles Challenge application (&quot;the App&quot;),
        you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree
        to these Terms, please do not use the App.
      </p>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>2. Description of Service</h3>
      <p style={{ marginBottom: 12 }}>
        The One Million Miles Challenge is a fitness tracking application that allows users to
        log miles walked, run, cycled, or swum in support of Evelina London Children&apos;s
        Hospital. The app features a public leaderboard, activity submission, and optional
        proof verification.
      </p>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>3. User Accounts</h3>
      <p style={{ marginBottom: 12 }}>
        You may sign in using your Google account. You are responsible for maintaining the
        confidentiality of your account credentials and for all activities that occur under
        your account. You agree to provide accurate and complete information when creating
        your profile.
      </p>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>4. User Conduct</h3>
      <p style={{ marginBottom: 12 }}>You agree not to:</p>
      <ul style={{ marginBottom: 12, paddingLeft: 20 }}>
        <li style={{ marginBottom: 8 }}>Submit false, misleading, or fraudulent mileage or activity data</li>
        <li style={{ marginBottom: 8 }}>
          Attempt to gain unauthorized access to the App, its systems, or other users&apos;
          accounts
        </li>
        <li style={{ marginBottom: 8 }}>Use the App for any illegal purpose or in violation of any laws</li>
        <li style={{ marginBottom: 8 }}>Interfere with or disrupt the App&apos;s integrity or performance</li>
        <li style={{ marginBottom: 8 }}>Transmit any viruses, malware, or harmful code</li>
        <li style={{ marginBottom: 8 }}>Harass, threaten, or harm other users</li>
      </ul>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>5. Submissions and Content</h3>
      <p style={{ marginBottom: 12 }}>
        By submitting mileage data, activity descriptions, or screenshot proofs, you represent
        that:
      </p>
      <ul style={{ marginBottom: 12, paddingLeft: 20 }}>
        <li style={{ marginBottom: 8 }}>
          You have the right to submit such content and it does not violate any third-party
          rights
        </li>
        <li style={{ marginBottom: 8 }}>The information is accurate and truthful</li>
        <li style={{ marginBottom: 8 }}>
          You grant us a non-exclusive, royalty-free license to use, display, and distribute
          your submissions on the App and public leaderboards
        </li>
      </ul>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>6. Intellectual Property</h3>
      <p style={{ marginBottom: 12 }}>
        The App, including its code, design, logos, and content, is owned by or licensed to
        the One Million Miles Challenge and is protected by copyright and intellectual
        property laws. You may not copy, modify, distribute, or create derivative works
        without explicit permission.
      </p>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>7. Donations and Fundraising</h3>
      <p style={{ marginBottom: 12 }}>
        The App includes links to JustGiving for donations to Evelina London Children&apos;s
        Hospital. Donations are processed directly through JustGiving and are subject to
        their terms and conditions. The One Million Miles Challenge is not responsible for
        donation processing or disbursement.
      </p>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>8. Disclaimers</h3>
      <p style={{ marginBottom: 12 }}>
        The App is provided &quot;as is&quot; and &quot;as available&quot; without warranties
        of any kind, express or implied. We do not guarantee:
      </p>
      <ul style={{ marginBottom: 12, paddingLeft: 20 }}>
        <li style={{ marginBottom: 8 }}>Uninterrupted or error-free operation of the App</li>
        <li style={{ marginBottom: 8 }}>Accuracy of displayed data or calculations</li>
        <li style={{ marginBottom: 8 }}>That the app will meet your requirements or expectations</li>
      </ul>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>9. Limitation of Liability</h3>
      <p style={{ marginBottom: 12 }}>
        To the maximum extent permitted by law, the One Million Miles Challenge, its
        developers, and service providers shall not be liable for any indirect, incidental,
        special, consequential, or punitive damages, or any loss of profits or revenues,
        whether incurred directly or indirectly, or any loss of data, use, goodwill, or
        other intangible losses.
      </p>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>10. Third-Party Services</h3>
      <p style={{ marginBottom: 12 }}>
        The App uses third-party services including Supabase for database and authentication,
        Google for OAuth sign-in, and JustGiving for donations. These services are subject
        to their own terms of service and privacy policies.
      </p>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>11. Term and Termination</h3>
      <p style={{ marginBottom: 12 }}>
        These Terms are effective until terminated. We may suspend or terminate your access
        to the App at any time, for any or no reason, with or without notice. Your
        submissions on public leaderboards may remain visible even after termination.
      </p>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>12. Changes to Terms</h3>
      <p style={{ marginBottom: 12 }}>
        We reserve the right to modify these Terms at any time. Continued use of the App
        after changes constitutes acceptance of the new Terms. We will notify users of
        material changes through the App.
      </p>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>13. Governing Law</h3>
      <p style={{ marginBottom: 12 }}>
        These Terms shall be governed by and construed in accordance with the laws of
        England and Wales, without regard to its conflict of law provisions. Any disputes
        shall be subject to the exclusive jurisdiction of the courts of England and Wales.
      </p>

      <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>14. Contact Information</h3>
      <p style={{ marginBottom: 12 }}>
        If you have any questions about these Terms, please contact us at:
        <br />
        <a href="mailto:kai.fs1996@gmail.com" style={{ color: '#00aaff', textDecoration: 'underline' }}>
          kai.fs1996@gmail.com
        </a>
      </p>

      <p style={{ marginTop: 32, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
        By using the One Million Miles Challenge App, you acknowledge that you have read,
        understood, and agree to be bound by these Terms of Service.
      </p>
    </StaticPageShell>
  )
}
