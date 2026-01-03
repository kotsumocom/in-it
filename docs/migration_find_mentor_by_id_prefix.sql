-- UUID前方一致検索用のRPC関数
-- 招待コード（ユーザーIDの最初の8文字）でメンターを検索

CREATE OR REPLACE FUNCTION find_mentor_by_id_prefix(prefix TEXT)
RETURNS TABLE(id UUID)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id
  FROM mentor_profiles
  WHERE id::text ILIKE prefix || '%'
  LIMIT 1;
$$;
