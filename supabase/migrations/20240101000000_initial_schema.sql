-- Create project_snapshots table
CREATE TABLE project_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  structure JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_project_snapshots_user_id ON project_snapshots(user_id);
CREATE INDEX idx_project_snapshots_created_at ON project_snapshots(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE project_snapshots ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own project snapshots" ON project_snapshots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own project snapshots" ON project_snapshots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own project snapshots" ON project_snapshots
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own project snapshots" ON project_snapshots
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at
CREATE TRIGGER update_project_snapshots_updated_at
  BEFORE UPDATE ON project_snapshots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();