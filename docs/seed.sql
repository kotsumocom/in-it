-- 初期シードデータ（数学）

-- 既存のシードデータを削除（再実行可能にするため）
-- 子単元を先に削除（外部キー制約のため）
DELETE FROM public.units WHERE parent_id = 'd00d0000-0000-0000-0000-000000000001';
DELETE FROM public.units WHERE id = 'd00d0000-0000-0000-0000-000000000001';

-- 1. ルート単元を作成（数学I）
INSERT INTO public.units (id, title, description, order_index, grade_category, estimated_duration, standard_month)
VALUES 
('d00d0000-0000-0000-0000-000000000001', '数学I：数と式', '多項式と実数の基礎を学ぶ', 1, 'math_1', 0, 4);

-- 2. 子単元を作成
INSERT INTO public.units (title, description, order_index, grade_category, parent_id, estimated_duration, standard_month)
VALUES 
('多項式', '多項式の加法・減法・乗法を学ぶ', 1, 'math_1', 'd00d0000-0000-0000-0000-000000000001', 15, 4),
('因数分解', '基本的な因数分解の公式を学ぶ', 2, 'math_1', 'd00d0000-0000-0000-0000-000000000001', 20, 5),
('実数', '平方根と有理化を学ぶ', 3, 'math_1', 'd00d0000-0000-0000-0000-000000000001', 15, 5);

