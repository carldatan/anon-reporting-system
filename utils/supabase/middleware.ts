import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	})

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
					supabaseResponse = NextResponse.next({
						request,
					})
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options)
					)
				},
			},
		}
	)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	const pathname = request.nextUrl.pathname

	// Define public routes (accessible without authentication)
	const publicRoutes = [
		'/',           // Hero page
		'/login',      // Login page
		'/auth',       // Auth callbacks
		'/error',      // Error pages
		'/about',      // Add any other public pages
		'/pricing',    // Add any other public pages
		'/contact',    // Add any other public pages
	]

	// Define protected routes (require authentication)
	const protectedRoutes = [
		'/home',
		'/profile',
		'/settings',
		'/admin',
		// Add your protected routes here
	]

	const isPublicRoute = publicRoutes.some(route => {
		if (route === '/') {
			return pathname === '/'  // Exact match for root
		}
		return pathname.startsWith(route)
	})

	const isProtectedRoute = protectedRoutes.some(route =>
		pathname.startsWith(route)
	)

	// If accessing a protected route without authentication
	if (!user && isProtectedRoute) {
		console.log('Redirecting unauthenticated user from protected route:', pathname)
		const url = request.nextUrl.clone()
		url.pathname = '/login'
		// Optionally add redirect parameter to return user after login
		url.searchParams.set('redirect', pathname)
		return NextResponse.redirect(url)
	}

	// If user is authenticated and tries to access login, redirect to dashboard
	if (user && pathname === '/login') {
		const url = request.nextUrl.clone()
		url.pathname = '/home'
		return NextResponse.redirect(url)
	}

	return supabaseResponse
}

export async function middleware(request: NextRequest) {
	return await updateSession(request)
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}
