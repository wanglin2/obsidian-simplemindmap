# 文件名格式说明

除了固定名称外，也可以使用变量，用 `{}` 括起来，可用变量如下：

1.`{notename}`：当前文件的文件名，不包含扩展名；

2.`{date}`：当前日期，格式为 `YYYY-MM-DD`；

3.`{time}`：当前时间，格式为 `HH:mm:ss`；

4.`{datatime}`：当前日期时间，格式为：`YYYY-MM-DD HH:mm:ss`；

5.`{date:Format}`：指定日期时间格式，比如：`MM-DD HH:mm`，可参考：[格式说明](https://day.js.org/docs/en/parse/string-format)；

6.`{random}`：随机字符串，长度为 6 位；