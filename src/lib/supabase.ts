import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock client if environment variables are missing
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Using mock client.');
  
  // Create mock Supabase client for development
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      signUp: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({ eq: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } }) }),
      upsert: () => ({ select: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }) })
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Database types
export interface UserKey {
  id: string;
  user_id: string;
  name: string;
  key_type: string;
  key_size: number;
  public_key: string;
  private_key?: string;
  created_at: string;
}

export interface EncryptionHistory {
  id: string;
  user_id: string;
  algorithm: string;
  operation: string;
  input_text: string;
  output_text: string;
  key_used?: string;
  key_id?: string;
  created_at: string;
}

export interface SteganographyHistory {
  id: string;
  user_id: string;
  operation: string;
  method: string;
  text_hidden?: string;
  text_extracted?: string;
  image_name: string;
  created_at: string;
}

export interface MLTrainingData {
  id: string;
  user_id: string;
  input_text: string;
  predicted_algorithm: string;
  actual_algorithm: string;
  confidence: number;
  features: any;
  is_correct: boolean;
  user_feedback: 'correct' | 'incorrect';
  created_at: string;
}

export interface MLModelWeights {
  id: string;
  user_id: string;
  algorithm: string;
  feature_name: string;
  weight: number;
  updated_at: string;
}

export interface MLModelStats {
  id: string;
  user_id: string;
  training_count: number;
  accuracy: number;
  algorithms_learned: string[];
  last_updated: string;
}

// Key management functions
export const keyService = {
  async saveKey(key: Omit<UserKey, 'id' | 'user_id' | 'created_at'>) {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured. Please set up your Supabase project.');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_keys')
      .insert({
        ...key,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserKeys() {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return [];
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_keys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async deleteKey(keyId: string) {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return;
    }

    const { error } = await supabase
      .from('user_keys')
      .delete()
      .eq('id', keyId);

    if (error) throw error;
  }
};

// Encryption history functions
export const encryptionService = {
  async saveEncryption(encryption: Omit<EncryptionHistory, 'id' | 'user_id' | 'created_at'>) {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured. Please set up your Supabase project.');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('encryption_history')
      .insert({
        ...encryption,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getEncryptionHistory(limit = 50) {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return [];
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('encryption_history')
      .select(`
        *,
        user_keys (
          name,
          key_type
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async deleteEncryption(encryptionId: string) {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return;
    }

    const { error } = await supabase
      .from('encryption_history')
      .delete()
      .eq('id', encryptionId);

    if (error) throw error;
  }
};

// Steganography history functions
export const steganographyService = {
  async saveSteganography(stego: Omit<SteganographyHistory, 'id' | 'user_id' | 'created_at'>) {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured. Please set up your Supabase project.');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('steganography_history')
      .insert({
        ...stego,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSteganographyHistory(limit = 50) {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return [];
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('steganography_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async deleteSteganography(stegoId: string) {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return;
    }

    const { error } = await supabase
      .from('steganography_history')
      .delete()
      .eq('id', stegoId);

    if (error) throw error;
  }
};

// ML training functions
export const mlService = {
  async saveTrainingData(training: Omit<MLTrainingData, 'id' | 'user_id' | 'created_at'>) {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured. Please set up your Supabase project.');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('ml_training_data')
      .insert({
        ...training,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTrainingData(limit = 1000) {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return [];
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('ml_training_data')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async saveModelWeights(weights: Omit<MLModelWeights, 'id' | 'user_id' | 'updated_at'>[]) {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured. Please set up your Supabase project.');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const weightsWithUserId = weights.map(w => ({
      ...w,
      user_id: user.id
    }));

    const { data, error } = await supabase
      .from('ml_model_weights')
      .upsert(weightsWithUserId, { 
        onConflict: 'user_id,algorithm,feature_name',
        ignoreDuplicates: false 
      })
      .select();

    if (error) throw error;
    return data;
  },

  async getModelWeights() {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return [];
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('ml_model_weights')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data || [];
  },

  async saveModelStats(stats: Omit<MLModelStats, 'id' | 'user_id' | 'last_updated'>) {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured. Please set up your Supabase project.');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('ml_model_stats')
      .upsert({
        ...stats,
        user_id: user.id,
        last_updated: new Date().toISOString()
      }, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getModelStats() {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('ml_model_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  }
};