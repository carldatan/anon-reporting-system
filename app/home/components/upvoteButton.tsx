"use client";
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';

interface UpvoteProps {
	initialCount: number,
	initialVoted?: boolean;
	thread_id: number,
	user_id: string,
	size?: number;
	onVote?: (post_id: number, user_id: string, isVoted: boolean | undefined) => void;
}

const UpvoteButton: React.FC<UpvoteProps> = ({
	initialVoted,
	initialCount,
	thread_id,
	user_id,
	size = 24,
}) => {
	const [isVoted, setIsVoted] = useState(initialVoted);
	const [isHovered, setIsHovered] = useState(false);
	const [upvoteCount, setUpvoteCount] = useState(initialCount);

	const handleClick = async () => {
		const newVotedState = !isVoted;
		setIsVoted(newVotedState)
		setUpvoteCount(prev => prev + (newVotedState ? 1 : -1));

		console.log("upvoteCount", upvoteCount, "isVoted", isVoted);
		try {
			await fetch(`/api/upvote`, {
				method: newVotedState ? "POST" : "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ post_id: thread_id, user_id })
			});
		} catch (err) {
			console.error("Failed to save upvote:", err);
			// Optionally rollback the UI
			setIsVoted(!newVotedState);
			setUpvoteCount(prev => prev + (newVotedState ? -1 : 1));
		}
	};

	const getColor = () => {
		if (isVoted) return '#ff4500'; // Reddit orange
		if (isHovered) return '#ffffff';
		return '#878a8c'; // Reddit gray
	};

	const getStrokeColor = () => {
		if (isVoted) return '#ff4500'; // Reddit orange
		if (isHovered) return '#ff4500'; // Orange outline on hover
		return '#878a8c'; // Reddit gray
	};

	return (
		<>
			<button
				onClick={handleClick}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				className="p-1 rounded hover:bg-gray-100 transition-colors duration-150 border-none bg-transparent cursor-pointer"
				aria-label={isVoted ? "Remove upvote" : "Upvote"}
			>
				<svg
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 4L20 12H16V20H8V12H4L12 4Z"
						fill={getColor()}
						stroke={getStrokeColor()}
						strokeWidth="2"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
			<Label>{upvoteCount || 0}</Label>
		</>
	);
};


export default UpvoteButton;
