/*
  # LabelIed Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
    
    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text)
      - `type` (text) - 'image' or 'text'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `datasets`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `file_name` (text)
      - `file_url` (text)
      - `file_type` (text)
      - `content` (text) - for text data
      - `created_at` (timestamp)
    
    - `labels`
      - `id` (uuid, primary key)
      - `dataset_id` (uuid, references datasets)
      - `label_text` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Users can only access their own projects and related data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL CHECK (type IN ('image', 'text')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create datasets table
CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text,
  file_type text NOT NULL,
  content text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read datasets from own projects"
  ON datasets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = datasets.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert datasets to own projects"
  ON datasets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = datasets.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete datasets from own projects"
  ON datasets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = datasets.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create labels table
CREATE TABLE IF NOT EXISTS labels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  label_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read labels from own datasets"
  ON labels FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM datasets
      JOIN projects ON projects.id = datasets.project_id
      WHERE datasets.id = labels.dataset_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert labels to own datasets"
  ON labels FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM datasets
      JOIN projects ON projects.id = datasets.project_id
      WHERE datasets.id = labels.dataset_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update labels on own datasets"
  ON labels FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM datasets
      JOIN projects ON projects.id = datasets.project_id
      WHERE datasets.id = labels.dataset_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM datasets
      JOIN projects ON projects.id = datasets.project_id
      WHERE datasets.id = labels.dataset_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete labels from own datasets"
  ON labels FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM datasets
      JOIN projects ON projects.id = datasets.project_id
      WHERE datasets.id = labels.dataset_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_datasets_project_id ON datasets(project_id);
CREATE INDEX IF NOT EXISTS idx_labels_dataset_id ON labels(dataset_id);