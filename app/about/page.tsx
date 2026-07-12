import type { Metadata } from 'next'
import Link from 'next/link'
import StaticPageShell from '@/app/_components/static-page-shell'

export const metadata: Metadata = {
  title: 'About | The One Million Miles Challenge',
  description:
    'The story behind The One Million Miles Challenge: staff from the Royal Brompton and Evelina London Paediatric Intensive Care Units raising funds for Evelina London Children’s Intensive Care Unit and the South Thames Retrieval Service.',
}

export default function AboutPage() {
  return (
    <StaticPageShell title="About The One Million Miles Challenge">
      <p style={{ marginBottom: 16 }}>
        We are a newly united team. Staff from the Royal Brompton Paediatric Intensive Care Unit
        and Evelina London Paediatric Intensive Care Unit have come together on one site to
        provide the highest quality care for the babies, children and young people who require
        intensive care. We are celebrating this with an ambitious charity fundraising challenge:
        the One Million Miles Challenge, run under the campaign name &quot;One Million, One Team&quot;.
      </p>
      <p style={{ marginBottom: 16 }}>
        Our aim is to walk, run, cycle, row, ski, kayak, or cover distance by any self-propelled
        means, adding up to one million miles between June 2026 and June 2027. Our fundraising
        goal is a million pounds, to match the million miles we will cover.
      </p>

      <h2 style={{ fontSize: 18, marginTop: 28, marginBottom: 12, color: '#fff', fontFamily: 'var(--font-bebas-neue), sans-serif', letterSpacing: 1 }}>
        Who it supports
      </h2>
      <p style={{ marginBottom: 12 }}>
        We are raising funds for two causes close to our unit:
      </p>
      <ul style={{ marginBottom: 16, paddingLeft: 20 }}>
        <li style={{ marginBottom: 8 }}>
          <strong>South Thames Retrieval Service (STRS)</strong>, the specialist intensive care
          team that transports critically ill babies and children from local hospitals to
          paediatric intensive care units by ambulance, helicopter, or plane. STRS operates out of
          the Paediatric Intensive Care Unit at Evelina London Children&apos;s Hospital.
        </li>
        <li style={{ marginBottom: 8 }}>
          <strong>Families of children admitted to our children&apos;s intensive care unit</strong>,
          many of whom arrive without even basic essentials.
        </li>
      </ul>
      <p style={{ marginBottom: 16 }}>
        The campaign is run in partnership with Evelina London Children&apos;s Charity
        (RCN 1160316-8), an ever-growing family of people passionate about supporting the
        everyday, incredible care given at Evelina London Children&apos;s Hospital. Find out more
        at{' '}
        <a
          href="https://www.evelinacharity.org.uk"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#00aaff', textDecoration: 'underline' }}
        >
          evelinacharity.org.uk
        </a>
        .
      </p>

      <h2 style={{ fontSize: 18, marginTop: 28, marginBottom: 12, color: '#fff', fontFamily: 'var(--font-bebas-neue), sans-serif', letterSpacing: 1 }}>
        How it works
      </h2>
      <ul style={{ marginBottom: 16, paddingLeft: 20 }}>
        <li style={{ marginBottom: 8 }}>Sign in with Google and complete a short profile.</li>
        <li style={{ marginBottom: 8 }}>
          Log an activity (running, cycling, walking, swimming, rowing, or any other self-propelled
          means) with the distance covered.
        </li>
        <li style={{ marginBottom: 8 }}>Optionally attach a screenshot from Strava, Garmin, or another tracker as proof.</li>
        <li style={{ marginBottom: 8 }}>Your miles are added to the live total, the leaderboard, and the individual rankings.</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 28, marginBottom: 12, color: '#fff', fontFamily: 'var(--font-bebas-neue), sans-serif', letterSpacing: 1 }}>
        Get involved
      </h2>
      <p style={{ marginBottom: 0 }}>
        Head back to the{' '}
        <Link href="/" style={{ color: '#00aaff', textDecoration: 'underline' }}>dashboard</Link> to
        sign in and log your first activity, or{' '}
        <a
          href="https://www.justgiving.com/page/onemillion-oneteam?utm_medium=FR&utm_source=CL"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#00aaff', textDecoration: 'underline' }}
        >
          donate via JustGiving
        </a>{' '}
        to support the South Thames Retrieval Service and the families we care for directly.
      </p>
    </StaticPageShell>
  )
}
