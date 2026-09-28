import { Image as IkImage } from "@imagekit/next";
import { Armchair, Boxes, Cog, MoveHorizontal, Plug, Ruler, Wifi } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Band, Container, Kicker, SectionHead } from "./Shell";
import { IMAGEKIT_CONFIGURED } from "@/lib/imagekit";
import { illustrationFor } from "@/lib/vehicle-illustrations";
import { demoStoryPoints } from "./demo-content";

/**
 * MOCKUP overview / story band.
 *
 * Two ideas the production Overview card does not have: an editorial lead
 * paragraph set at a readable size instead of 12px, and a *proportions*
 * diagram — the dimension figures drawn as measurement callouts around the
 * vehicle rather than listed as a four-row table. Dimensions are the one spec
 * group that is genuinely spatial, so drawing them is more legible than
 * tabulating them.
 */
export function MockStory({ vehicle }: { vehicle: VehicleDetail }) {
  const dims = vehicle.sourceVehicle.specs?.dimensions;
  const body = vehicle.bodySpecs;
  const illustration = IMAGEKIT_CONFIGURED
    ? illustrationFor({ category: vehicle.category, bodyType: vehicle.sourceVehicle.bodyType })
    : undefined;

  const atAGlance = [
    { icon: Boxes, label: "Body type", value: body.bodyType },
    body.seatingCapacity && { icon: Armchair, label: "Seating", value: body.seatingCapacity },
    body.driveType && { icon: Cog, label: "Drivetrain", value: body.driveType },
    body.bootSpaceLiters !== undefined && {
      icon: Boxes,
      label: "Boot space",
      value: `${body.bootSpaceLiters} litres`,
    },
    vehicle.charging.connectorType && {
      icon: Plug,
      label: "Charging port",
      value: vehicle.charging.connectorType,
    },
    body.connectedCar !== undefined && {
      icon: Wifi,
      label: "Connected car",
      value: body.connectedCar ? "Yes" : "No",
    },
  ].filter((r): r is { icon: typeof Boxes; label: string; value: string } => Boolean(r));

  return (
    <Band id="story" tone="light">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          {/* ---- Editorial column ---- */}
          <div className="min-w-0">
            <SectionHead
              eyebrow="The overview"
              title={vehicle.sourceVehicle.tagline}
              className="mb-6 sm:mb-7"
            />

            <p className="max-w-2xl text-[15px] leading-[1.75] text-ink-secondary sm:text-base">
              {vehicle.overview}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {demoStoryPoints.map((point) => (
                <div key={point.id} className="border-l-2 border-primary/25 pl-4">
                  <Kicker className="mb-1.5 text-primary">{point.kicker}</Kicker>
                  <p className="text-[14px] font-bold leading-snug tracking-tight text-ink">{point.title}</p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-ink-secondary">{point.body}</p>
                </div>
              ))}
            </div>

            {/* ---- Proportions diagram ---- */}
            {dims ? (
              <div className="mt-9 rounded-2xl border border-border bg-surface-secondary p-5 sm:p-7">
                <div className="mb-5 flex items-center gap-2">
                  <Ruler size={15} className="text-primary" />
                  <Kicker>Proportions</Kicker>
                </div>

                <div className="flex gap-4 sm:gap-6">
                  {/* Height gutter */}
                  {dims.heightMm !== undefined ? (
                    <div className="flex w-11 shrink-0 flex-col items-center justify-center sm:w-14">
                      <span className="h-1.5 w-4 border-t border-border-strong" aria-hidden="true" />
                      <span className="w-px flex-1 bg-border-strong" aria-hidden="true" />
                      <span className="my-1 whitespace-nowrap text-[10px] font-bold tabular-nums text-ink-secondary">
                        {dims.heightMm}
                      </span>
                      <span className="w-px flex-1 bg-border-strong" aria-hidden="true" />
                      <span className="h-1.5 w-4 border-b border-border-strong" aria-hidden="true" />
                    </div>
                  ) : null}

                  <div className="min-w-0 flex-1">
                    <div className="relative aspect-[16/7] w-full">
                      {illustration ? (
                        <IkImage
                          src={illustration.path}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 40vw, 90vw"
                          className="object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border-strong text-[11px] text-ink-muted">
                          Vehicle illustration unavailable
                        </div>
                      )}
                      {/* Wheelbase span, drawn under the body */}
                      {dims.wheelbaseMm !== undefined ? (
                        <div className="absolute inset-x-[18%] bottom-[6%] flex items-center gap-1.5">
                          <span className="h-2 w-px bg-primary" aria-hidden="true" />
                          <span className="h-px flex-1 bg-primary/50" aria-hidden="true" />
                          <span className="whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold tabular-nums text-white">
                            {dims.wheelbaseMm} mm
                          </span>
                          <span className="h-px flex-1 bg-primary/50" aria-hidden="true" />
                          <span className="h-2 w-px bg-primary" aria-hidden="true" />
                        </div>
                      ) : null}
                    </div>

                    {/* Length span */}
                    {dims.lengthMm !== undefined ? (
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="h-2.5 w-px bg-border-strong" aria-hidden="true" />
                        <span className="h-px flex-1 bg-border-strong" aria-hidden="true" />
                        <span className="whitespace-nowrap text-[10px] font-bold tabular-nums text-ink-secondary">
                          {dims.lengthMm} mm
                        </span>
                        <span className="h-px flex-1 bg-border-strong" aria-hidden="true" />
                        <span className="h-2.5 w-px bg-border-strong" aria-hidden="true" />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-5 sm:grid-cols-4">
                  {[
                    dims.widthMm !== undefined && { label: "Width", value: `${dims.widthMm} mm` },
                    dims.groundClearanceMm !== undefined && {
                      label: "Ground clearance",
                      value: `${dims.groundClearanceMm} mm`,
                    },
                    dims.bootSpaceLiters !== undefined && {
                      label: "Boot",
                      value: `${dims.bootSpaceLiters} L`,
                    },
                    dims.kerbWeightKg !== undefined && {
                      label: "Kerb weight",
                      value: `${dims.kerbWeightKg} kg`,
                    },
                  ]
                    .filter((d): d is { label: string; value: string } => Boolean(d))
                    .map((d) => (
                      <div key={d.label}>
                        <Kicker className="mb-1">{d.label}</Kicker>
                        <p className="text-[13px] font-bold tabular-nums text-ink">{d.value}</p>
                      </div>
                    ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* ---- At-a-glance rail ---- */}
          <aside className="min-w-0">
            <div className="lg:sticky lg:top-[132px]">
              <div className="overflow-hidden rounded-2xl border border-border">
                <div className="flex items-center gap-2 border-b border-border bg-surface-secondary px-5 py-3.5">
                  <MoveHorizontal size={14} className="text-primary" />
                  <p className="text-[12px] font-extrabold tracking-tight text-ink">At a glance</p>
                </div>
                <dl className="divide-y divide-border">
                  {atAGlance.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between gap-3 px-5 py-3.5">
                      <dt className="flex items-center gap-2.5 text-[12px] text-ink-secondary">
                        <Icon size={14} className="shrink-0 text-ink-muted" />
                        {label}
                      </dt>
                      <dd className="text-right text-[12px] font-bold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Safety callout */}
              {vehicle.sourceVehicle.specs?.safety?.ncapRating !== undefined ? (
                <div className="mt-4 flex items-center gap-4 rounded-2xl bg-surface-dark p-5">
                  <div className="shrink-0">
                    <p className="text-[34px] font-extrabold leading-none tracking-[-0.03em] text-primary-bright">
                      {vehicle.sourceVehicle.specs.safety.ncapRating}
                      <span className="text-[16px] text-white/40">★</span>
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold leading-tight text-white">
                      {vehicle.sourceVehicle.specs.safety.ncapAgency ?? "Crash"} rating
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/45">
                      {vehicle.sourceVehicle.specs.safety.airbagsCount !== undefined
                        ? `${vehicle.sourceVehicle.specs.safety.airbagsCount} airbags`
                        : "Airbag count not specified"}
                      {vehicle.sourceVehicle.specs.safety.adas ? " · Level 2 ADAS" : ""}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </Container>
    </Band>
  );
}
