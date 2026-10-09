---
title: "messages.yml mẫu của DotMan"
description: "File messages.yml mặc định của DotMan: toàn bộ tin nhắn plugin gửi cho người chơi, có thể tùy chỉnh theo ý bạn."
---

<!-- File này được sinh tự động bởi scripts/sync-config-mau.mjs, không sửa tay -->

# messages.yml

Toàn bộ tin nhắn plugin gửi cho người chơi.

Hướng dẫn chi tiết: [Tin nhắn](/huong-dan/cau-hinh-chung#tin-nhan-messages-yml).

::: code-group

```yaml [messages.yml]
input-cancel: '&aNhập &c&lHUY &ađể hủy nạp thẻ.'
input-canceled: '&aBạn đã hủy nạp thẻ.'
input-seri: '&aHãy nhập &esố seri &athẻ vào khung chat.'
input-pin: '&aHãy nhập &bmã thẻ &avào khung chat.'
input-anvil-seri: 'Nhập số seri'
input-anvil-pin: 'Nhập mã thẻ'
input-anvil-click: 'Click để nhập'

card-charging:
  - '&eThẻ &a%CARD_TYPE% &emệnh giá &a%CARD_PRICE% VNĐ'
  - '&eSố seri: &a%SERI%'
  - '&eMã thẻ: &a%CODE%'
  - '%PREFIX% &eĐang tiến hành nạp thẻ...'

card-charged-successfully:
  - '%PREFIX% &aNạp thẻ thành công.'
  - '&aBạn nhận được &e%AMOUNT% %POINT_UNIT% &atừ thẻ nạp.'

card-charged-with-extra: '&aBạn được khuyến mãi thêm &b&l%RATE%% &agiá trị nạp.'
card-charged-with-extra-planned: '&aNhân dịp %EXTRA_NAME%&a, bạn được khuyến mãi thêm &b&l%RATE%% &agiá trị nạp.'

card-charged-sent:
  - '%PREFIX% &aThẻ của bạn đang được xử lý, hãy đợi trong giây lát.'

card-charged-announce:
  - '%PREFIX% &aNgười chơi &b%PLAYER% &ađã nạp thẻ mệnh giá &e%CARD_PRICE% VNĐ &avà nhận được &e%AMOUNT% %POINT_UNIT%'

card-charged-failed:
  - '%PREFIX% &cNạp thẻ thất bại: %ERROR%'
  - '&cVui lòng liên hệ với admin để được hỗ trợ.'

card-charged-error:
  - '%PREFIX% &cCó lỗi xảy ra khi nạp thẻ.'
  - '&cVui lòng liên hệ với admin để được hỗ trợ.'

card-cooldown: '&cVui lòng chờ %COOLDOWN% giây trước khi gửi thẻ cào mới.'
card-submit-banned: '&cBạn tạm thời không thể nạp thẻ cào do gửi thẻ lỗi 3 lần liên tiếp, hãy chờ &e%COOLDOWN% giây &choặc nạp qua ngân hàng &e(/bank)&c.'
card-locked: '&cHệ thống nạp thẻ đang tạm khóa để bảo trì, vui lòng liên hệ admin hoặc nạp qua ngân hàng &e(/bank)&c.'

ui-no-annoucement: '&eKhông có thông báo. \n Dùng lệnh &a/dotman thongbao &eđể thay đổi thông báo.'
ui-no-banking-location: '&cHiện tại chưa có hướng dẫn chuyển khoản. Hãy liên hệ Admin bổ sung nhé.'

error-unknown: '&cLỗi không xác định.'
error-unknown-card-type: '&cLoại thẻ không hợp lệ hoặc đang bảo trì.'
error-unknown-card-price: '&cMệnh giá thẻ không hợp lệ.'
error-seri-too-long: '&cSố seri quá dài, tối đa 20 kí tự.'
error-pin-too-long: '&cMã thẻ quá dài, tối đa 20 kí tự.'

log-output: '&a%ORDER%. &b%PLAYER% &d%CARD_TYPE%(%CARD_PRICE% VNĐ) &anhận &e%POINTS_RECEIVED% %POINT_UNIT% &angày &e%DATE%'
transaction-id-details-output:
  - '&aMã giao dịch: &e&l%TRANSACTION_ID%'
  - '・&aNgười chơi: &e%PLAYER%'
  - '・&aLoại thẻ: &e%CARD_TYPE%(%CARD_PRICE% VNĐ)'
  - '・&aNhận được: &e%POINTS_RECEIVED% %POINT_UNIT%'
  - '・&aServer nạp: &e%SERVER%'
  - '・&aNgày: &e%DATE%'

update-available: '%PREFIX% &aĐã có phiên bản mới: &e%NEW_VERSION% &a(phiên bản hiện tại &e%CURRENT_VERSION%&a).'
update-available-link: '&aTải về tại: &e%URL%'
update-latest: '%PREFIX% &aBạn đang sử dụng phiên bản mới nhất.'

point-added: '&aĐã cộng &e%AMOUNT% %POINT_UNIT% &acho &e%PLAYER_NAME%&a.'

bank-disabled: '&cServer hiện chưa hỗ trợ nạp qua ngân hàng hoặc ngân hàng đang bảo trì.'
bank-already-handling: '&cBạn đang có một giao dịch đang chờ xử lý, không thể tạo thêm giao dịch mới.'
bank-command-usage: '&eCú pháp lệnh: &a/bank <số tiền> &ehoặc &a/bank cancel &e- Huỷ giao dịch ngân hàng đang chờ'
bank-when-donate: '&eKhi nạp qua ngân hàng, cứ mỗi 1000 VNĐ sẽ nhận được %POINT% %POINT_UNIT%'
bank-extra: '&eHôm nay nếu nạp qua ngân hàng, bạn sẽ được thêm &d&l%PERCENT%% &egiá trị nạp.'
bank-invalid-amount: '&cSố tiền không hợp lệ'
bank-minimum-amount: '&cSố tiền nạp tối thiểu là %MIN_AMOUNT% VNĐ'
bank-multiple-of-1000: '&cSố tiền nạp phải là bội số của 1000'
bank-hand-occupied: '&cTay chính của bạn cần rảnh để cầm mã QR.'
bank-qr-creation: '&fĐang tạo mã QR...'
bank-details:
  - '&r'
  - '%PREFIX% &f&lTHÔNG TIN CHUYỂN KHOẢN'
  - '&8┃ &7Ngân hàng: &f%BANK_NAME%'
  - '&8┃ &7Số tài khoản: &e&l%ACCOUNT%'
  - '&8┃ &7Chủ tài khoản: &f%ACCOUNT_NAME%'
  - '&8┃ &7Số tiền: &a&l%AMOUNT% VNĐ'
  - '&8┃ &7Nội dung CK: &6&l%TRANSACTION_KEY%'
  - '&r'
  - '&7Quét mã QR trên tay bằng app ngân hàng. Hết hạn sau &f%EXPIRY%&7.'
  - '&7Nạp nhầm hoặc chưa nhận được %POINT_UNIT%? Hãy liên hệ admin.'
bank-payos-checkout-url: '&7Không quét được QR? Mở link: &b%CHECKOUT_URL%'
bank-error-occurred: '&cCó lỗi xảy ra, vui lòng thử lại sau.'
bank-qr-cancel: '§cBạn đã hủy yêu cầu giao dịch ngân hàng!'
bank-qr-expired: '§cMã QR đã hết hạn'
bank-pending-resume: '&eBạn đang có giao dịch ngân hàng (%AMOUNT%đ) đang chờ, dùng lệnh /bank resume để tiếp tục hoặc /bank cancel để hủy.'
bank-cooldown: '&cVui lòng chờ %COOLDOWN% giây trước khi tạo giao dịch ngân hàng mới.'
bank-no-active-transaction: '§cBạn không có giao dịch ngân hàng nào đang chờ xử lý.'
bank-successful-transaction: '§aNạp thành công %AMOUNT% VNĐ, bạn nhận được %POINT% %POINT_UNIT%.'

# Phân trang dùng chung cho các lệnh người chơi.
# %FIRST% %PREV% %NEXT% %LAST% là nút click được; nút không có đích (đang ở trang đầu/cuối)
# hiện bằng bản -disabled và không click được.
pagination-template: '%FIRST% %PREV% &eTrang %PAGE%/%MAX_PAGE% %NEXT% %LAST%'
pagination-first: '&a&l«'
pagination-prev: '&a&l‹'
pagination-next: '&a&l›'
pagination-last: '&a&l»'
pagination-first-disabled: '&8&l«'
pagination-prev-disabled: '&8&l‹'
pagination-next-disabled: '&8&l›'
pagination-last-disabled: '&8&l»'
# Hover của từng nút; có thể dùng %PAGE% để hiện số trang đích
pagination-first-hover: '&7Trang đầu'
pagination-prev-hover: '&7Trang trước'
pagination-next-hover: '&7Trang sau'
pagination-last-hover: '&7Trang cuối'

# Định dạng khoảng thời gian, dùng cho %REMAINING%/%DURATION% ở các tính năng khuyến mãi
duration-day: '%N% ngày'
duration-hour: '%N% giờ'
duration-minute: '%N% phút'
duration-now: 'dưới 1 phút'
# Ngăn cách giữa 2 đơn vị, ví dụ "1 ngày, 5 giờ"
duration-separator: ', '

# Lệnh /khuyenmai - danh sách khuyến mãi đang và sắp diễn ra
khuyenmai-usage: '%PREFIX% &cCách dùng: &f/khuyenmai [trang]'
khuyenmai-empty: '%PREFIX% &cHiện chưa có chương trình khuyến mãi nào.'
khuyenmai-header: '%PREFIX% &e&lKhuyến mãi nạp thẻ &7(%PAGE%/%MAX_PAGE%)'

# Mỗi khuyến mãi. %STATUS% là khuyenmai-status-*, %REPEAT% là khuyenmai-repeat hoặc rỗng,
# %APPLIED_TAG% là khuyenmai-applied-tag khi đây là khuyến mãi đang thực sự được áp dụng (nhiều khuyến mãi
# active cùng lúc thì chỉ khuyến mãi tỉ lệ cao nhất mới có tag này), còn lại rỗng.
# %TIME_NOTE% là khuyenmai-note-* (còn bao lâu / bắt đầu sau bao lâu), rỗng khi không xác định được mốc
khuyenmai-entry:
  - ''
  - '%STATUS%%APPLIED_TAG% &f%NAME% %REPEAT%'
  - '  &8├ &b&l+%RATE%% &7giá trị nạp %TIME_NOTE%'
  - '  &8└ &f%FROM% &7→ &f%TO%'
  - ''

khuyenmai-status-active: '&a●'
khuyenmai-status-upcoming: '&e○'
khuyenmai-repeat: '&9(lặp lại)'
khuyenmai-applied-tag: ' &6&l★'
khuyenmai-note-active: '&8· &acòn %DURATION%'
khuyenmai-note-upcoming: '&8· &ebắt đầu sau %DURATION%'
khuyenmai-time-unknown: 'Hiện tại'
```

:::
