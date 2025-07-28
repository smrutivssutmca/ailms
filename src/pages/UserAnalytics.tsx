import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const UserAnalytics = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const user_id = params.get('user_id');
  const grade_id = params.get('grade_id');
  const subject_id = params.get('subject_id');

  const [attended, setAttended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user_id || !grade_id || !subject_id) return;
    fetch(`https://ailmsbe.onrender.com/questions/userquestionattended?user_id=${user_id}&grade_id=${grade_id}&subject_id=${subject_id}`)
      .then(res => res.json())
      .then(data => {
        setAttended(data);
        setLoading(false);
      });
  }, [user_id, grade_id, subject_id]);

  if (loading) return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<div className="flex flex-col items-center justify-center">
				<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
				<div className="text-lg text-blue-600 font-semibold">Loading Analytics...</div>
			</div>
		</div>;
  if (!attended || !Array.isArray(attended) || attended.length === 0) return <div>No attended questions found.</div>;

  const correct = attended.filter(q => q.is_correct === 1).length;
  const incorrect = attended.filter(q => q.is_correct === 0).length;
  const percent = attended.length ? Math.round((correct / attended.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">User Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Correct Answers</h3>
          <p className="text-xl font-bold">{correct}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Incorrect Answers</h3>
          <p className="text-xl font-bold">{incorrect}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Accuracy</h3>
          <p className="text-xl font-bold">{percent}%</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Last 20 Attended Questions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">Question ID</th>
                <th className="px-2 py-1 border">Score (Theta)</th>
                <th className="px-2 py-1 border">Correct?</th>
              </tr>
            </thead>
            <tbody>
  {attended.slice(0, 20).map((q, i, arr) => {
    const currScore = q.score ?? 0;
    const nextScore = arr[i + 1]?.score ?? currScore; // next is actually earlier

    let scoreColor = 'text-gray-800';
    if (currScore > nextScore) {
      scoreColor = 'text-green-600'; // improved from last
    } else if (currScore < nextScore) {
      scoreColor = 'text-red-600'; // dropped from last
    }

    return (
      <tr key={i} className={q.is_correct ? 'bg-green-50' : 'bg-red-50'}>
        <td className="px-2 py-1 border">{q.question_id}</td>
        <td className={`px-2 py-1 border font-bold ${scoreColor}`}>
          {q.score ?? '-'}
        </td>
        <td className="px-2 py-1 border">{q.is_correct === 1 ? 'Yes' : 'No'}</td>
      </tr>
    );
  })}
</tbody>



          </table>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
