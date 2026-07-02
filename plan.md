# Kế Hoạch Xây Dựng AnimalDex

## Summary

Xây web app **AnimalDex**: người dùng đăng nhập, upload ảnh động vật ngoài đời, AI nhận diện loài, hiển thị thông tin loài vật, rồi lưu ảnh đó vào bộ sưu tập cá nhân.

Stack chốt:
- Training: **Kaggle Notebook**
- Model: **EfficientNetB0 transfer learning**
- Frontend: **Next.js**
- Backend: **FastAPI**
- Auth/Database/Storage: **Supabase**
- Deploy sau cùng: **Vercel frontend + Render/Railway backend**

## Các Bước Làm Theo Thứ Tự

1. **Chuẩn bị dataset trên Kaggle**
   - Mở dataset Kaggle: Animal Image Dataset 90 Different Animals.
   - Tạo Kaggle Notebook mới.
   - Kiểm tra cấu trúc thư mục: mỗi folder là một loài.
   - Đếm số ảnh mỗi loài, kiểm tra ảnh lỗi, ảnh quá nhỏ, ảnh bị hỏng.
   - Chia dữ liệu thành train/validation/test, ví dụ `70/15/15`.

2. **Train model nhận diện động vật**
   - Resize ảnh về `224x224`.
   - Dùng data augmentation: flip, rotate nhẹ, zoom nhẹ, brightness nhẹ.
   - Dùng `EfficientNetB0` pretrained ImageNet.
   - Giai đoạn 1: freeze backbone, train classification head.
   - Giai đoạn 2: unfreeze một phần backbone, fine-tune nhẹ.
   - Theo dõi accuracy, validation loss, confusion matrix.
   - Xuất các file:
     - `animal_model.keras`
     - `class_indices.json`
     - `model_metrics.json`
     - `confusion_matrix.png`

3. **Đánh giá model trước khi làm app**
   - Test bằng ảnh trong test set.
   - Test thêm vài ảnh ngoài đời từ internet/điện thoại.
   - Kiểm tra top-3 predictions.
   - Đặt ngưỡng confidence:
     - `>= 70%`: hiển thị kết quả khá chắc.
     - `40% - 70%`: hiển thị “AI chưa chắc chắn”.
     - `< 40%`: hiển thị “Không đủ tự tin để nhận diện”.
   - Nếu accuracy quá thấp, train lại với ít class hơn trước, ví dụ 30-50 loài.

4. **Chuẩn bị dữ liệu thông tin loài**
   - Tạo file `species_info.json`.
   - Mỗi loài có:
     - `class_name`
     - `display_name`
     - `description`
     - `habitat`
     - `diet`
     - `animal_group`
     - `danger_level`
     - `fun_fact`
   - Ban đầu có thể viết thông tin ngắn, không cần quá học thuật.

5. **Tạo Supabase project**
   - Bật Supabase Auth bằng email/password.
   - Tạo bucket storage tên `animal-uploads`.
   - Tạo bảng `collections`:
     - `id`
     - `user_id`
     - `image_url`
     - `predicted_class`
     - `display_name`
     - `confidence`
     - `top_predictions`
     - `species_info`
     - `created_at`
   - Bật Row Level Security để user chỉ xem collection của chính mình.

6. **Xây Backend FastAPI**
   - Load model `animal_model.keras`.
   - Load `class_indices.json` và `species_info.json`.
   - Tạo API chính:
     - `POST /predict`: nhận ảnh, preprocess, predict, trả kết quả.
     - `POST /collection`: lưu kết quả vào Supabase.
     - `GET /collection`: lấy bộ sưu tập của user.
     - `DELETE /collection/{id}`: xóa một item.
   - Backend cần validate Supabase JWT từ frontend.
   - Ảnh upload sẽ lưu vào Supabase Storage, database chỉ lưu URL.

7. **Xây Frontend Next.js**
   - Trang đăng nhập/đăng ký.
   - Trang chính upload ảnh:
     - Upload hoặc chụp ảnh từ camera.
     - Preview ảnh.
     - Gọi API `/predict`.
     - Hiển thị tên loài, confidence, top-3 predictions, thông tin loài.
     - Nút “Save to Collection”.
   - Trang collection:
     - Grid ảnh đã lưu.
     - Filter theo nhóm động vật.
     - Xem chi tiết từng lần nhận diện.
   - Trang profile/statistics đơn giản:
     - Tổng số ảnh đã lưu.
     - Số loài khác nhau đã gặp.
     - Nhóm động vật xuất hiện nhiều nhất.

8. **Kết nối frontend với backend**
   - Frontend gửi ảnh đến FastAPI.
   - Frontend gửi access token Supabase trong request header.
   - Backend xác thực token rồi xử lý predict/save.
   - Kiểm tra lỗi:
     - Chưa đăng nhập.
     - Upload file không phải ảnh.
     - Ảnh quá lớn.
     - Model confidence thấp.
     - Backend không phản hồi.

9. **Hoàn thiện trải nghiệm người dùng**
   - Thêm loading state khi AI đang nhận diện.
   - Thêm warning khi confidence thấp.
   - Hiển thị top-3 kết quả thay vì chỉ một kết quả.
   - Cho phép người dùng sửa nhãn trước khi lưu nếu AI đoán sai.
   - Giao diện collection nên giống “album khám phá động vật”.

10. **Viết tài liệu project**
   - README gồm:
     - Mục tiêu dự án.
     - Dataset sử dụng.
     - Kiến trúc hệ thống.
     - Cách train model trên Kaggle.
     - Cách chạy frontend/backend local.
     - Screenshot app.
     - Kết quả model: accuracy, confusion matrix.
   - Thêm phần giới hạn:
     - Model chỉ nhận diện tốt các loài có trong dataset.
     - Ảnh mờ/xa/nhiều động vật có thể sai.
     - Không nên dùng như công cụ khoa học chính thức.

11. **Deploy**
   - Deploy frontend Next.js lên Vercel.
   - Deploy FastAPI lên Render hoặc Railway.
   - Upload model file lên backend server.
   - Cấu hình environment variables:
     - Supabase URL
     - Supabase anon key
     - Supabase service key
     - Backend API URL
   - Test toàn bộ flow trên link public.

## API Và Data Interface Chính

- `POST /predict`
  - Input: image file
  - Output: predicted class, confidence, top-3 predictions, species info

- `POST /collection`
  - Input: image URL, prediction result, species info
  - Output: saved collection item

- `GET /collection`
  - Output: list collection items của user hiện tại

- `DELETE /collection/{id}`
  - Output: delete status

## Test Plan

- Test model với ảnh rõ, ảnh mờ, ảnh nền phức tạp, ảnh không phải động vật.
- Test đăng ký, đăng nhập, đăng xuất.
- Test user A không xem được collection của user B.
- Test upload ảnh lớn và file sai định dạng.
- Test confidence thấp có cảnh báo đúng.
- Test lưu collection, xem lại collection, xóa item.
- Test deploy public: frontend gọi được backend, backend gọi được Supabase.

## Assumptions

- Phiên bản đầu tiên dùng **Next.js + FastAPI + Supabase** vì bạn chọn hướng portfolio đẹp và có đăng nhập.
- Model nhận diện chủ yếu trong phạm vi 90 loài của dataset, không đảm bảo đúng với mọi loài ngoài đời.
- Thông tin loài ban đầu lưu bằng `species_info.json`; sau này có thể chuyển sang database hoặc gọi API ngoài.
- Nếu training 90 loài cho kết quả chưa tốt, giảm scope tạm thời xuống 30-50 loài để có demo ổn trước.
