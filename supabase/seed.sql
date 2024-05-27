-- TABLES ---
-- DROP TABLE public.notes;
CREATE TABLE public.notes (
	id int8 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
	user_id uuid DEFAULT auth.uid() NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	"text" text NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT notes_pkey PRIMARY KEY (id),
	CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
);


-- DROP TABLE public.profiles;
CREATE TABLE public.profiles (
	updated_at timestamptz DEFAULT now() NOT NULL,
	username text NOT NULL,
	full_name text NULL,
	avatar_url text NULL,
	website text NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	user_id uuid DEFAULT auth.uid() NOT NULL,
	id int8 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
	CONSTRAINT profiles_pkey PRIMARY KEY (user_id),
	CONSTRAINT profiles_username_key UNIQUE (username),
	CONSTRAINT username_length CHECK ((char_length(username) >= 3)),
	CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Row Level Security Policies ---
ALTER TABLE public.notes enable row level security;
ALTER TABLE public.profiles enable row level security;

-- Policies ---
-- public.notes
CREATE POLICY "Authenticated Users can CREATE notes" ON public.notes TO authenticated with CHECK ( ((SELECT auth.uid() AS uid) = user_id) ); 
CREATE POLICY "Authenticated Users can READ other Authenticated Users' notes" ON public.notes TO authenticated using (true);
CREATE POLICY "Authenticated Users can only UPDATE notes they wrote" ON public.notes TO authenticated using ( (( SELECT auth.uid() AS uid) = user_id) );
CREATE POLICY "Authenticated Users can only DELETE notes they wrote" ON public.notes TO authenticated using ( (( SELECT auth.uid() AS uid) = user_id) );

-- public.profiles
-- CREATE POLICY "Everyone can CREATE a profile" ON public.profiles TO public with CHECK (true); -- This policy is not needed for the Noted app, but it's here for demonstration purposes
CREATE POLICY "Authenticated Users can READ other Authenticated Users' Profile" ON public.profiles TO authenticated using (true);
CREATE POLICY "Authenticated Users can only UPDATE their own profile" ON public.profiles TO authenticated using ( (( SELECT auth.uid() AS uid) = user_id) );

-- Users can't delete their profile - must be done through the dashboard (basically contacting the admin) 
-- CREATE POLICY "Authenticated Users can only DELETE their own profile" ON public.profiles TO authenticated using ( (( SELECT auth.uid() AS uid) = user_id) ); -- This policy is not needed for the Noted app, but it's here for demonstration purposes

-- Functions ---
-- DROP FUNCTION public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $function$
begin
    insert into public.profiles (
        user_id,
        username,
        full_name,
        avatar_url,
        website
    )
    values (
        new.id, 
        new.raw_user_meta_data ->> 'username', 
        new.raw_user_meta_data ->> 'full_name', 
        new.raw_user_meta_data ->> 'avatar_url',
        new.raw_user_meta_data ->> 'website'
    );
    return new;
end;
$function$
;

--- Triggers ---
-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();