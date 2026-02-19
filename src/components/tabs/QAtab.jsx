
export default function QATab({ question, setQuestion, answer, onGenerate }) {
  return (
    <div className="space-y-3">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Paste application question..."
        className="w-full h-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <button 
        onClick={onGenerate}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
      >
        Generate Answer
      </button>

      {answer && (
        <div className="mt-3 p-3 bg-green-50 text-green-800 border border-green-200 rounded text-sm italic">
          {answer}
        </div>
      )}
    </div>
  );
}