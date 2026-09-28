import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: resource } = await supabase
    .from("resources")
    .select(
      "title, description, category, cover_image_url"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!resource) {
    return {
      title: "Resource Not Found | ExamShelf",
      description:
        "The requested educational resource could not be found.",
    };
  }

  return {
    title: `${resource.title}`,

    description:
      resource.description ||
      `Explore ${resource.title} on ExamShelf.`,

    alternates: {
      canonical: `/resources/${resource.slug}`,
    },

    openGraph: {
      title: resource.title,

      description:
        resource.description ||
        `Explore ${resource.title} on ExamShelf.`,

      type: "website",

      images: resource.cover_image_url
        ? [
          {
            url: resource.cover_image_url,
            width: 1200,
            height: 675,
            alt: `Cover image for ${resource.title}`,
          },
        ]
        : [],
    },
  };
}

export default async function ResourcePage({ params }) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: resource, error } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!resource) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold">
          Resource Not Found
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8 overflow-hidden rounded-xl">
        <Image
          src={resource.cover_image_url}
          alt={`Cover image for ${resource.title}`}
          width={1200}
          height={675}
          className="h-auto w-full object-cover"
        />
      </div>

      <p className="text-sm font-semibold">
        {resource.category}
      </p>

      <h1 className="mt-3 text-4xl font-bold">
        {resource.title}
      </h1>

      {/* Description */}
      <p className="mt-6 text-lg text-gray-600">
        {resource.description}
      </p>

      {/* Price Section */}
      <div className="mt-8 flex items-center gap-3">
        {resource.original_price && (
          <span className="text-lg text-red-500 line-through">
            ₹{resource.original_price}
          </span>
        )}

        <span className="text-2xl font-bold">
          ₹{resource.price}
        </span>
      </div>
      <button className="mt-8 rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800">
        Get Resource
      </button>
    </main>
  );
}