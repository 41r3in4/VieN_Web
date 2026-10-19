CREATE TABLE IF NOT EXISTS vien_chat_messages (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  client_id text NOT NULL,
  content text NOT NULL CHECK (char_length(content) <= 2000),
  photo bytea,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, client_id),
  CHECK (char_length(btrim(content)) > 0 OR photo IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS vien_chat_messages_created_idx ON vien_chat_messages (created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS vien_chat_messages_author_idx ON vien_chat_messages (user_id, created_at DESC);
CREATE TABLE IF NOT EXISTS vien_chat_likes (
  message_id text NOT NULL REFERENCES vien_chat_messages(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  PRIMARY KEY (message_id, user_id)
);
CREATE TABLE IF NOT EXISTS vien_presence (
  user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  last_seen timestamptz NOT NULL DEFAULT now()
);
