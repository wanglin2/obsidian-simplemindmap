# File Naming Format Description

In addition to fixed names, variables can also be used, enclosed in `{}`. The available variables are as follows:

1. `{notename}`: The filename of the current file, without the extension;

2. `{date}`: The current date, formatted as `YYYY-MM-DD`;

3. `{time}`: The current time, formatted as `HH:mm:ss`;

4. `{datatime}`: The current date and time, formatted as: `YYYY-MM-DD HH:mm:ss`;

5. `{date:Format}`: Specify a custom date and time format, e.g., `MM-DD HH:mm`. For reference, see: [Format Description](https://day.js.org/docs/en/parse/string-format);

6. `{random}`: A random string, 6 characters in length;