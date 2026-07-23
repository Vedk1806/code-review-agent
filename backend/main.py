from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Code Review Agent is running!"}

@app.post("/review")
async def review_pr(data: dict):
    pr_url = data.get("pr_url")
    
    # Extract owner, repo, and PR number from GitHub URL
    parts = pr_url.rstrip("/").split("/")
    owner = parts[-4]
    repo = parts[-3]
    pr_number = parts[-1]
    
    github_token = os.getenv("GITHUB_TOKEN")
    
    # Fetch PR details as JSON
    headers_json = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    pr_url_api = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pr_number}"
    response = requests.get(pr_url_api, headers=headers_json)
    pr_data = response.json()

    # Fetch the actual code diff
    headers_diff = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3.diff"
    }
    diff_response = requests.get(pr_url_api, headers=headers_diff)
    code_diff = diff_response.text

    # Send diff to Gemini for review
    model = genai.GenerativeModel("gemini-2.0-flash-lite")
    prompt = f"""You are an expert code reviewer. Review the following code changes from a GitHub Pull Request.

PR Title: {pr_data.get('title')}
Author: {pr_data.get('user', {}).get('login')}

Code Changes:
{code_diff}

Provide a structured review with:
1. Summary of changes
2. Potential bugs or issues
3. Security concerns
4. Suggestions for improvement
5. Overall assessment (Approve / Request Changes)"""

    review = model.generate_content(
    prompt,
    request_options={"timeout": 120}
)
    
    # Return basic PR information
    return {
        "title": pr_data.get("title"),
        "author": pr_data.get("user", {}).get("login"),
        "files_changed": pr_data.get("changed_files"),
        "additions": pr_data.get("additions"),
        "deletions": pr_data.get("deletions"),
        "state": pr_data.get("state"),
        "review": review.text
    }