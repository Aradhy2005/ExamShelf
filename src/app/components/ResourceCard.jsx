import Image from "next/image";
import Link from "next/link";

export default function ResourceCard({
  title,
  category,
  price,
  slug,
  coverImageUrl,
}) {
  return (
    <Link href={`/resources/${slug}`} className="group block">
      <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg">
        
        {/* Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <Image
            src={coverImageUrl}
            alt={`Cover image for ${title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        {/* Resource Information */}
        <div className="p-5">
          <p className="text-sm font-semibold text-gray-600">
            {category}
          </p>

          <h3 className="mt-2 line-clamp-2 text-xl font-semibold">
            {title}
          </h3>

          <p className="mt-4 text-lg font-bold">
            ₹{price}
          </p>
        </div>
      </article>
    </Link>
  );
}