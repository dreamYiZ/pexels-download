

---

# Download Pexels Photo

下载Pexels图片文件

## Setup

1. 将 `PEXEL_API_KEY` 放入环境变量中：
   ```bash
   export PEXEL_API_KEY=your_api_key_here
   ```

## Install

首先，你需要安装依赖：
```bash
npm i
```

## Run

你可以使用以下命令运行程序并下载指定关键词的Pexels图片：

```bash
npm run dev cat
```
或
```bash
npm run dev [keyword]
```
将 `[keyword]` 替换为你想要搜索的关键字。

## Configuration

你可以在`config`文件中写入配置。需要注意的是，环境变量与命令行参数的优先级更高。

### 配置示例

在`config`文件中，你可以添加如下配置：
```json
{
  "api_key": "your_api_key_here",
  "default_keyword": "cat",
  "output_directory": "./downloads"
}
```

### 运行示例

1. 使用环境变量设置API密钥并运行程序：
   ```bash
   export PEXEL_API_KEY=your_api_key_here
   npm run dev dog
   ```

2. 使用命令行参数设置关键词：
   ```bash
   npm run dev bird
   ```

3. 使用配置文件设置默认关键词并运行程序：
   ```bash
   npm run dev
   ```

---

希望这些改进能够帮助你更好地使用这个脚本。如果你有任何问题或需要进一步的帮助，随时告诉我！