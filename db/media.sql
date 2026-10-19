CREATE TABLE IF NOT EXISTS vien_admins (
  user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  granted_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS vien_media_assets (
  id text PRIMARY KEY,
  destination_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('cover','video')),
  content_type text NOT NULL,
  byte_size integer NOT NULL CHECK (byte_size > 0 AND byte_size <= 52428800),
  status text NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading','ready')),
  created_by text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS vien_media_chunks (
  asset_id text NOT NULL REFERENCES vien_media_assets(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL CHECK (chunk_index >= 0),
  data bytea NOT NULL CHECK (octet_length(data) <= 1048576),
  PRIMARY KEY (asset_id,chunk_index)
);
CREATE TABLE IF NOT EXISTS vien_destination_media (
  destination_id text PRIMARY KEY,
  cover_id text REFERENCES vien_media_assets(id) ON DELETE SET NULL,
  video_id text REFERENCES vien_media_assets(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text REFERENCES "user"(id) ON DELETE SET NULL
);
