# Python Compiler Branch
- Allows you to perform python operations through a discord bot.

# Recommended
- Be familiar with discord code indents.
Example with python:
```
```py
print("test")```

```

# USE
![image](https://github.com/sytaxus/Multipurpose-discord-bot/assets/60050784/3e57ec0b-090e-4cb2-b6f7-e434bce1cf52)
- The use must be very specific, identation also matters as well. Treat it the same way you would put your code in your IDE.
- Example:
```
!python```
print("Greetings!")```
```

# BANNED FUNCTIONS AND LIBRARIES.
Due to security reasons the following is disabled:
- import
- os module
- sys module
- __ (For classes as well)
- subprocess
- open
- eval
- exec

NOTE: if the user tries to perform operations that are registered as banned, they will be given 3 warnings, if all of the 3 warnings are achieved, the bot will go into an "ignore" state and will ignore every command that user sends through putting their user id in a temporary blacklist.

# PROOF OF HOW IT CAN BE POSSIBLY EXPLOITED
IF you're hosting your bot in a cloud platform, for example the subprocess module can easily be used to access files. 
User input:
![image](https://github.com/sytaxus/Multipurpose-discord-bot/assets/60050784/b3316b27-f036-4a6d-94d4-ddf2d4133520)
Bot outputed:
![image](https://github.com/sytaxus/Multipurpose-discord-bot/assets/60050784/a853a90a-26e2-44b9-be91-a5ecf42178cd)
User Input #2:
![image](https://github.com/sytaxus/Multipurpose-discord-bot/assets/60050784/1248fa71-9477-469c-b2aa-26a8f3fadddc)
Bot Output #2: 
![image](https://github.com/sytaxus/Multipurpose-discord-bot/assets/60050784/895da4b3-9458-4174-91ee-28552fb5e77e)
And as you can see, through this a simple subprocess.Popen('cat <filename>', shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT) can be used, and not only the source code will then be leaked but additionally threat actors can gain access to your bot token.

# OPTIONAL
You may remove the "__" as it doesn't pose a direct threat, however I strongly suggest to keep the other libraries banned if used for production.



