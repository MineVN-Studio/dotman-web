---
title: Lệnh thưởng khi offline
description: Lệnh thưởng phát sinh khi người chơi offline được giữ lại và chạy khi người chơi vào lại server.
---

# Lệnh thưởng khi offline <Badge type="tip" text="Premium" />

Một số giao dịch có thể hoàn tất khi người chơi đã thoát game, ví dụ tiền chuyển khoản về chậm. Các lệnh thưởng như `give`, cấp quyền... sẽ không có tác dụng nếu chạy lúc người chơi offline.

DotMan giữ các lệnh này lại trong database và chạy khi người chơi vào lại server.

## Áp dụng cho

| Nguồn lệnh | Cấu hình |
|------------|----------|
| Lệnh sau khi chuyển khoản thành công | `commands` trong [banking.yml](/docs/nap-tien/ngan-hang#lenh-sau-khi-nap) |
| Lệnh theo mức nạp tối thiểu | `minimum-donate-commands` trong [banking.yml](/docs/nap-tien/ngan-hang#lenh-theo-muc-nap-toi-thieu) |
| Lệnh nạp lần đầu | `first-donate.commands` trong [config.yml](/docs/khuyen-mai/nap-lan-dau) |
| Lệnh mốc nạp cá nhân | `commands` trong [mocnap.yml](/docs/phan-thuong/moc-nap-ca-nhan) |

Các lệnh khác vẫn chạy ngay như bình thường:

- Lệnh nạp thẻ cào (`donate-commands`): người chơi luôn online khi gửi thẻ.
- Lệnh nạp thủ công (`manual.commands`).
- Lệnh mốc nạp tổng server (`mocnaptong.yml`): không gắn với người chơi nào.
- Phần thưởng top nạp: được trao khi người chơi online, xem [Phần thưởng top nạp](/docs/phan-thuong/phan-thuong-top#thoi-diem-trao-thuong).

## Cách hoạt động

- Khi cần chạy lệnh, nếu người chơi đang online thì chạy ngay.
- Nếu người chơi offline, lệnh được lưu vào database, gắn với tên server hiện tại.
- Khi người chơi vào lại **đúng server đó**, các lệnh đang chờ được chạy lần lượt.
- Mỗi lần phát thưởng chỉ được lưu một lần, tránh phát thưởng trùng.
- Lệnh chạy lỗi được đánh dấu lỗi và lưu lại thông báo lỗi để tra cứu.

::: info Giới hạn
- Nếu server dừng đột ngột ngay sau khi chạy lệnh nhưng trước khi kịp đánh dấu, lệnh có thể chạy lại một lần.
- Thông báo nạp thành công giữ cho người chơi offline chỉ lưu trong bộ nhớ, mất khi server restart.
  - Point và lệnh thưởng không bị ảnh hưởng.
:::
