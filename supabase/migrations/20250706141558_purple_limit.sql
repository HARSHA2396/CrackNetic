/*
  # Create user data storage tables

  1. New Tables
    - `user_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `key_type` (text)
      - `key_size` (integer)
      - `public_key` (text)
      - `private_key` (text, nullable)
      - `created_at` (timestamp)
    - `encryption_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `algorithm` (text)
      - `operation` (text)
      - `input_text` (text)
      - `output_text` (text)
      - `key_used` (text, nullable)
      - `key_id` (uuid, nullable, references user_keys)
      - `created_at` (timestamp)
    - `steganography_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `operation` (text)
      - `method` (text)
      - `text_hidden` (text, nullable)
      - `text_extracted` (text, nullable)
      - `image_name` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS user_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  key_type text NOT NULL,
  key_size integer NOT NULL,
  public_key text NOT NULL,
  private_key text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS encryption_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  algorithm text NOT NULL,
  operation text NOT NULL,
  input_text text NOT NULL,
  output_text text NOT NULL,
  key_used text,
  key_id uuid REFERENCES user_keys(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS steganography_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  operation text NOT NULL,
  method text NOT NULL,
  text_hidden text,
  text_extracted text,
  image_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE encryption_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE steganography_history ENABLE ROW LEVEL SECURITY;

-- Policies for user_keys
CREATE POLICY "Users can manage their own keys"
  ON user_keys
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for encryption_history
CREATE POLICY "Users can manage their own encryption history"
  ON encryption_history
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for steganography_history
CREATE POLICY "Users can manage their own steganography history"
  ON steganography_history
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_keys_user_id ON user_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_encryption_history_user_id ON encryption_history(user_id);
CREATE INDEX IF NOT EXISTS idx_steganography_history_user_id ON steganography_history(user_id);
CREATE INDEX IF NOT EXISTS idx_encryption_history_created_at ON encryption_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_steganography_history_created_at ON steganography_history(created_at DESC);