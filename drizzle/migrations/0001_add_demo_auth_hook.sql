CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
  DECLARE
    claims jsonb;
    user_is_demo boolean;
  BEGIN
    claims := event->'claims';

    -- 1. Check if the demo flag was passed in metadata
    user_is_demo := (event->'raw_user_meta_data'->>'is_demo')::boolean;

    IF user_is_demo IS TRUE THEN
      -- 2. Ensure app_metadata exists in claims to avoid null errors
      IF (claims->'app_metadata') IS NULL THEN
        claims := jsonb_set(claims, '{app_metadata}', '{}');
      END IF;

      -- 3. Set the scope inside app_metadata
      -- The '{app_metadata, scope}' path creates: {"app_metadata": {"scope": "demo"}}
      claims := jsonb_set(claims, '{app_metadata, scope}', '"demo"');
    END IF;

    RETURN jsonb_build_object('claims', claims);
  END;
$$;
