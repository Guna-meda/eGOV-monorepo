import type { ActionFunctionArgs } from "react-router";

export async function grievanceAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const BASE = import.meta.env.VITE_API_HOST ?? "localhost";
  const PORT = import.meta.env.VITE_API_PORT ?? "5001";
  const data = Object.fromEntries(formData.entries());

  console.log("The form data inside action: ", data)
  const res = await fetch(`http://${BASE}:${PORT}/api/v1/complaints`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(data),
  });

  if (!res.ok) return { ok: false, message: await res.text() };
  return { ok: true };
}