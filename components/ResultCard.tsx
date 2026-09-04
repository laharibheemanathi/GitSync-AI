interface ResultCardProps {
  title: string;
  content: string;
  color: string;
}

export default function ResultCard({ title, content, color }: ResultCardProps) {
  return (
    <div
      className={`p-5 rounded-lg shadow-md border-l-4 ${color} bg-gray-800 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      <h3 className="font-bold text-lg mb-3 flex items-center">
        {title}
      </h3>
      <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
        {content || (
          <span className="text-gray-500 italic">No data available</span>
        )}
      </div>
    </div>
  );
}