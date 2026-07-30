import { CompareBoard } from "@/components/vehicles/CompareBoard";

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
