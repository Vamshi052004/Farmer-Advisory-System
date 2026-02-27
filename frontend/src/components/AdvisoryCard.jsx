function AdvisoryCard({ title, description }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h4 className="text-lg font-semibold text-green-700 mb-2">
        {title}
      </h4>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
}
export default AdvisoryCard;