CREATE TABLE jwt_tokens (
    token TEXT NOT NULL,
    expiration TIMESTAMP,
    data JSONB
);