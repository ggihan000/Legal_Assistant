from assistantModel import Assistant

chat_history = []
assistant = Assistant()
chat_history.append({"role": "human", "content":"if someone died unknowingly because of me am i guilty"})
reply = assistant.askAI(chat_history)
print("assistant:",reply)