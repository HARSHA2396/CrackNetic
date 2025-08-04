-- Create ML training data table
CREATE TABLE IF NOT EXISTS ml_training_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  input_text text NOT NULL,
  predicted_algorithm text NOT NULL,
  actual_algorithm text NOT NULL,
  confidence real NOT NULL,
  features jsonb NOT NULL,
  is_correct boolean NOT NULL,
  user_feedback text NOT NULL CHECK (user_feedback IN ('correct', 'incorrect')),
  created_at timestamptz DEFAULT now()
);

-- Create ML model weights table
CREATE TABLE IF NOT EXISTS ml_model_weights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  algorithm text NOT NULL,
  feature_name text NOT NULL,
  weight real NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, algorithm, feature_name)
);

-- Create ML model stats table
CREATE TABLE IF NOT EXISTS ml_model_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  training_count integer DEFAULT 0,
  accuracy real DEFAULT 0,
  algorithms_learned text[] DEFAULT '{}',
  last_updated timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE ml_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_model_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_model_stats ENABLE ROW LEVEL SECURITY;

-- Policies for ml_training_data
CREATE POLICY "Users can manage their own ML training data"
  ON ml_training_data
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for ml_model_weights
CREATE POLICY "Users can manage their own ML model weights"
  ON ml_model_weights
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for ml_model_stats
CREATE POLICY "Users can manage their own ML model stats"
  ON ml_model_stats
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ml_training_data_user_id ON ml_training_data(user_id);
CREATE INDEX IF NOT EXISTS idx_ml_training_data_created_at ON ml_training_data(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ml_model_weights_user_id ON ml_model_weights(user_id);
CREATE INDEX IF NOT EXISTS idx_ml_model_weights_algorithm ON ml_model_weights(algorithm);
CREATE INDEX IF NOT EXISTS idx_ml_model_stats_user_id ON ml_model_stats(user_id);