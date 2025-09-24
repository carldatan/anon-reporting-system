import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
	// Start with a base response
	const response = NextResponse.next()

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						response.cookies.set(name, value, options)
					})
				},
			},
		}
	)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	const pathname = request.nextUrl.pathname

	// Public routes (accessible without auth)
	const publicRoutes = [
		'/',
		'/login',
		'/auth',
		'/error',
		'/about',
		'/pricing',
		'/contact',
	]

	// Protected routes (require auth)
	const protectedRoutes = [
		'/home',
		'/profile',
		'/settings',
		'/admin',
	]

	const isPublicRoute = publicRoutes.some(route =>
		route === '/' ? pathname === '/' : pathname.startsWith(route)
	)

	const isProtectedRoute = protectedRoutes.some(route =>
		pathname.startsWith(route)
	)

	// Redirect unauthenticated users away from protected routes
	if (!user && isProtectedRoute) {
		const url = request.nextUrl.clone()
		url.pathname = '/login'
		url.searchParams.set('redirect', pathname)
		return NextResponse.redirect(url)
	}

	// Redirect authenticated users away from login
	if (user && pathname === '/login') {
		const url = request.nextUrl.clone()
		url.pathname = '/home'
		return NextResponse.redirect(url)
	}

	return response
}

export async function middleware(request: NextRequest) {
	return updateSession(request)
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}
