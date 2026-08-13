'use server';

import { cookies } from 'next/headers';

const getApiHost = () => {
    return process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8000';
};

export async function handleRefresh() {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
        return null;
    }

    try {
        const response = await fetch(`${getApiHost()}/api/auth/token/refresh/`, {
            method: 'POST',
            body: JSON.stringify({
                refresh: refreshToken
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();

        if (json.access) {
            try {
                cookies().set('session_access_token', json.access, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 60 * 60, // 60 minutes
                    path: '/'
                });
            } catch (e) {
                // Ignore cookie set error during RSC render
            }

            return json.access;
        } else {
            await resetAuthCookies();
        }
    } catch (error) {
        // Refresh failed
    }

    return null;
}

export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    try {
        cookies().set('session_userid', userId, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 24 * 7, // One week
            path: '/'
        });

        cookies().set('session_access_token', accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60, // 60 minutes
            path: '/'
        });

        cookies().set('session_refresh_token', refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 24 * 7, // One week
            path: '/'
        });
    } catch (e) {
        // Ignore in non-action context
    }
}

export async function resetAuthCookies() {
    try {
        cookies().set('session_userid', '');
        cookies().set('session_access_token', '');
        cookies().set('session_refresh_token', '');
    } catch (e) {
        // Ignore cookie modification error during Server Component render
    }
}

export async function getUserId() {
    try {
        const userId = cookies().get('session_userid')?.value;
        return userId ? userId : null;
    } catch (e) {
        return null;
    }
}

export async function getAccessToken() {
    try {
        let accessToken = cookies().get('session_access_token')?.value;

        if (!accessToken) {
            const refreshToken = cookies().get('session_refresh_token')?.value;
            if (refreshToken) {
                accessToken = (await handleRefresh()) || undefined;
            }
        }

        return accessToken || null;
    } catch (e) {
        return null;
    }
}

export async function getRefreshToken() {
    try {
        const refreshToken = cookies().get('session_refresh_token')?.value;
        return refreshToken || null;
    } catch (e) {
        return null;
    }
}