import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
import services
import sys


class Assistant():
    def __init__(self):
        load_dotenv()
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            raise ValueError("Missing OPENAI_API_KEY in environment variables")
        
        self.model = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0,
            openai_api_key=openai_api_key,
            #max_tokens=50,
            streaming=True
        )

        self.tools = []

        self.config = {"configurable": {"thread_id": "1"}}
        self.carreir_agent_prompt = ChatPromptTemplate.from_messages([
            #("system", "you are a legal assistant. Do not give other than legal advise"),
            ("placeholder", "{messages}")
        ])
        self.memory = MemorySaver()
        self.agent = create_react_agent(
            self.model,
            tools=self.tools,
            state_modifier=self.carreir_agent_prompt
            #checkpointer=self.memory
        )


    def getStream(self,chat):
        inputs = {"messages": chat}
        return self.agent.stream(inputs, config=self.config, stream_mode="values")
    
    def askAI(self,chat):
        try:
            for chunk in self.model.stream(chat):
                print(chunk.content, end='', flush=True)
                sys.stdout.flush()
                
        
        except Exception as e:
            print("error in askAI:",e)