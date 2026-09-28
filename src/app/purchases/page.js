import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PurchasesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      amount,
      status,
      created_at,
      resources (
        title,
        slug,
        category,
        cover_image_url
      )
    `)
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Purchases error:", error.message);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold">
        My Purchases
      </h1>

      <p className="mt-2 text-gray-600">
        View the educational resources you have purchased.
      </p>

      {!orders?.length ? (
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold">
            No purchases yet
          </h2>

          <p className="mt-2 text-gray-600">
            Resources you purchase will appear here.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Explore Resources
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <p className="text-sm font-semibold text-gray-600">
                {order.resources?.category}
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                {order.resources?.title}
              </h2>

              <p className="mt-2 text-gray-600">
                Amount: ₹{order.amount}
              </p>

              <p className="mt-1 text-sm capitalize text-gray-500">
                Status: {order.status}
              </p>

              <Link
                href={`/resources/${order.resources?.slug}`}
                className="mt-5 inline-block font-semibold hover:underline"
              >
                View Resource →
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}