
// app/(auth)/login/LoginClient.tsx
"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Card, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import SignInWithGoogleButton from "./SignInWithGoogleButton"

export default function LoginClient() {
	const supabase = createClient()
	const router = useRouter()
	const searchParams = useSearchParams()
	const redirectTo = searchParams.get("redirect") || "/home"

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (session) {
				router.push(redirectTo)
			}
		})

		return () => subscription.unsubscribe()
	}, [router, supabase, redirectTo])

	return (
		<div className="flex items-center justify-center">
			<Card>
				<CardHeader>
					<h1 className="mx-auto max-w-2xl text-balance text-xl font-bold md:text-2xl mb-1">
						Sign in using your CVSU Email
					</h1>
					<CardDescription>
						Don’t worry, this is only used for verification to prevent unauthorized usage of this platform
					</CardDescription>
				</CardHeader>
				<CardContent>
					<SignInWithGoogleButton />
				</CardContent>
			</Card>
		</div>
	)
}
