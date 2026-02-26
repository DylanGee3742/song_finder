-- Song Finder ELO Database Schema
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- USERS
-- One row per person. spotify_id is nullable
-- now but will be populated once auth is wired up.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  spotify_id    TEXT UNIQUE,
  display_name  TEXT NOT NULL,
  email         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SONGS
-- The global song catalogue. spotify_id links back
-- to the Spotify track when that integration lands.
-- h/s/energy mirror the fields already used in the
-- frontend Art component and Taste DNA chart.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS songs (
  id          SERIAL PRIMARY KEY,
  spotify_id  TEXT UNIQUE,
  title       TEXT NOT NULL,
  artist      TEXT NOT NULL,
  album       TEXT,
  year        INTEGER,
  genre       TEXT,
  h           REAL,   -- hue  (0-360) for colour generation
  s           REAL,   -- saturation (0-100) for colour generation
  energy      REAL    -- 0-1, used in Taste DNA radar chart
);

CREATE INDEX IF NOT EXISTS songs_spotify_id_idx ON songs (spotify_id);

-- ─────────────────────────────────────────────
-- USER SONG RANKINGS
-- Stores each user's ELO score for a song within
-- a specific source (playlist). One row per
-- (user, song, source) combination.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_song_rankings (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  song_id         INTEGER NOT NULL REFERENCES songs (id) ON DELETE CASCADE,
  source_id       TEXT NOT NULL,          -- matches frontend source.id
  elo_rating      REAL NOT NULL DEFAULT 1000,
  wins            INTEGER NOT NULL DEFAULT 0,
  losses          INTEGER NOT NULL DEFAULT 0,
  battles         INTEGER NOT NULL DEFAULT 0,
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, song_id, source_id)
);

CREATE INDEX IF NOT EXISTS rankings_user_source_idx
  ON user_song_rankings (user_id, source_id);

CREATE INDEX IF NOT EXISTS rankings_elo_idx
  ON user_song_rankings (user_id, source_id, elo_rating DESC);

-- ─────────────────────────────────────────────
-- GAME SESSIONS
-- Groups all battles from a single play-through.
-- Lets us reconstruct the SwipeReplay per session
-- and track whether the user finished.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS game_sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  source_id      TEXT NOT NULL,
  game_mode      TEXT NOT NULL,           -- 'quick' | 'standard' | 'deep'
  total_battles  INTEGER NOT NULL DEFAULT 0,
  completed      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS sessions_user_idx ON game_sessions (user_id);

-- ─────────────────────────────────────────────
-- BATTLES
-- One row per individual matchup. Stores the ELO
-- snapshots before/after so we can replay or audit
-- any battle. Powers the SwipeReplay component.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS battles (
  id                  SERIAL PRIMARY KEY,
  session_id          UUID NOT NULL REFERENCES game_sessions (id) ON DELETE CASCADE,
  user_id             INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  winner_song_id      INTEGER NOT NULL REFERENCES songs (id),
  loser_song_id       INTEGER NOT NULL REFERENCES songs (id),
  winner_elo_before   REAL NOT NULL,
  loser_elo_before    REAL NOT NULL,
  winner_elo_after    REAL NOT NULL,
  loser_elo_after     REAL NOT NULL,
  round_number        INTEGER NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS battles_session_idx ON battles (session_id);
CREATE INDEX IF NOT EXISTS battles_user_idx    ON battles (user_id);
