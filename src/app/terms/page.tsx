import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalList } from "@/components/legal/LegalPage";
import { LEGAL_ENTITY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms on which you may use EV Motion, what the information on the site is and is not, and the limits of what we can be held to.",
  alternates: { canonical: "/terms" },
};

/**
 * Section 3 is the one that matters and is deliberately specific: it states
 * exactly how this dataset behaves, which is unusual for a marketplace and is
 * a real property of the codebase (CLAUDE.md #22 — a specification is either
 * sourced or renders as "Not specified", never a formula). Keep it truthful:
 * if the data-honesty rules ever change, this section changes with them.
 */
export default function TermsOfUsePage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="These terms cover your use of EV Motion. The important part is section 3: what the information on this site is, how it is produced, and what you should not rely on it for."
    >
      <LegalSection id="acceptance" heading="1. Accepting these terms">
        <p>
          By using EV Motion you agree to these terms. If you do not agree with them, please do not use the site. We may
          update these terms from time to time; the “last updated” date at the top tells you when we last did.
        </p>
      </LegalSection>

      <LegalSection id="what-this-is" heading="2. What this site is">
        <p>
          EV Motion is an information and comparison service for electric vehicles sold in India. We publish
          specifications, indicative prices and comparison tools to help you research a purchase.
        </p>
        <p>
          <strong className="font-semibold text-ink">We do not sell vehicles.</strong> We are not a dealer, a broker or
          an agent of any manufacturer. Nothing on this site is an offer to sell, and no contract to buy a vehicle can
          be formed here. Any purchase is between you and a dealer or manufacturer, on their terms.
        </p>
      </LegalSection>

      <LegalSection id="accuracy" heading="3. About the information on this site">
        <p>
          We take accuracy seriously and have built the site around a simple rule:{" "}
          <strong className="font-semibold text-ink">
            a specification is either real, sourced data or it is shown as “Not specified” — we never fill a gap with an
            estimate and present it as fact.
          </strong>{" "}
          That said, please read the following, because it explains what you are actually looking at.
        </p>
        <LegalList
          items={[
            <>
              <strong className="font-semibold text-ink">Prices are indicative estimates, not quotations.</strong>{" "}
              On-road prices are calculated from a manufacturer’s ex-showroom price plus modelled registration, road
              tax, insurance and subsidy figures for the state you select. Real on-road prices vary by dealer, variant,
              date and offer. <strong className="font-semibold text-ink">Always confirm the price with a dealer.</strong>
            </>,
            <>
              <strong className="font-semibold text-ink">EMI and running-cost figures are calculators</strong>, not
              finance offers. They show what you asked them to compute from the assumptions displayed beside them, and
              no lender is bound by them.
            </>,
            <>
              <strong className="font-semibold text-ink">Range figures are manufacturer claims</strong>, usually
              measured under a standard test cycle. Real-world range is typically lower and depends on how, where and
              in what conditions you ride or drive. Where we show an estimated real-world figure, we show the
              assumption we derated it by.
            </>,
            <>
              <strong className="font-semibold text-ink">Safety ratings are historical records of a specific test.</strong>{" "}
              We show the testing body and the year. Euro NCAP and ANCAP results lapse six years after publication, and
              where that has happened we label the rating as expired rather than removing it. A rating always applies to
              the exact vehicle structure that was tested, which is not always the variant sold in India.
            </>,
            <>
              <strong className="font-semibold text-ink">The vehicle artwork is not photography.</strong> Where we do not
              have a licensed photograph, we show a generic illustration of the vehicle’s body type — one drawing shared
              by every SUV, every hatchback and so on. It is category artwork and is labelled as such. It does not depict
              the specific vehicle beside it, and you should not judge a vehicle’s appearance, colour or trim from it.
            </>,
            <>
              <strong className="font-semibold text-ink">Some vehicles are no longer sold.</strong> Where we keep a page
              for a discontinued model, it is marked “Discontinued”. It is there for reference, not as something you can
              buy.
            </>,
            <>
              <strong className="font-semibold text-ink">Specifications can go out of date.</strong> Manufacturers revise
              models without notice. We correct what we find, but the manufacturer’s own current documentation is always
              the authority.
            </>,
          ]}
        />
        <p>
          If you spot something wrong, please tell us at {LEGAL_ENTITY.email} — corrections from readers are genuinely
          useful and we act on them.
        </p>
      </LegalSection>

      <LegalSection id="enquiries" heading="4. Enquiries you submit">
        <p>
          When you submit an enquiry, you are asking us to pass your details to a dealer, brand or partner so they can
          contact you. By submitting it you confirm the details are yours and are accurate, and you consent to being
          contacted about that enquiry.
        </p>
        <p>
          We do not control what a dealer or brand does once they have your enquiry, what they offer you, or whether
          they respond at all. How we handle your details on our side is set out in our{" "}
          <Link href="/privacy" className="focus-ring font-semibold text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection id="no-warranty" heading="5. No warranty">
        <p>
          The site is provided “as is” and “as available”. To the extent the law allows, we make no warranty that it
          will be uninterrupted, error-free, or that any particular information on it is complete, current or fit for a
          particular purpose. Sections 3 and 6 should be read together: this is a research tool, and the decision to buy
          a vehicle should rest on the manufacturer’s and dealer’s own documentation.
        </p>
      </LegalSection>

      <LegalSection id="liability" heading="6. Limits on our liability">
        <p>
          To the extent permitted by law, we are not liable for any indirect or consequential loss, or for loss of
          profit, revenue or opportunity, arising from your use of the site or from reliance on information published on
          it — including any difference between a price, specification or rating shown here and the one you are actually
          offered.
        </p>
        <p>Nothing in these terms limits any liability that cannot lawfully be limited.</p>
      </LegalSection>

      <LegalSection id="ip" heading="7. Intellectual property and trademarks">
        <p>
          The design, text, comparison tools and original artwork on this site belong to us or our licensors. You may
          read, print and share pages for your own non-commercial research. You may not copy the catalogue, scrape the
          site in bulk, or republish our content commercially without written permission.
        </p>
        <p>
          <strong className="font-semibold text-ink">
            All manufacturer names, model names and logos belong to their respective owners.
          </strong>{" "}
          They are used here for identification and comparison only. We are not affiliated with, endorsed by, or an
          authorised representative of any manufacturer.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" heading="8. Acceptable use">
        <p>Please do not:</p>
        <LegalList
          items={[
            "Submit false or someone else’s contact details through an enquiry form",
            "Scrape, crawl or bulk-download the catalogue, or try to reconstruct our database",
            "Attempt to disrupt the site, probe it for vulnerabilities, or bypass its rate limits",
            "Use the site for anything unlawful, or in a way that infringes someone else’s rights",
          ]}
        />
        <p>We may restrict access where we reasonably believe any of the above is happening.</p>
      </LegalSection>

      <LegalSection id="third-party" heading="9. Links to other sites">
        <p>
          The site links to manufacturer and dealer websites we do not control. We are not responsible for their
          content, their accuracy or their privacy practices, and a link is not an endorsement.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" heading="10. Governing law">
        <p>
          These terms are governed by the laws of India, and the courts at {LEGAL_ENTITY.jurisdiction} have exclusive
          jurisdiction over any dispute arising from them or from your use of the site.
        </p>
      </LegalSection>

      <LegalSection id="contact" heading="11. Contact us">
        <p>
          Questions about these terms: {LEGAL_ENTITY.email}, or write to {LEGAL_ENTITY.name} at {LEGAL_ENTITY.address}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
