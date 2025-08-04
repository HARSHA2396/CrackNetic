/*
  # User Keys and Encrypted Data Storage

  1. New Tables
    - `user_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `algorithm` (text)
      - `key_type` (text)
      - `key_size` (integer)
      - `public_key` (text)
      - `private_key` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `encrypted_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `algorithm` (text)
      - `original_text` (text)
      - `encrypted_text` (text)
      - `key_used` (text)
      - `operation_type` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create user_keys table
CREATE TABLE IF NOT EXISTS user_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  algorithm text NOT NULL,
  key_type text NOT NULL,
  key_size integer NOT NULL,
  public_key text NOT NULL,
  private_key text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create encrypted_data table
CREATE TABLE IF NOT EXISTS encrypted_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  algorithm text NOT NULL,
  original_text text NOT NULL,
  encrypted_text text NOT NULL,
  key_used text NOT NULL,
  operation_type text NOT NULL CHECK (operation_type IN ('encrypt', 'decrypt')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE encrypted_data ENABLE ROW LEVEL SECURITY;

-- Create policies for user_keys
CREATE POLICY "Users can view own keys"
  ON user_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own keys"
  ON user_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own keys"
  ON user_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own keys"
  ON user_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for encrypted_data
CREATE POLICY "Users can view own encrypted data"
  ON encrypted_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own encrypted data"
  ON encrypted_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own encrypted data"
  ON encrypted_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_keys_user_id ON user_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_keys_algorithm ON user_keys(algorithm);
CREATE INDEX IF NOT EXISTS idx_encrypted_data_user_id ON encrypted_data(user_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_data_algorithm ON encrypted_data(algorithm);
CREATE INDEX IF NOT EXISTS idx_encrypted_data_created_at ON encrypted_data(created_at DESC);

-- Create updated_at trigger for user_keys
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_keys_updated_at
  BEFORE UPDATE ON user_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();