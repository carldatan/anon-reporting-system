'use client'
import { useState } from "react";
import PostModal from "./createPost";
import Thread from "./thread";
import { toast } from "sonner";
import { threadType } from "@/types/thread";
import ThreadModal from "./threadModal";
import { reply } from "@/types/replies";
import { getReplies } from "@/lib/db/replies";


export default function ThreadWrapper({ initialThreads }: { initialThreads: threadType[] }) {
	const [threads, setThreads] = useState<threadType[]>(initialThreads);
	const [selectedThread, setSelectedThread] = useState<threadType | null>(null);
	const [isThreadModalOpen, setIsThreadModalOpen] = useState(false)
	const [replies, setReplies] = useState<reply[]>([])
	const [isLoadingReplies, setIsLoadingReplies] = useState(false);


	const handleNewPost = (newPost: threadType) => {
		console.log('Post created successfully:', newPost);
		// Show success message
		setThreads(prev => [newPost, ...prev]);
		toast.success('Post created successfully!');
	};

	const handlePostError = (error: string) => {
		console.error('Failed to create post:', error);
		// Show error message
		toast.error(`Failed to create post: ${error}`);
	};

	const handleOpenCommentModal = async (thread: threadType) => {
		setSelectedThread(thread);
		setIsThreadModalOpen(true);
		setIsLoadingReplies(true);

		try {
			const data = await getReplies(thread.id);
			setReplies(data);
		} catch (error) {
			console.error('Failed to load replies:', error);
			toast.error('Failed to load replies');
		} finally {
			setIsLoadingReplies(false);
		}
	};
	const handleCloseCommentModal = () => {
		setIsThreadModalOpen(false);
		setSelectedThread(null);
	};

	const handleReplyAdded = (newReply: reply) => {
		setReplies(prev => [newReply, ...prev]);
	};

	const handleReplyRefresh = () => {
		if (selectedThread) {
			getReplies(selectedThread.id);
		}
	};

	const handleReplyRemoved = (replyId: number) => {
		setReplies(prev => prev.filter(reply => reply.id !== replyId));
	};


	return (
		<>
			<PostModal onPostSuccess={handleNewPost} onPostError={handlePostError} />
			<div className="flex flex-col items-center min-h-screen">
				<Thread handleModal={handleOpenCommentModal} initialThreads={threads} />
			</div>

			<ThreadModal
				isOpen={isThreadModalOpen}
				onClose={() => setIsThreadModalOpen(false)}
				thread={selectedThread}
				replies={replies}
				onReplyAdded={handleReplyAdded}
				onReplyRefresh={handleReplyRefresh}
				onReplyRemoved={handleReplyRemoved}
			/>		</>
	);
}
