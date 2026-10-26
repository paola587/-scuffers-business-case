export async function ejecutarSQL(consulta: string) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (!url || !key) {
    throw new Error("Faltan las credenciales de Supabase");
  }

  const respuesta = await fetch(
    `${url.replace(/\/$/, "")}/rest/v1/rpc/run_sql`,
    {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: consulta,
        quien: "Paola",
      }),
      cache: "no-store",
    }
  );

  if (!respuesta.ok) {
    throw new Error(
      `Error al consultar Supabase: ${respuesta.status}`
    );
  }

  return respuesta.json();
}