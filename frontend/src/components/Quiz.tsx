import React, { useEffect, useState } from 'react';
import QuestionCard from './QuestionCard';
import { QuizQuestion } from '../types/quiz';

interface result {
	questionId: number;
	correct: number;
}

const getParams = () => {
	const url = new URL(window.location.href);
	return {
		gradeId: url.searchParams.get('grade_id'),
		subjectId: url.searchParams.get('subject_id')
	};
};

const Quiz = () => {
	const [question, setQuestion] = useState<any>(null);
	const [selected, setSelected] = useState<boolean | null>(null);
	const [current, setCurrent] = useState(1);
	const [total] = useState(5);
	const [answers, setAnswers] = useState<{ questionId: number; correct: number }[]>([]);
	const [showResult, setShowResult] = useState(false);
	const [analytics, setAnalytics] = useState<any>(null);
	const [noQuestions, setNoQuestions] = useState(false);
	const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

	const params = getParams();

	useEffect(() => {
		fetchQuestion();
	}, []);

	const fetchQuestion = async (result?: { questionId: number; correct: number }) => {
		let body: any = {
			grade_id: params.gradeId,
			subject_id: params.subjectId,
			user_id: userId,
		};
		if (result && question) {
			body.result = { question_id: result.questionId, correct: result.correct };
		}
		try {
			const res = await fetch('https://ailms-hbk9.onrender.com/questions/next', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});
			if (!res.ok && res.status === 404) {
				setNoQuestions(true);
				return;
			}
			const data = await res.json();
			setQuestion(data);
			setSelected(null);
		} catch (e) {
			setNoQuestions(true);
		}
	};

	const handleSelect = (val: boolean) => {
		setSelected(val);
	};

	const handleNext = () => {
		if (selected !== null) {
			setAnswers([...answers, { questionId: question.id, correct: selected ? 1 : 0 }]);
			if (current < total) {
				fetchQuestion({ questionId: question.id, correct: selected ? 1 : 0 });
				setCurrent(current + 1);
			} else {
				handleSubmit();
			}
		}
	};

	const handleSubmit = async () => {
		const res = await fetch('/questions/submit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				grade_id: params.gradeId,
				subject_id: params.subjectId,
				user_id: userId,
				answers,
			}),
		});
		const data = await res.json();
		setAnalytics(data.analytics);
		setShowResult(true);
	};

	if (noQuestions) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
				<div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
					<h2 className="text-xl font-bold mb-4">No Questions Available</h2>
					<p className="mb-6">There are no questions available for this grade and subject.</p>
					<button
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						onClick={() => (window.location.href = '/dashboard')}
					>
						OK
					</button>
				</div>
			</div>
		);
	}

	if (!question) return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<div className="flex flex-col items-center justify-center">
				<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
				<div className="text-lg text-blue-600 font-semibold">Loading Quiz...</div>
			</div>
		</div>
	);

	if (showResult && analytics) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
				<div className="bg-white p-8 rounded shadow w-full max-w-xl">
					<h2 className="text-2xl font-bold mb-4">Quiz Analytics</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-blue-100 p-4 rounded shadow">
							<h3 className="font-semibold mb-2">Performance Movement</h3>
							<p>{analytics.performance_movement}</p>
						</div>
						<div className="bg-green-100 p-4 rounded shadow">
							<h3 className="font-semibold mb-2">Correct Answers</h3>
							<p>{analytics.correct_answers} / {analytics.total_questions}</p>
						</div>
						<div className="bg-red-100 p-4 rounded shadow">
							<h3 className="font-semibold mb-2">Weak Areas</h3>
							<ul className="list-disc ml-4">
								{analytics.weak_areas.map((w: string, i: number) => (
									<li key={i}>{w}</li>
								))}
							</ul>
						</div>
					</div>
					<button
						className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
						onClick={() => (window.location.href = '/dashboard')}
					>
						Back to Dashboard
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-xl p-8 bg-white rounded shadow">
				<h2 className="text-xl font-bold mb-4">Quiz</h2>
				<div className="mb-2 text-right text-gray-500">{current} out of {total}</div>
				<div className="mb-6">
					<div className="font-semibold mb-2">Question:</div>
					<div className="mb-4 text-lg">{question.question}</div>
					<div className="font-semibold mb-2">Possible Answer:</div>
					<div className="mb-4 text-md">{question.answer}</div>
					<div className="flex gap-4 mb-4">
						<button
							className={`px-4 py-2 rounded font-semibold ${selected === true ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}
							onClick={() => handleSelect(true)}
						>
							True
						</button>
						<button
							className={`px-4 py-2 rounded font-semibold ${selected === false ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'}`}
							onClick={() => handleSelect(false)}
						>
							False
						</button>
					</div>
				</div>
				<button
					className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 mt-4"
					onClick={handleNext}
					disabled={selected === null}
				>
					{current === total ? 'Submit' : 'Next'}
				</button>
			</div>
		</div>
	);
};

export default Quiz;
