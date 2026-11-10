import { ResourceFormPage } from "../form-page";

export default async function EditResourcePage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  return <ResourceFormPage resourceKey={resource} id={id} />;
}
