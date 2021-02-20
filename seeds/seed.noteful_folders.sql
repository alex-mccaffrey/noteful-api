TRUNCATE  noteful_notes RESTART IDENTITY CASCADE;

INSERT INTO noteful_folders (name)
VALUES
  ('Important'),
  ('Groceries'),
  ('To-Dos'),
  ('Work');