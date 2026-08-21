import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalList } from "@/components/legal/LegalPage";
import { CLIENT_STORAGE_KEYS, LEGAL_ENTITY, SUB_PROCESSORS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What EV Motion collects when you use the site or submit an enquiry, why, who it is shared with, and the rights you have over it.",
  alternates: { canonical: "/privacy" },
};

/**
 * Written against what the code actually does, not from a template. Each
 * claim below is checkable:
 *  - collected enquiry fields: `LEAD_FIELD_KEYS` in src/lib/leads/types.ts
 *  - analytics event names and caps: src/lib/analytics/validation.ts
 *  - no cookies, no stored IP: src/app/api/events/route.ts, CLAUDE.md #25
 *  - client-side storage: CLIENT_STORAGE_KEYS in src/lib/legal.ts
 * If you change any of those, change this page in the same commit.
 */
export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={`This policy explains what EV Motion collects, why, who we share it with, and what you can ask us to do about it. We have tried to write it in plain language and to describe what the site actually does rather than what a policy template assumes it might do.`}
    >
      <LegalSection id="who-we-are" heading="1. Who we are">
        <p>
          EV Motion (“we”, “us”) is operated by {LEGAL_ENTITY.name}, {LEGAL_ENTITY.description}, at{" "}
          {LEGAL_ENTITY.address}. You can reach us at {LEGAL_ENTITY.email}.
        </p>
        <p>
          For the purposes of India’s Digital Personal Data Protection Act, 2023 (“DPDP Act”), we are the Data
          Fiduciary for the personal data described below.
        </p>
      </LegalSection>

      <LegalSection id="what-we-collect" heading="2. What we collect">
        <p>
          <strong className="font-semibold text-ink">Enquiry details you choose to give us.</strong> When you submit an
          enquiry — “Get Best Price”, “Book a Test Drive”, “Notify me at launch”, an advertising enquiry, or a general
          enquiry — we collect only the fields on that form:
        </p>
        <LegalList
          items={[
            "Your name",
            "Your mobile number and/or email address (at least one, so we can reply)",
            "Your message, if you write one",
            "Your company name, on advertising enquiries",
          ]}
        />
        <p>
          Alongside it we record which enquiry type you used, the vehicle the enquiry was about, the city selected on
          the site at the time, and the page you submitted from. That context exists so we can route your enquiry to
          someone who can actually answer it.
        </p>

        <p>
          <strong className="font-semibold text-ink">Usage analytics.</strong> We record a small, fixed set of events —
          a search, a vehicle page view, a comparison view, an enquiry submission, and site errors — together with the
          page path, a timestamp, and a random session ID. The session ID is held in your browser’s{" "}
          <code className="rounded bg-surface-secondary px-1 py-0.5 text-[12px]">sessionStorage</code> and is deleted
          when you close the tab, so it cannot recognise you on a later visit or follow you to another site.
        </p>
        <p>
          Analytics events carry no personal data by design. An enquiry-submission event records that an enquiry
          happened and which vehicle it concerned — never your name, number or email, which live only in the enquiry
          record described above.
        </p>

        <p>
          <strong className="font-semibold text-ink">Your IP address, transiently.</strong> Our servers see your IP
          address, as every web server does. We use it only to rate-limit abuse of the enquiry and analytics endpoints,
          and we do not store it.
        </p>
      </LegalSection>

      <LegalSection id="what-we-dont-do" heading="3. What we do not do">
        <LegalList
          items={[
            <>
              <strong className="font-semibold text-ink">We do not use cookies.</strong> The site sets none at all —
              which is also why you are not seeing a cookie banner.
            </>,
            <>
              <strong className="font-semibold text-ink">We do not track you across websites</strong>, and we run no
              third-party advertising or tracking scripts.
            </>,
            <>
              <strong className="font-semibold text-ink">We do not sell or rent your personal data</strong> to anyone.
            </>,
            <>
              <strong className="font-semibold text-ink">We do not build a profile of you.</strong> There is no durable
              identifier, so we cannot tell a returning visitor from a new one.
            </>,
            <>
              <strong className="font-semibold text-ink">We do not run automated decision-making</strong> on your data.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection id="stored-on-your-device" heading="4. What stays on your device">
        <p>
          Some things are saved in your browser so the site remembers your preferences. These are not cookies, are never
          sent to us, and you can clear them at any time through your browser’s “clear site data”.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[440px] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-3 font-bold text-ink">Stored item</th>
                <th scope="col" className="py-2 pr-3 font-bold text-ink">What it is for</th>
                <th scope="col" className="py-2 font-bold text-ink">How long</th>
              </tr>
            </thead>
            <tbody>
              {CLIENT_STORAGE_KEYS.map((row) => (
                <tr key={row.key} className="border-b border-border last:border-b-0">
                  <td className="py-2 pr-3 align-top">
                    <code className="rounded bg-surface-secondary px-1 py-0.5 text-[11.5px]">{row.key}</code>
                  </td>
                  <td className="py-2 pr-3 align-top">{row.purpose}</td>
                  <td className="py-2 align-top">{row.lifetime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection id="why" heading="5. Why we use it, and on what basis">
        <p>
          We use enquiry details to respond to your enquiry and to pass it to the relevant dealer, brand or partner
          where that is what you asked for. We use analytics to understand which vehicles and searches are popular, and
          to find pages that are broken or missing from our catalogue.
        </p>
        <p>
          Under the DPDP Act we process your enquiry details on the basis of the consent you give when you submit the
          form. You can withdraw that consent at any time (see section 8), though doing so may mean we can no longer
          act on an enquiry already in progress.
        </p>
      </LegalSection>

      <LegalSection id="sharing" heading="6. Who we share it with">
        <p>
          <strong className="font-semibold text-ink">Dealers, brands and partners</strong> — where you have submitted an
          enquiry, so that someone can respond to it. This is the purpose you gave the details for.
        </p>
        <p>
          <strong className="font-semibold text-ink">Service providers who process data on our behalf</strong>, under
          contract and only for the purposes above:
        </p>
        <LegalList items={SUB_PROCESSORS.map((p) => <><strong className="font-semibold text-ink">{p.name}</strong> — {p.role}</>)} />
        <p>
          These providers may store or process data on servers outside India. We may also disclose data where the law
          requires it, or to establish or defend a legal claim.
        </p>
      </LegalSection>

      <LegalSection id="retention-security" heading="7. How long we keep it, and how it is protected">
        <p>
          We keep enquiry details for as long as needed to deal with your enquiry and to meet our legal and accounting
          obligations, after which they are deleted. Analytics events are kept in aggregate form and carry nothing that
          identifies you.
        </p>
        <p>
          Enquiry records are held in a database that denies all public read access by default; they are reachable only
          by us through an authenticated administrative connection. Data reaches us over an encrypted connection. No
          system is perfectly secure, and we do not claim otherwise — but we do not collect more than we need, which is
          the most effective protection available.
        </p>
      </LegalSection>

      <LegalSection id="your-rights" heading="8. Your rights">
        <p>Under the DPDP Act you may ask us to:</p>
        <LegalList
          items={[
            "Tell you what personal data of yours we hold and who we have shared it with",
            "Correct or complete anything inaccurate",
            "Erase your personal data, where we are not required to keep it",
            "Withdraw a consent you previously gave",
            "Nominate someone to exercise these rights on your behalf if you die or become incapacitated",
          ]}
        />
        <p>
          Write to {LEGAL_ENTITY.email} and we will respond. There is no charge. If you are not satisfied with how we
          have handled a request, our Grievance Officer is {LEGAL_ENTITY.grievanceOfficerName}, reachable at{" "}
          {LEGAL_ENTITY.grievanceOfficerEmail}. You may also complain to the Data Protection Board of India.
        </p>
      </LegalSection>

      <LegalSection id="children" heading="9. Children">
        <p>
          The site is intended for adults researching vehicle purchases. We do not knowingly collect personal data from
          anyone under 18. If you believe a child has submitted details to us, write to {LEGAL_ENTITY.email} and we will
          delete them.
        </p>
      </LegalSection>

      <LegalSection id="changes" heading="10. Changes to this policy">
        <p>
          If we change what we collect or why, we will update this page and move the “last updated” date at the top.
          Where a change is significant we will say so prominently rather than relying on you to notice.
        </p>
      </LegalSection>

      <LegalSection id="contact" heading="11. Contact us">
        <p>
          Questions about this policy, or about anything on the site: {LEGAL_ENTITY.email}, or write to us at{" "}
          {LEGAL_ENTITY.address}. See also our <Link href="/terms" className="focus-ring font-semibold text-primary hover:underline">Terms of Use</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
