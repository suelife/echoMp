#Microsoft Bot 建立
- 建立API伺服器
    ```
    const server = restify.createServer();
    server.listen(process.env.port || process.env.PORT || 3978, () => {
        console.log(`\n${ server.name } listening to ${ server.url }`);
        console.log(`\n url http://localhost:3978/api/messages`);
    });
    ```
- 建立 adapter
    ```
    const adapter = new BotFrameworkAdapter({
    appId: process.env.microsoftAppID,
    appPassword: process.env.microsoftAppPassword
    });
    ```