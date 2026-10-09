---
title: Tính toán point
description: Tính thử số point người chơi nhận được khi nạp thẻ cào, chuyển khoản hoặc nạp thủ công.
---

# Tính toán point

Nhập số tiền nạp để xem người chơi nhận được bao nhiêu point theo từng phương thức nạp. Cách tính giống lệnh [`/dotman testpoint`](/tham-khao/danh-sach-lenh-va-permission#dotman-testpoint) trong game.

- Mặc định dùng giá trị trong file config mẫu, mở **Cấu hình nâng cao** để nhập theo cấu hình server của bạn.
- Kết quả chỉ để tham khảo, không cộng point thật.

<PointCalculator />

## Công thức

| Phương thức | Công thức |
|-------------|-----------|
| Thẻ cào | `point theo mệnh giá + point theo mệnh giá × tỉ lệ khuyến mãi` |
| Chuyển khoản | `(số tiền / 1000) × (point-base + point-extra + point-base × tỉ lệ khuyến mãi)` |
| Nạp thủ công | `(số tiền / 1000) × (point-base + point-extra + point-base × tỉ lệ khuyến mãi)` |

- **Point theo mệnh giá:** mục `donate-amounts` trong `config.yml`.
- **`point-base`:** số point tiêu chuẩn trên mỗi 1000đ, dùng để tính khuyến mãi.
- **`point-extra`:** số point nhận thêm trên mỗi 1000đ, **không** được nhân khuyến mãi.
  - Chuyển khoản: đặt trong `banking.yml`.
  - Nạp thủ công: đặt trong mục `manual` của `config.yml`.
- **Tỉ lệ khuyến mãi:** khuyến mãi đang áp dụng theo [lịch khuyến mãi](/khuyen-mai/lich-khuyen-mai).
  - Với thẻ cào và chuyển khoản, lần nạp đầu được cộng thêm tỉ lệ [khuyến mãi nạp lần đầu](/khuyen-mai/nap-lan-dau).
- Kết quả được làm tròn xuống số nguyên.

::: tip Vì sao chuyển khoản nhận nhiều point hơn thẻ cào?
Với config mặc định (`point-base: 1`, `point-extra: 0.5`), mỗi 1000đ chuyển khoản nhận 1,5 point, tức nhiều hơn thẻ cào cùng số tiền 50%.

- Nạp 10.000đ qua chuyển khoản, không khuyến mãi, không phải lần đầu: nhận **15 point**.
- Nạp thẻ 10.000đ cùng điều kiện: nhận **10 point** (theo `donate-amounts` mặc định).

Muốn chuyển khoản nhận bằng thẻ cào, đặt `point-extra: 0` trong `banking.yml`.
:::

## Ví dụ

Các ví dụ dưới đây dùng config mặc định:

- Thẻ cào: `donate-amounts` mặc định, 1000đ = 1 point.
- Chuyển khoản và nạp thủ công: `point-base: 1`, `point-extra: 0.5`.

### Không có khuyến mãi

Nạp 100.000đ:

| Phương thức | Cách tính | Point nhận |
|-------------|-----------|-----------:|
| Thẻ cào | `100 + 100 × 0` | **100** |
| Chuyển khoản | `100 × (1 + 0.5 + 1 × 0)` | **150** |
| Nạp thủ công | `100 × (1 + 0.5 + 1 × 0)` | **150** |

### Đang có khuyến mãi 50%

Nạp 100.000đ, đang có khuyến mãi `rate: 0.5`:

| Phương thức | Cách tính | Point nhận |
|-------------|-----------|-----------:|
| Thẻ cào | `100 + 100 × 0.5` | **150** |
| Chuyển khoản | `100 × (1 + 0.5 + 1 × 0.5)` | **200** |
| Nạp thủ công | `100 × (1 + 0.5 + 1 × 0.5)` | **200** |

### Khuyến mãi 50% và nạp lần đầu 100%

Nạp 100.000đ lần đầu tiên, đang có khuyến mãi `rate: 0.5`, `first-donate.extra-rate: 1.0`. Tỉ lệ khuyến mãi được cộng dồn thành `1.5`:

| Phương thức | Cách tính | Point nhận |
|-------------|-----------|-----------:|
| Thẻ cào | `100 + 100 × 1.5` | **250** |
| Chuyển khoản | `100 × (1 + 0.5 + 1 × 1.5)` | **300** |
| Nạp thủ công | Không áp dụng nạp lần đầu: `100 × (1 + 0.5 + 1 × 0.5)` | **200** |
