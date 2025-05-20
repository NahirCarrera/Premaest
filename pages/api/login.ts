import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { UserData, ApiResponse } from '@/types/auth';
import { LoginCredentials } from '@/types/auth';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password }: LoginCredentials = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: 'Usuario no encontrado' });
  }

  const valido = await bcrypt.compare(password, user.password);
  if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const userData: UserData = {
    id: user.user_id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role
  };

  res.setHeader('Set-Cookie', serialize('mi_token', JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 día
    path: '/'
  }));

  res.status(200).json({ success: true });
}