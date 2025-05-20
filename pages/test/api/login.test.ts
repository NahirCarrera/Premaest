import handler from '@/pages/api/login';
import { createMocks } from 'node-mocks-http';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';

jest.mock('@/lib/supabaseClient');
jest.mock('bcryptjs');

describe('/api/milogin', () => {
  it('devuelve 200 si las credenciales son correctas', async () => {
    // Mock de usuario de prueba
    const mockUser = {
      user_id: '1',
      username: 'prueba',
      password: 'hashed_password',
      first_name: 'Juan',
      last_name: 'Pérez',
      role: 'user',
    };

    // Simular que Supabase devuelve el usuario
    (supabase.from as jest.Mock).mockReturnValue({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: mockUser, error: null }),
        }),
      }),
    });

    // Simular que la contraseña coincide
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'prueba',
        password: 'prueba', // cualquier valor, porque estamos mockeando
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).success).toBe(true);
  });
});
