---
title: "File giao diện menu mẫu của DotMan"
description: "Các file giao diện menu/*.yml mặc định của DotMan: menu nạp thẻ cào (chọn loại thẻ, mệnh giá) và menu top nạp."
---

<!-- File này được sinh tự động bởi scripts/sync-config-mau.mjs, không sửa tay -->

# menu/*.yml

Giao diện nạp thẻ và giao diện top nạp.

Hướng dẫn chi tiết: [Giao diện nạp thẻ](/docs/nap-tien/the-cao#giao-dien-nap-the).

::: code-group

```yaml [menu/napthe/loaithe.yml]
# Tên giao diện nạp thẻ
name: "&e&lNạp thẻ"
# Số hàng của giao diện (tối đa 6)
rows: 3

# Tô nền cho Menu
# Nền sẽ được fill trước tiên, các button khác sẽ được đặt lên nền
background:
  icon:
    type: BLACK_STAINED_GLASS_PANE
  # với button fill, số hàng phải bằng số hàng của giao diện (rows), số cột phải là 9
  # các vị trí đánh dấu bằng 'x' sẽ được fill
  fill:
    - 'xxxxxxxxx'
    - 'xxxxxxxxx'
    - 'xxxxxxxxx'

# Button: Đóng Menu
close:
  icon:
    type: BARRIER
    data: 0
  name: "&c&lĐóng lại"
  lore:
    - "&7Nhấn để đóng lại"
  slot: 2

# Button: Thông báo
# Sử dụng lệnh /dotman thongbao để thay đổi thông báo
info:
  icon:
    type: SIGN
    data: 0
  name: "&e&lThông tin"
  slot: 4

# Button: Khuyến khích nạp qua chuyển khoản
# Khi click vào sẽ teleport người chơi đến vị trí mong muốn (ví dụ: QR code)
banking-recommend:
  icon:
    type: EMERALD
    data: 0
  name: "&a&lKhuyến khích nạp qua chuyển khoản"
  lore:
    - "&7Nhấn để nạp qua chuyển khoản"
  slot: 6

# Danh sách các loại thẻ
cards:
  active:
    glow: true
    icon:
      type: PAPER
      data: 0
    name: "&a&l%CARD_TYPE%"
    lore:
      - "&7Nhấn để tiến hành nạp thẻ %CARD_TYPE%"
  disabled:
    icon:
      type: PAPER
      data: 0
    name: "&c&l%CARD_TYPE% &e(tạm bảo trì)"
    lore:
      - "&7Loại thẻ này đang bảo trì"
      - "&7Nếu cần nạp hãy liên hệ Admin"
  blank:
    icon:
      type: RED_STAINED_GLASS_PANE
  # các loại thẻ sẽ được fill lên các vị trí đánh dấu bằng 'x'
  fill:
    - '         '
    - ' xxxxxxx '
    - '  xxxxx  '
```

```yaml [menu/napthe/menhgia.yml]
# Tên giao diện
name: "&e&lChọn mệnh giá"
# Số hàng của giao diện (tối đa 6)
rows: 2

# Tô nền cho Menu
# Nền sẽ được fill trước tiên, các button khác sẽ được đặt lên nền
background:
  icon:
    type: BLACK_STAINED_GLASS_PANE
  # với button fill, số hàng phải bằng số hàng của giao diện (rows), số cột phải là 9
  # các vị trí đánh dấu bằng 'x' sẽ được fill
  fill:
    - 'xxxxxxxxx'
    - 'xxxxxxxxx'

# Button: Quay lại menu chọn loại thẻ
close:
  icon:
    type: BARRIER
    data: 0
  name: "&c&lQuay lại"
  lore:
    - "&7Nhấn để quay lại menu chọn loại thẻ"
  slot: 13

# Danh sách các mệnh giá
prices:
  icon:
    type: PAPER
    data: 0
  name: "&a&lMệnh giá %PRICE% VNĐ"
  lore:
    - "&7Nhấn để tiến hành nạp thẻ %CARD_TYPE% mệnh giá %PRICE% VNĐ"
    - "&cLưu ý: Nhập sai mệnh giá sẽ khiến thẻ bị mất!"
  fill:
    - 'xxxxxxxxx'
    - '         '
```

```yaml [menu/top.yml]
# Config giao diện top nạp

# Giao diện cho người chơi sử dụng Java Edition
java:
  title: '&2Top nạp'

  # Tiêu đề cho các thứ hạng top 1, 2, 3 và các thứ hạng khác
  ranktitle:
    1st: '&e1. %PLAYER%'
    2nd: '&b2. %PLAYER%'
    3rd: '&b3. %PLAYER%'
    others: '&a%RANK%. %PLAYER%'
  description: # Mô tả cho top nạp
    topnap: # Top nạp thẻ
      - '&f'
      - '&7Đã nạp: &e%VALUE% VNĐ'

  # Thiết lập giao diện top nạp
  ui:
    rows: 5 # Số hàng của giao diện (tối đa 6)
    # Tô nền cho Menu
    # Nền sẽ được fill trước tiên, các button khác sẽ được đặt đè lên nền
    background:
      icon:
        type: STAINED_GLASS_PANE
        data: 4 # yellow
      # với button fill, số hàng phải bằng số hàng của giao diện (rows), số cột phải là 9
      # các vị trí đánh dấu bằng 'x' sẽ được fill
      fill:
        - 'xxxxxxxxx'
        - 'xxxxxxxxx'
        - 'xxxxxxxxx'
        - 'xxxxxxxxx'
        - 'xxxxxxxxx'

    # Layout cho trang đầu, các xếp hạng sẽ được xếp vào dấu x
    # Mặc định layout là bậc tam cấp
    first-page-layout:
      - '    x    '
      - '   x x   '
      - 'xxxxxxxxx'
      - 'xxxxxxxxx'
    # Layout cho các trang tiếp theo
    other-page-layout:
      - '         '
      - 'xxxxxxxxx'
      - 'xxxxxxxxx'
      - 'xxxxxxxxx'

    # Thiết kế cho nút trang trước, trang sau
    previous-page:
      icon:
        type: ARROW
        data: 0
      name: "&e<< Trang trước"
      slot: 36
    next-page:
      icon:
        type: ARROW
        data: 0
      name: "&eTrang sau >>"
      slot: 44

    # Thiết kế cho nút đóng menu
    close:
      icon:
        type: BARRIER
        data: 0
      name: "&cĐóng lại"
      lore:
        - "&7Nhấn để đóng lại"
      slot: 40

# Giao diện cho người chơi sử dụng Bedrock Edition
bedrock:
  title: '&2Top nạp'

  # Tiêu đề cho các thứ hạng top 1, 2, 3 và các thứ hạng khác
  ranktitle:
    1st: '&n&l1. %PLAYER%&r' # Thêm &r vì &l chạy từ %PLAYER% đến xuống tận lore Đã nạp
    2nd: '&n&l2. %PLAYER%&r'
    3rd: '&n&l3. %PLAYER%&r'
    others: '&3%RANK%. %PLAYER%'
  description: # Mô tả cho top nạp
    topnap: '&8Đã nạp: &2&l%VALUE% VNĐ'
```

:::
