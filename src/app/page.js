import Link from "next/link";
import CategoryCard from "./components/CategoryCard";
import ResourceCard from "./components/ResourceCard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Educational Resources, Notes & Study Materials",
  description:
    "Explore educational notes, study materials, previous year papers, programming resources, and other learning resources on ExamShelf.",
};

const categories = [
  {
    title: "Computer Science",
    description: "Notes, PDFs, and resources for computer science students.",
  },
  {
    title: "Engineering",
    description: "Study materials for engineering subjects and courses.",
  },
  {
    title: "Previous Year Papers",
    description: "Practice with previous examination papers.",
  },
  {
    title: "Programming",
    description: "Resources for coding and software development.",
  },
];



export default async function Home() {
  const supabase = await createClient();

  const { data: resources, error } = await supabase
    .from("resources")
    .select("*")
    .eq("status", "published");
  if (error) {
    console.error("Error message:", error.message);
    console.error("Error details:", error.details);
    console.error("Error hint:", error.hint);
    console.error("Error code:", error.code);
  }

  return (
    <>
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold">
            LEARN. EXPLORE. GROW.
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Your destination for quality educational resources.
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Discover notes, study materials, PDFs, and tutorials designed to
            support your learning journey.
          </p>

          <div className="mt-8">
            <Link
              href="/explore"
              className="inline-block rounded-lg bg-black px-6 py-3 text-white"
            >
              Explore Resources
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">

        {/* Heading - OUTSIDE the grid */}
        <h2 className="text-3xl font-bold">
          Explore by Category
        </h2>

        {/* Description - OUTSIDE the grid */}
        <p className="mt-3 text-gray-600">
          Find educational resources based on your area of study.
        </p>

        {/* Only cards should be inside the grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              description={category.description}
            />
          ))}
        </div>

      </section>

      {/* Featured Resources Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-bold">Featured Resources</h2>

        <p className="mt-3 text-gray-600">
          Explore popular study materials created for students.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {resources?.map((resource) => (
            <ResourceCard
              key={resource.title}
              title={resource.title}
              category={resource.category}
              price={resource.price}
              slug={resource.slug}
              coverImageUrl={resource.cover_image_url}
            />
          ))}
        </div>
      </section>
    </>
  );
}