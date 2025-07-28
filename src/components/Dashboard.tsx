import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Grade {
  id: number;
  name: string;
}
interface Subject {
  id: number;
  name: string;
}
interface Topic {
  id: number;
  name: string;
}

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topicFilter, setTopicFilter] = useState("");
  const [userResults, setUserResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch grades on component mount
    fetch('https://ailmsbe.onrender.com/questions/grades')
      .then(res => res.json())
      .then(setGrades);

    // Fetch user results
    const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
    fetch(`https://ailmsbe.onrender.com/questions/userresult?user_id=${userId}`)
      .then(res => res.json())
      .then(setUserResults);
  }, []);

  useEffect(() => {
    if (selectedGrade !== null) {
      // Fetch subjects for the selected grade
      fetch(`https://ailmsbe.onrender.com/questions/subjects?grade=${selectedGrade}`)
        .then(res => res.json())
        .then(setSubjects);
    }
  }, [selectedGrade]);

  useEffect(() => {
    if (selectedSubject) {
      // Fetch topics for the selected subject
      fetch(`https://ailmsbe.onrender.com/questions/topics?subject_id=${selectedSubject.id}`)
        .then(res => res.json())
        .then(setTopics);
    }
  }, [selectedSubject]);

  const handleStartQuiz = () => {
    setModalOpen(true);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSubjects([]);
    setTopics([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="bg-white rounded shadow p-6 mb-6">
          <p className="mb-4">Welcome to your dashboard!</p>
          <button
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleStartQuiz}
          >
            Start Quiz
          </button>
        </div>
        {userResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {userResults.map((r, idx) => (
              <div key={idx} className="bg-indigo-50 rounded shadow p-4 cursor-pointer" onClick={() => navigate(`/user-analytics?user_id=${r.user_id}&grade_id=${r.grade_id}&subject_id=${r.subject_id}`)}>
                <h3 className="font-semibold text-lg mb-2">Result</h3>
                <div className="mb-1">Grade: {r.grade_id}</div>
                <div className="mb-1">Subject: {r.subject_name}</div>
                <div className="mb-1">Score (Theta): {r.score}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-4 text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Select Grade</h2>
            {!selectedGrade && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {grades.map(g => (
                  <button
                    key={g.id}
                    className="px-3 py-2 rounded bg-sky-100 hover:bg-sky-300 text-sky-800 font-semibold"
                    onClick={() => setSelectedGrade(Number(g.id))}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            )}
            {selectedGrade && !selectedSubject && (
              <>
                <h2 className="text-lg font-semibold mb-2">Select Subject</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {subjects.map(s => (
                    <button
                      key={s.id}
                      className="px-3 py-2 rounded bg-blue-100 hover:bg-blue-300 text-blue-800 font-semibold"
                      onClick={() => window.location.href = `/quiz?grade_id=${selectedGrade}&subject_id=${s.id}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
                <button className="text-sm text-gray-500 hover:underline" onClick={() => setSelectedGrade(null)}>
                  &larr; Back to Grades
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
