import { ResourceFormPage } from "../form-page";

export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  return <ResourceFormPage resourceKey={resource} id={null} />;
}
