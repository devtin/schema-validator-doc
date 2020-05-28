# AddressSchema

| Name | Type | Required | Default | Settings |
| :--- | :--- | : --- | : --- | :--- |
| state | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |  | Florida | -- |
| line1 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | * |  | -- |
| line2 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |  |  | -- |
| zip | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |  |  | -- |

# UserSchema

| Name | Type | Required | Default | Settings |
| :--- | :--- | : --- | : --- | :--- |
| name | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | * |  | -- |
| birthday | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | * |  | -- |
| address | [AddressSchema](#AddressSchema) |  |  | -- |
| created | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) |  | `<now>` | -- |
| phone.home | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | * |  | minlength: 8 |
| phone.mobile | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | * |  | minlength: 11 |
