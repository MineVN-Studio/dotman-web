---
title: Bảo mật cấu hình
description: Mã hóa API key, thông tin ngân hàng lên database và khóa cổng thanh toán, chống bị chiếm đoạt dòng tiền.
---

# Bảo mật cấu hình <Badge type="tip" text="Premium" />

Người có quyền sửa file config (ví dụ staff, nhà cung cấp hosting) có thể đổi API gạch thẻ hoặc tài khoản ngân hàng sang của họ để ăn chặn dòng tiền.

DotMan chống việc này bằng cách:

- Mã hóa API key, mật khẩu, thông tin tài khoản nhận tiền và lưu lên database.
- **Khóa** cổng gạch thẻ và cổng ngân hàng đang dùng trên database.
  - Sau khi khóa, đổi `provider` trong file không còn tác dụng.
- Chỉ người biết **mật khẩu xác minh** mới lưu được cấu hình mới lên database.

## Các bước thiết lập

1. **Kiểm tra cấu hình:** đảm bảo [nạp thẻ cào](/docs/nap-tien/the-cao) và [chuyển khoản ngân hàng](/docs/nap-tien/ngan-hang) đã chạy đúng với cấu hình trong file.
2. **Đặt mật khẩu xác minh:**

   ```
   /dotman adminpass <mật khẩu>
   ```

   - Dài 6 tới 20 ký tự, không dùng mật khẩu phổ biến như `123456`, `password`.
   - Đổi mật khẩu: `/dotman adminpass <mật khẩu cũ> <mật khẩu mới>`.

3. **Lưu cấu hình lên database:**

   ```
   /dotman configdb <mật khẩu xác minh>
   ```

   - Kết quả hiện riêng cho phần nạp thẻ và phần ngân hàng, kèm cổng thanh toán đã được khóa.
   - Nếu file thiếu thông tin, phần đó sẽ không được lưu, xem chi tiết trong console.

4. **Áp dụng:** chạy `/dotman reload` trên **tất cả** server dùng chung database.
5. **Xóa thông tin nhạy cảm khỏi file:** API key của cổng gạch thẻ, mật khẩu ngân hàng, API key của cổng ngân hàng.

::: warning Lưu ý
- Thực hiện các bước trên ở nơi an toàn, chỉ bạn có quyền truy cập.
- Hãy đặt mật khẩu xác minh càng sớm càng tốt.
  - Khi chưa có mật khẩu, bất kỳ ai có quyền `dotman.admin` đều đặt được mật khẩu lần đầu.
:::

## Sau khi bảo mật

| Thông tin | Lấy từ |
|-----------|--------|
| Cổng gạch thẻ, cổng ngân hàng đang dùng | Database |
| API key, mật khẩu, thông tin tài khoản nhận tiền | Database |
| Cách tính point, lệnh thưởng, khuyến mãi, giao diện... | File config |

- Nếu file đặt `provider` khác với cổng đã khóa, plugin bỏ qua file, vẫn chạy cổng đã khóa và báo cảnh báo trong console.
- Nếu database thiếu thông tin của cổng đã khóa (hoặc không giải mã được):
  - Chuyển khoản ngân hàng bị tắt.
  - Nạp thẻ cào bị tạm khóa, người chơi nhận tin "Hệ thống nạp thẻ đang tạm khóa".
  - Plugin vẫn chạy để bạn sửa lại bằng `/dotman configdb`.

::: warning
Cách tính point và lệnh thưởng vẫn lấy từ file.
:::

## Cập nhật thông tin

Ví dụ khi đổi mật khẩu ngân hàng hoặc API key:

1. Điền thông tin mới vào file config tương ứng.
2. Chạy `/dotman configdb <mật khẩu xác minh>`.
   - Lệnh liệt kê các mục khác với database. Mục bảo mật chỉ báo "đã đổi", không hiện giá trị.
   - Nếu có thay đổi không phải do bạn, hãy sửa lại file và chạy lại lệnh **trước khi** reload.
3. Chạy `/dotman reload`.
4. Xóa lại thông tin nhạy cảm khỏi file.

## Đổi provider khi đã khóa

Ví dụ đổi cổng ngân hàng từ MBBank sang SePay:

1. Sửa `provider: SEPAY` trong `banking.yml` rồi `/dotman reload`.
   - Plugin vẫn chạy MBBank, nhưng tạo sẵn file `providers/banking/sepay.yml`.
2. Điền đầy đủ thông tin vào `providers/banking/sepay.yml`.
3. Chạy `/dotman configdb <mật khẩu xác minh>`.
   - Kết quả có dòng cảnh báo cổng ngân hàng đổi từ `MBBANK` sang `SEPAY`.
4. Chạy `/dotman reload`.

Đổi cổng gạch thẻ làm tương tự với mục `provider` trong `config.yml` và file `providers/<cổng>.yml`.

::: danger Không phải bạn đổi?
Nếu `/dotman configdb` báo đổi provider mà bạn không chủ động đổi, có thể ai đó đã sửa file config.
Hãy chọn lại provider cũ trong file, chạy lại `/dotman configdb` rồi mới reload.
:::

## Nâng cấp từ bản cũ

Các bản DotMan cũ chỉ lưu API key, mật khẩu lên database, chưa khóa provider.

- Nếu file vẫn dùng đúng provider đã lưu, plugin chạy bình thường và nhắc chạy lại `/dotman configdb` để khóa.
- Nếu file đã đổi sang provider khác mà chưa chạy lại `/dotman configdb`, tính năng đó sẽ bị tắt cho tới khi bạn chạy `/dotman configdb`.

## Xóa cấu hình trên database

Để tránh ảnh hưởng tới các server khác dùng chung database, không thể xóa cấu hình đã lưu bằng lệnh.

Nếu cần làm lại từ đầu, hãy chuyển sang dùng một database khác, hoặc liên hệ [MineVN Studio](https://minevn.net/studio) để được hỗ trợ.
