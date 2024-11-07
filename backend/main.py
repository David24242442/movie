from fastapi import FastAPI, Response
from bs4 import BeautifulSoup
import requests as req

app = FastAPI()

@app.get("/")
async def coming_soon():
    url = "https://silverbirdcinemas.com/coming-soon/"
    response = req.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    
 
    coming_soon_links = []
    headers = soup.find("div", class_="movie-list")
    
    for link in headers.find_all("a", href=True):
        coming_soon_link = link["href"]
        
       
        if coming_soon_link.startswith("/"):
            coming_soon_link = f"https://silverbirdcinemas.com{coming_soon_link}"
        
        coming_soon_links.append(coming_soon_link)

  
    all_movies = []
    for link in coming_soon_links:
        response = req.get(link)
        coming_soon_soup = BeautifulSoup(response.text, "html.parser")
        
  
        movies = []
        for movie_section in coming_soon_soup.find_all("div", class_="movie-item"):
            title = movie_section.find("h3").get_text(strip=True)
            description = movie_section.find("p").get_text(strip=True)
            movies.append({"title": title, "description": description})
        
        all_movies.append({"link": link, "movies": movies})
    
    return {"coming_soon_movies": all_movies}
