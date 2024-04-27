<h1 align="center">🤖 PowerKids Bot</h1>

<img align="right" alt="PowerKids Kindergarten logo" width="35%" src="https://powerkids.edu.my/images/logo.svg">

> A Telegram bot for PowerKids Kindergarten.

## Goals

- Teachers can upload pictures (from their own devices) of students and select relevant student names
- The bot will match the each selected student to their parents' Telegram ID via the school's internal registry
- Parents will receive those pictures, notified by the mobile notifs

## Usage

Follow these steps to set up and run your bot using this template:

1. **Clone New Repository**

2. **Environment Variables Setup**

    Create an environment variables file by copying the provided example file:

     ```bash
     cp .env.example .env
     ```

    Open the newly created `.env` file and set the `BOT_TOKEN` environment variable.

3. **Launching the Bot**

    You can run your bot in both development and production modes.

    **Development Mode:**

    Install the required dependencies:

    ```bash
    pnpm install
    ```

    Start the bot in watch mode (auto-reload when code changes):

    ```bash
    pnpm run dev
    ```

   **Production Mode:**

    Install only production dependencies (no development dependencies):

    ```bash
    pnpm install --only=prod
    ```

    Set the `NODE_ENV` environment variable to "production" in your `.env` file. Also, make sure to update `BOT_WEBHOOK` with the actual URL where your bot will receive updates.

    ```dotenv
    NODE_ENV=production
    BOT_WEBHOOK=<your_webhook_url>
    ```

    Start the bot in production mode:

    ```bash
    pnpm start
    # or
    pnpm run start:force # if you want to skip type checking
    ```

### List of Available Commands

- `pnpm run lint` — Lint source code.
- `pnpm run format` — Format source code.
- `pnpm run typecheck` — Run type checking.
- `pnpm run dev` — Start the bot in development mode.
- `pnpm run start` — Start the bot.
- `pnpm run start:force` — Starts the bot without type checking.

### Directory Structure

```
project-root/
  ├── locales # Localization files
  └── src
      ├── bot # Contains the code related to the bot
      │   ├── callback-data # Callback data builders
      │   ├── features      # Implementations of bot features
      │   ├── filters       # Update filters
      │   ├── handlers      # Update handlers
      │   ├── helpers       # Utility functions
      │   ├── keyboards     # Keyboard builders
      │   ├── middlewares   # Middleware functions
      │   ├── i18n.ts       # Internationalization setup
      │   ├── context.ts    # Context object definition
      │   └── index.ts      # Bot entry point
      ├── server # Contains the code related to the web server
      │   └── index.ts # Web server entry point
      ├── config.ts # Application config
      ├── logger.ts # Logging setup
      └── main.ts   # Application entry point
```

## Tech

- Framework: [grammY](https://grammy.dev/)
- Template: [bot-base/telegram-bot-template](https://github.com/bot-base/telegram-bot-template)

## Environment Variables

<table>
<thead>
  <tr>
    <th>Variable</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>NODE_ENV</td>
    <td>String</td>
    <td>Specifies the application environment. (<code>development</code> or <code>production</code>)</td>
  </tr>
  <tr>
    <td>BOT_TOKEN</td>
    <td>
        String
    </td>
    <td>
        Telegram Bot API token obtained from <a href="https://t.me/BotFather">@BotFather</a>.
    </td>
  </tr>
    <tr>
    <td>LOG_LEVEL</td>
    <td>
        String
    </td>
    <td>
        <i>Optional.</i>
        Specifies the application log level. <br/>
        For example, use <code>info</code> for general logging. View the <a href="https://github.com/pinojs/pino/blob/master/docs/api.md#level-string">Pino documentation</a> for more log level options. <br/>
        Defaults to <code>info</code>.
    </td>
  </tr>
  <tr>
    <td>BOT_MODE</td>
    <td>
        String
    </td>
    <td>
        <i>Optional.</i>
        Specifies method to receive incoming updates. (<code>polling</code> or <code>webhook</code>)
        Defaults to <code>polling</code>.
    </td>
  </tr>
  <tr>
    <td>BOT_WEBHOOK</td>
    <td>
        String
    </td>
    <td>
        <i>Optional in <code>polling</code> mode.</i>
        Webhook endpoint URL, used to configure webhook in <b>production</b> environment.
    </td>
  </tr>
  <tr>
    <td>BOT_SERVER_HOST</td>
    <td>
        String
    </td>
    <td>
        <i>Optional.</i> Specifies the server hostname. <br/>
        Defaults to <code>0.0.0.0</code>.
    </td>
  </tr>
  <tr>
    <td>BOT_SERVER_PORT</td>
    <td>
        Number
    </td>
    <td>
        <i>Optional.</i> Specifies the server port. <br/>
        Defaults to <code>80</code>.
    </td>
  </tr>
  <tr>
    <td>BOT_ALLOWED_UPDATES</td>
    <td>
        Array of String
    </td>
    <td>
        <i>Optional.</i> A JSON-serialized list of the update types you want your bot to receive. See <a href="https://core.telegram.org/bots/api#update">Update</a> for a complete list of available update types. <br/>
        Defaults to an empty array (all update types except <code>chat_member</code>).
    </td>
  </tr>
  <tr>
    <td>BOT_ADMINS</td>
    <td>
        Array of Number
    </td>
    <td>
        <i>Optional.</i>
        Administrator user IDs.
        Use this to specify user IDs that have special privileges, such as executing <code>/setcommands</code>. <br/>
        Defaults to an empty array.
    </td>
  </tr>
</tbody>
</table>
