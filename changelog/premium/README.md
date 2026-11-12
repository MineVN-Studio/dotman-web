# Changelog DotMan Premium

Mỗi phiên bản là một file `.md` trong thư mục này, hiển thị tại trang `/docs/releases/premium`.

## Thêm một phiên bản

- Tạo file mới, đặt tên theo phiên bản, ví dụ `1.2.3.md` hoặc `1.3.0-beta.1.md`.
- Commit và push lên `main`, web tự deploy lại.
  - Không cần chờ đồng bộ hằng ngày như bản miễn phí.

## Định dạng file

```md
---
version: 1.2.3
date: 12/11/2026
channel: stable
title: Tên phiên bản, có thể bỏ
---

## Tính năng mới

- Thêm A.
- Thêm B.

## Sửa lỗi

- Sửa lỗi C.
```

## Ý nghĩa các trường

| Trường | Bắt buộc | Ý nghĩa |
| --- | --- | --- |
| `version` | Có | Số phiên bản hiển thị làm tiêu đề, không được trùng giữa các file. |
| `date` | Có | Ngày phát hành, dạng `dd/mm/yyyy` hoặc `dd-mm-yyyy`, có thể kèm giờ như `12/11/2026 14:30` (giờ Việt Nam). |
| `channel` | Không | `stable` hoặc `beta`, mặc định `stable`. |
| `title` | Không | Tên riêng của bản phát hành, hiện dưới số phiên bản. |

## Lưu ý khi viết nội dung

- Nội dung viết bằng markdown, dùng `##` cho tiêu đề nhóm, web tự hạ cấp cho khớp với tiêu đề phiên bản.
- Bản `stable` có ngày phát hành mới nhất được gắn nhãn "Mới nhất".
- Sai định dạng (thiếu `version`, `date` sai, trùng `version`...) sẽ làm build báo lỗi kèm tên file.
- File `README.md` và file bắt đầu bằng `_` bị bỏ qua, không hiển thị trên web.
