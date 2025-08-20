import sys
from assistantModel import Assistant
import json

chat_history = json.loads(sys.argv[1])
assistant = Assistant()
reply = assistant.askAI(chat_history)
print(reply)

