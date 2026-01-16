import bcrypt from 'bcrypt';
import { supabase } from '../db/client.js';
import type { AdminUser } from '@mathevolve/types';

const SALT_ROUNDS = 10;

export interface AuthResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

export async function verifyLogin(username: string, password: string): Promise<AuthResult> {
  try {
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, username, password_hash, role, created_at')
      .eq('username', username)
      .single();

    if (error || !user) {
      return {
        success: false,
        error: 'Invalid username or password',
      };
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return {
        success: false,
        error: 'Invalid username or password',
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role as 'teacher' | 'admin',
        createdAt: new Date(user.created_at),
      },
    };
  } catch (error) {
    console.error('Login verification error:', error);
    return {
      success: false,
      error: 'An error occurred during login',
    };
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function createAdminUser(
  username: string,
  password: string,
  role: 'teacher' | 'admin' = 'teacher'
): Promise<AuthResult> {
  try {
    const passwordHash = await hashPassword(password);

    const { data: user, error } = await supabase
      .from('admin_users')
      .insert({
        username,
        password_hash: passwordHash,
        role,
      })
      .select('id, username, role, created_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        return {
          success: false,
          error: 'Username already exists',
        };
      }
      throw error;
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role as 'teacher' | 'admin',
        createdAt: new Date(user.created_at),
      },
    };
  } catch (error) {
    console.error('Create admin user error:', error);
    return {
      success: false,
      error: 'An error occurred while creating user',
    };
  }
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  try {
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, username, role, created_at')
      .eq('id', id)
      .single();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role as 'teacher' | 'admin',
      createdAt: new Date(user.created_at),
    };
  } catch (error) {
    console.error('Get admin user error:', error);
    return null;
  }
}
