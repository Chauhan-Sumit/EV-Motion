import { notFound, redirect } from "next/navigation";

/**
 * Review entry point for the showroom Compare page: opens the four-car
 * comparison the approved design was drawn around. Deleted with the rest of
 * `app/prototype/compare/` on integration.
 */
export default function ShowroomCompareEntry() {
  if (process.env.VERCEL_ENV === "production") notFound();
  redirect("/prototype/compare/mg-windsor-ev-vs-tata-nexon-ev-vs-tata-curvv-ev-vs-hyundai-creta-electric");
}
