import { verifyToken, extractTokenFromHeader } from '@/utils/jwt';

export async function GET(req: Request): Promise<Response> {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return new Response(JSON.stringify({ error: 'Токен не предоставлен' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return new Response(JSON.stringify({ error: 'Неверный токен' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in GET /api/auth/me:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при проверке токена' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}


