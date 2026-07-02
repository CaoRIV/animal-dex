# Guide Làm Việc Cho Dự Án AnimalDex

File này dùng để phân chia rõ phần nào xử lý ở khung chat nào, và phần nào can thiệp trực tiếp trong thư mục dự án.

## 1. Khung Chat Model

Các phần liên quan đến training model, dataset và đánh giá model sẽ được viết, trao đổi và hoàn thiện tại **khung chat model**.

Bao gồm:

- Chuẩn bị dataset trên Kaggle.
- Kiểm tra cấu trúc dataset.
- Đếm số lượng ảnh theo từng loài.
- Kiểm tra ảnh lỗi, ảnh quá nhỏ, ảnh bị hỏng.
- Chia dữ liệu thành train/validation/test.
- Viết notebook training model.
- Train model bằng EfficientNetB0 transfer learning.
- Fine-tune model.
- Theo dõi accuracy, validation loss.
- Tạo confusion matrix.
- Test model với ảnh trong test set.
- Test model với ảnh ngoài đời.
- Kiểm tra top-3 predictions.
- Đặt ngưỡng confidence.
- Xuất các file model:
  - `animal_model.keras`
  - `class_indices.json`
  - `model_metrics.json`
  - `confusion_matrix.png`

Không chỉnh sửa code backend/frontend trong khung chat model, trừ khi cần ghi chú yêu cầu tích hợp cho app.

## 2. Thư Mục Dự Án

Các phần code backend và frontend sẽ được can thiệp trực tiếp tại thư mục dự án:

```text
D:\AnimalDex
```

Bao gồm:

- Code frontend Next.js.
- Code backend FastAPI.
- Cấu trúc thư mục dự án.
- File cấu hình môi trường mẫu.
- API client ở frontend.
- Supabase client.
- Route đăng nhập, đăng ký, đăng xuất.
- Trang upload ảnh.
- Trang hiển thị kết quả nhận diện.
- Trang collection.
- Trang profile/statistics.
- Backend API:
  - `POST /predict`
  - `POST /collection`
  - `GET /collection`
  - `DELETE /collection/{id}`
- Logic validate Supabase JWT.
- Logic upload ảnh lên Supabase Storage.
- Logic lưu và đọc dữ liệu từ bảng `collections`.
- README và tài liệu kỹ thuật trong repo.

Khi làm việc với code, ưu tiên chỉnh sửa file trong thư mục này và giữ phạm vi thay đổi đúng với yêu cầu hiện tại.

## 3. Khung Chat Setup

Các phần setup, cấu hình dịch vụ và hướng dẫn thao tác bên ngoài code sẽ hiển thị ở **khung chat setup**.

Bao gồm:

- Tạo Supabase project.
- Bật Supabase Auth email/password.
- Tạo Supabase Storage bucket `animal-uploads`.
- Tạo bảng `collections`.
- Bật Row Level Security.
- Viết SQL policy cho Supabase.
- Tạo và quản lý environment variables.
- Cấu hình local `.env`.
- Cấu hình deploy frontend trên Vercel.
- Cấu hình deploy backend trên Render hoặc Railway.
- Kiểm tra kết nối giữa frontend, backend và Supabase.
- Hướng dẫn chạy app local.
- Hướng dẫn test flow public sau deploy.

Các giá trị bí mật như Supabase service key, access token hoặc mật khẩu không nên commit vào repo.

## Quy Tắc Chung

- Training model và đánh giá model: làm tại **khung chat model**.
- Setup dịch vụ, database, deploy, biến môi trường: làm tại **khung chat setup**.
- Code backend/frontend và tài liệu trong repo: làm tại thư mục **`D:\AnimalDex`**.
- Nếu một việc liên quan nhiều phần, ghi rõ đầu ra cần chuyển sang phần tiếp theo.
- Không đưa secret thật vào code hoặc tài liệu commit.
