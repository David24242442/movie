import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

# URL to scrape
url = "https://silverbirdcinemas.com/cinema/accra/"

# User agent to mimic a browser
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def scrape_silverbird_cinemas():
    try:
        # Send HTTP request to the URL
        print(f"Sending request to {url}...")
        response = requests.get(url, headers=headers)
        
        # Check if the request was successful
        if response.status_code == 200:
            print("Request successful. Parsing content...")
            
            # Parse the HTML content
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find all movie entries
            movie_entries = soup.find_all('div', class_='movie-box')
            
            if not movie_entries:
                print("No movie entries found. The website structure might have changed.")
                return []
            
            print(f"Found {len(movie_entries)} movie entries.")
            
            movies = []
            for movie in movie_entries:
                movie_data = {}
                
                # Extract movie title
                title_element = movie.find('h4', class_='entry-title')
                if title_element:
                    movie_data['title'] = title_element.text.strip()
                else:
                    movie_data['title'] = "Title not found"
                
                # Extract movie poster
                poster_element = movie.find('img')
                if poster_element and 'src' in poster_element.attrs:
                    movie_data['poster'] = poster_element['src']
                else:
                    movie_data['poster'] = "Poster not found"
                
                # Extract showtimes
                showtimes_element = movie.find('div', class_='entry-date')
                if showtimes_element:
                    movie_data['showtimes'] = []
                    
                    # Look for all showtime entries
                    showtime_entries = showtimes_element.find_all('div', class_='cinema-detail')
                    
                    for entry in showtime_entries:
                        showtime = {}
                        
                        # Extract date
                        date_element = entry.find('div', class_='date-md')
                        if date_element:
                            showtime['date'] = date_element.text.strip()
                        else:
                            showtime['date'] = "Date not found"
                        
                        # Extract cinema room
                        room_element = entry.find('h4', class_='cinema-name')
                        if room_element:
                            showtime['room'] = room_element.text.strip()
                        else:
                            showtime['room'] = "Room not found"
                        
                        # Extract times
                        times_element = entry.find('div', class_='time-lists')
                        if times_element:
                            time_buttons = times_element.find_all('button')
                            showtime['times'] = [btn.text.strip() for btn in time_buttons if btn.text.strip()]
                        else:
                            showtime['times'] = []
                        
                        movie_data['showtimes'].append(showtime)
                else:
                    movie_data['showtimes'] = []
                
                movies.append(movie_data)
            
            return movies
        else:
            print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
            return []
    
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return []

def get_latest_movies():
    movies = scrape_silverbird_cinemas()
    
    if not movies:
        return "No movie data could be retrieved. Please check the website directly."
    
    # Format the results
    result = "Latest Movies at Silverbird Cinemas Accra:\n\n"
    
    for movie in movies:
        result += f"Movie: {movie['title']}\n"
        
        if movie['showtimes']:
            result += "Showtimes:\n"
            
            for showtime in movie['showtimes']:
                result += f"  Date: {showtime['date']}\n"
                result += f"  Cinema Room: {showtime['room']}\n"
                
                if showtime['times']:
                    result += f"  Times: {', '.join(showtime['times'])}\n"
                else:
                    result += "  Times: No specific times found\n"
                
                result += "\n"
        else:
            result += "No showtimes available for this movie.\n\n"
    
    return result

if __name__ == "__main__":
    print("Starting to scrape Silverbird Cinemas Accra...")
    result = get_latest_movies()
    print("\nResults:")
    print(result)
    
    # Save results to a file
    with open('silverbird_movies.txt', 'w') as f:
        f.write(result)
    
    print("\nResults saved to silverbird_movies.txt")
