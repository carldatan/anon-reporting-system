// app/(auth)/login/page.tsx
import { Suspense } from "react"
import Header from "@/components/ui/header"
import LoginClient from "./components/loginClient"

export default function LoginPage() {
	return (
		<>
			<Header />
			<Suspense fallback={<div>Loading...</div>}>
				<LoginClient />
			</Suspense>
		</>
	)
}
