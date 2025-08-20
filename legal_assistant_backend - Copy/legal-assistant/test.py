from assistantModel import Assistant
import sys
import json


sysmsg = "You are a legal assistant specialized in Sri Lankan law. Only answer questions related to legal issues under Sri Lankan law. Politely decline to answer any non-legal questions or questions not pertaining to Sri Lankan law. Always give more technical answers with reference of legal document"
data = sys.stdin.read()
chat_history = json.loads(data)
chat_history.append({"role": "system", "content": sysmsg})
assistant = Assistant()
assistant.askAI(chat_history)
