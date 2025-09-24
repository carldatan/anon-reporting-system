"use client";
import { createPost } from "@/api/post";
import { cn } from "@/registry/default/lib/utils"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog"

import { useState, useRef } from 'react'
import ConfirmDiscard from "./confirmDiscard";

interface PostModalProps {
	onPostSuccess?: (post: any) => void;
	onPostError?: (error: string) => void;
	onStatusChange?: (status: 'idle' | 'submitting' | 'success' | 'error') => void;
}

const PostModal = ({ onPostSuccess, onPostError, onStatusChange }: PostModalProps) => {
	const [open, setOpen] = useState(false)
	const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
	const [pendingClose, setPendingClose] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const [header, setHeader] = useState("");
	const hasError = header.length > 100;

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen && isSubmitting) {
			console.log('Cannot close while submitting')
			return
		}

		if (!newOpen && textareaRef.current?.value.trim()) {
			setPendingClose(true)
			setShowConfirmDiscard(true)
			return
		}

		if (!newOpen) {
			console.log('Dialog closed via X button or escape')
		}

		setOpen(newOpen)
	}

	const handleConfirmDiscard = () => {
		if (textareaRef.current) {
			textareaRef.current.value = ''
		}
		setShowConfirmDiscard(false)
		setPendingClose(false)
		setOpen(false)
	}

	const handleCancelDiscard = () => {
		setShowConfirmDiscard(false)
		setPendingClose(false)
	}

	const handleSubmit = async () => {
		const content = textareaRef.current?.value.trim()

		if (!content) {
			alert('Please write something before posting')
			return
		}

		setIsSubmitting(true)

		try {
			const result = await createPost({ header, content })

			if (result.success) {
				// Clear form
				setHeader('')
				if (textareaRef.current) {
					textareaRef.current.value = ''
				}

				// Notify parent of success
				onPostSuccess?.(result.data)

				// Close modal
				setOpen(false)
			} else {
				console.error('Error:', result.error)
				onPostError?.(result.error || 'Failed to create post')
			}
		} catch (error) {
			console.error('Unexpected error:', error)
			const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
			onPostError?.(errorMessage)
			onStatusChange?.('error')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogTrigger asChild>
					<Button>Create Post</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Post</DialogTitle>
						<DialogDescription>
							Share your thoughts with the community
						</DialogDescription>
					</DialogHeader>
					<Label htmlFor="headerInput">Post Header</Label>
					<Input
						id="headerInput"
						value={header}
						className={cn(hasError && "border-red-500 focus:border-red-500 focus:ring-red-500")}
						onChange={(e) => setHeader(e.target.value)}
						type="text"
						placeholder="Place header here"
					/>

					{hasError && (
						<p className="text-red-500 text-sm mt-1">
							Header should be less than 100 characters.
						</p>
					)}

					<Textarea
						ref={textareaRef}
						placeholder="Write your concern"
						disabled={isSubmitting}
						className="min-h-32"
					/>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							onClick={handleSubmit}
							disabled={isSubmitting || hasError}
						>
							{isSubmitting ? 'Posting...' : 'Confirm'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<ConfirmDiscard
				open={showConfirmDiscard}
				onConfirm={handleConfirmDiscard}
				onCancel={handleCancelDiscard}
			/>
		</>
	)
}

export default PostModal;
