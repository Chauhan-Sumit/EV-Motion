import { Container } from "@/components/ui/Container";
import { advertPlans } from "@/lib/data/ev-motion/content";
import { LeadCaptureDialog } from "@/components/common/LeadCaptureDialog";

export function AdvertiseSection() {
  return (
    <section className="bg-primary-tint py-8" aria-labelledby="advertise-heading">
      <Container>
        <div className="mb-5">
          <span className="mb-2 inline-block rounded bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            For Dealers &amp; Brands
          </span>
          <h2 id="advertise-heading" className="text-xl font-extrabold text-ink">
            Advertise on EV Motion
          </h2>
          <p className="mt-1 text-[13px] text-ink-secondary">
            Reach millions of EV-intent buyers every month across India.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {advertPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl bg-surface p-4 text-center ${
                plan.featured ? "border border-primary" : "border border-transparent"
              }`}
            >
              {plan.featured ? (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[9px] font-bold text-white">
                  MOST POPULAR
                </span>
              ) : null}
              <p className="text-[13px] font-bold text-primary">{plan.name}</p>
              <p className="mt-1.5 text-2xl font-extrabold text-ink">{plan.priceLabel}</p>
              <p className="text-[11px] text-ink-muted">{plan.unitLabel}</p>
              <div className="my-3 border-t border-border" />
              <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-left">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-1.5 text-[11px] text-ink-secondary">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-center">
          <LeadCaptureDialog
            kind="advertise"
            triggerLabel="Get Advertiser Kit ›"
            triggerClassName="focus-ring rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
            dialogTitle="Get the advertiser kit"
            dialogDescription="Tell us where to send pricing, audience data, and creative specs for advertising on EV Motion."
            fields={[
              { key: "name", label: "Your name", type: "text", placeholder: "Full name", validation: "required" },
              { key: "company", label: "Company", type: "text", placeholder: "Dealership or brand name", validation: "required" },
              { key: "email", label: "Work email", type: "email", placeholder: "you@company.com", validation: "email" },
            ]}
            submitLabel="Send Me the Kit"
            successTitle="Kit on its way"
            successDescription="Our advertising team will email the media kit and pricing shortly."
          />
        </div>
      </Container>
    </section>
  );
}
