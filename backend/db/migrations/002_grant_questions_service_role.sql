-- Let the backend's secret key (service_role) use the questions table.
-- This project does not grant privileges on new tables automatically.
-- anon and authenticated are intentionally not granted anything.

grant select, insert, update, delete on public.questions to service_role;
grant usage, select on sequence public.questions_id_seq to service_role;
