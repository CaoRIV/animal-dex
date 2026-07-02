# AnimalDex Supabase Setup

Làm theo thứ tự này trong Supabase Dashboard.

## 1. Tạo project

1. Tạo Supabase project mới.
2. Vào **Project Settings > API** và ghi lại:
   - Project URL
   - anon public key
   - service_role key
3. Không commit service_role key vào Git.

## 2. Bật email/password Auth

1. Vào **Authentication > Providers**.
2. Bật **Email**.
3. Cho phiên bản đầu, có thể tắt email confirmation để test local nhanh hơn.

## 3. Tạo Storage bucket

1. Vào **Storage**.
2. Tạo bucket tên `animal-uploads`.
3. Để bucket private cho an toàn.
4. Backend sẽ upload ảnh bằng service role key và lưu `image_path` vào bảng `collections`.
5. Khi frontend cần xem ảnh, backend tạo signed URL tạm thời từ `image_path`.

## 4. Tạo database schema

1. Vào **SQL Editor**.
2. Chạy file [`schema.sql`](./schema.sql).
3. Kiểm tra bảng `public.collections` đã bật RLS.

## 5. Biến môi trường cần lấy

Dùng các giá trị lấy từ Supabase để điền vào file local:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_BASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

File `.env.example` ở root chỉ là mẫu, không chứa secret thật.
