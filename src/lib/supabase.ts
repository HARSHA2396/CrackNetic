import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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