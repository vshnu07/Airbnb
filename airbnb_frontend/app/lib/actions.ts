'use server';

import { cookies } from 'next/headers';

const getApiHost = () => {
    return process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8000';
};

export async function handleRefresh() {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
        resetAuthCookies();
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
            cookies().set('session_access_token', json.access, {
                httpOnly: true,
                secure: false,
                maxAge: 60 * 60, // 60 minutes
                path: '/'
            });

            return json.access;
        } else {
            resetAuthCookies();
        }
    } catch (error) {
        resetAuthCookies();
    }

    return null;
}

export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
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
}

export async function resetAuthCookies() {
    cookies().set('session_userid', '');
    cookies().set('session_access_token', '');
    cookies().set('session_refresh_token', '');
}

export async function getUserId() {
    const userId = cookies().get('session_userid')?.value;
    return userId ? userId : null;
}

export async function getAccessToken() {
    let accessToken = cookies().get('session_access_token')?.value;

    if (!accessToken) {
        accessToken = (await handleRefresh()) || undefined;
    }

    return accessToken;
}

export async function getRefreshToken() {
    const refreshToken = cookies().get('session_refresh_token')?.value;
    return refreshToken;
}