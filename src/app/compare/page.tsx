import type { Metadata } from "next";
import { CompareBoard } from "@/components/vehicles/CompareBoard";

export const metadata: Metadata = {
  title: "Compare Electric Vehicles Side by Side",
  description: "Compare up to 4 electric cars or two-wheelers side by side — price, range, battery, charging speed and more.",
  alternates: { canonical: "/compare" },
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const idsParam = typeof params.ids === "string" ? params.ids : "";
  const initialSlugs = idsParam ? idsParam.split(",") : [];

  return <CompareBoard initialSlugs={initialSlugs} />;
}
