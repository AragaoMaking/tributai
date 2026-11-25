import Dashboard from "../dashboard";

export const instant = false;

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return <Dashboard slug={section || "visao-geral"} />;
}
