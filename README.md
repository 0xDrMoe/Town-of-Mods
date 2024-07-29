# The Enhanced Bot (TEB)
## A mod for Town of Host: Enhanced
### By: [0xDrMoe](https://github.com/0xDrMoe)

## Pre-requisites
Install the following before continuing to contribute to this project:
1. [Node.js](https://nodejs.org/en/download/)
2. [Git](https://git-scm.com/downloads)
3. [Visual Studio Code](https://code.visualstudio.com/download) OR [Visual Studio](https://visualstudio.microsoft.com/downloads/)

## Creating a bot application on Discord Developer Portal
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) <br><br>
![Discord Developer Portal](/Images/DiscordDeveloperPortal.png)
2. Click on `New Application` in the top right and give the bot a name <br><br>
![New Application](/Images/NewApplication.png)
3. Navigate to the `Bot` tab on the left and click on `Add Bot`
4. Now, make sure to copy the token and store it somewhere safe. You will need it later. Note that you will not be able to see the token again after you close the window. <br><br>

## Installation
1. Clone this repository into your own directory using `git clone https://github.com/0xDrMoe/Town-of-Mods.git`
2. Open your editor and ensure that you have a terminal open in the directory you cloned the repository into
* If you are using Visual Studio Code, you can open a terminal by pressing `Ctrl + Shift + ~` (Ensure that it is a Bash terminal)
3. Run `npm install` to install all the dependencies specified in `package.json`

## Setting up the bot
1. Now that you have installed everything, you can start setting up the bot. Your directory should look something like this: <br><br>
![Directory](/Images/Directory.png)
2. Rename `config.json.example` to `config.json` and fill in the values as follows: <br><br>
```json
{
	"clientId": "123456789012345678",
	"guildId": "012345678901234567",
	"token": "FAKE_TOKEN_DO_NOT_USE",
	"joinRole": [],
	"utils": {
		"HOSTNAME": "localhost",
		"DBUSERNAME": "root",
		"DBPASSWORD": "password",
		"DATABASE": "database"
	}
}
```
- `clientId` is the Application ID under General Information
- `guildId` is the ID of the server you want to run the bot on
- `token` is the token you copied earlier
- `joinRole` Ignore this for now
- `utils` is the database information. You can ignore this for now as well
3. Now, you can run the bot by running `npm start` in the terminal. You should see the following output: <br><br>
![Output](/Images/Output.png)
4. If you see this, then you have successfully set up the bot! You can now invite the bot to your server by going to the `OAuth2` tab on the left and going to `URL Generator` selecting the `bot` and `applications.commands` scopes. Then, copy the link and paste it into your browser. <br><br>
5. Invite the bot to your server and you should see it online! Make sure to give it the `Administrator` permission. If you want this done automatically, check the `Administrator` permission under `Bot Permissions` in the same tab and copy the link to invite the bot. <br><br>
6. The bot should now be online and you can start contributing to the project! <br><br>
7. To test the bot, you can type `/ping` in the server and it should respond with `Pong!` <br><br>
---
Copyright © The Enhanced Network 2023
