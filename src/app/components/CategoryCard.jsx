export default function CategoryCard({ title, description }) {
  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}