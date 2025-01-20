from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from phi.agent import Agent
from phi.llm.openai import OpenAIChat
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.yfinance import YFinanceTools
import json
from dotenv import load_dotenv
import os
import re

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents with specific roles and tools
web_agent = Agent(
    name="Web Agent",
    role="Search the web for information",
    llm=OpenAIChat(model="gpt-4o"),
    tools=[DuckDuckGo()],
    instructions=["Always include sources"],
    show_tool_calls=True,
    markdown=True,
)

finance_agent = Agent(
    name="Finance Agent",
    role="Get financial data",
    llm=OpenAIChat(model="gpt-4o"),
    tools=[YFinanceTools()],
    instructions=["Use tables to display data"],
    show_tool_calls=True,
    markdown=True,
)

agent_team = Agent(
    name="Stock Analysis Team",
    llm=OpenAIChat(model="gpt-4"),
    agents=[web_agent, finance_agent],
    instructions=[
        "Always include sources",
        "Use tables to display data",
        "Focus on the specific stock symbol provided",
        "Ensure all data is relevant to the requested stock"
    ],
    show_tool_calls=True,
    markdown=True,
)

def extract_content(response_str: str) -> str:
    match = re.search(r"content='(.*?)'(?:\s|content_type)", response_str, re.DOTALL)
    if match:
        content = match.group(1)
        # Unescape newlines and quotes
        return content.replace('\\n', '\n').replace("\\'", "'")
    return response_str


@app.get("/api/stock/{symbol}")
async def get_stock_data(symbol: str):
    try:
        if not symbol or len(symbol) > 10:
            raise HTTPException(status_code=400, detail="Invalid stock symbol")

        # Normalize symbol
        symbol = symbol.upper().strip()
        
        # Get response for the specific symbol
        response = agent_team.run(
            f"Summarize analyst recommendations and share the latest news for {symbol}. "
        )
        
        # Convert response to string and extract content
        content = extract_content(str(response))

        print({"content": content})
        
        return {"content": content}
            
    except Exception as e:
        print(f"Error processing request for symbol {symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)