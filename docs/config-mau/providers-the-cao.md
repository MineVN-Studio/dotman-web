---
title: "File mẫu cổng gạch thẻ của DotMan"
description: "File cấu hình mẫu của từng cổng gạch thẻ trong DotMan: Card2K, TheSieuRe, GameBank, GachThe1s và GachThe5s."
---

<!-- File này được sinh tự động bởi scripts/sync-config-mau.mjs, không sửa tay -->

# providers/*.yml

API key của các cổng gạch thẻ cào.

Hướng dẫn chi tiết: [Chọn cổng gạch thẻ](/nap-tien/the-cao#chon-cong-gach-the).

::: code-group

```yaml [providers/card2k.yml]
partner-id: abc
partner-key: abc
```

```yaml [providers/thesieure.yml]
partner-id: abc
partner-key: abc
```

```yaml [providers/gamebank.yml]
merchant_id: 123
api_user: abc
api_password: abc
```

```yaml [providers/gachthe1s.yml]
partner-id: partner-id
partner-key: partner-key
```

```yaml [providers/gachthe5s.yml]
api-key: 'api-key'
```

:::
