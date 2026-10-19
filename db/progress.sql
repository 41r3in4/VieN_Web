CREATE TABLE IF NOT EXISTS vien_user_preferences (
  user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  persona text NOT NULL DEFAULT 'historian'
);
CREATE TABLE IF NOT EXISTS vien_progress_events (
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('checkpoint', 'audio', 'trailer')),
  target_id text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, kind, target_id)
);
CREATE TABLE IF NOT EXISTS vien_activity_days (
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  activity_day date NOT NULL,
  PRIMARY KEY (user_id, activity_day)
);
INSERT INTO vien_activity_days (user_id, activity_day)
SELECT user_id, (created_at AT TIME ZONE 'Asia/Bangkok')::date FROM vien_progress_events
ON CONFLICT DO NOTHING;
