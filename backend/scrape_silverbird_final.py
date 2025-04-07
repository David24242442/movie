import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime

# URL to scrape
url = "https://silverbirdcinemas.com/cinema/accra/"

# User agent to mimic a browser
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def clean_title(title):
    # Remove any numeric prefixes or suffixes and other non-title text
    cleaned = re.sub(r'^[\d\s]+', '', title)  # Remove leading numbers
    cleaned = re.sub(r'[\d\s]+$', '', cleaned)  # Remove trailing numbers
    cleaned = re.sub(r'votes[\d\.]+', '', cleaned)  # Remove vote information
    cleaned = re.sub(r'Genre:|Language:|English|Hindi', '', cleaned)  # Remove genre/language info
    cleaned = re.sub(r'GhallywoodLanguage:', '', cleaned)  # Remove specific text
    
    # Clean up any remaining non-title text
    patterns_to_remove = [
        r'Victoria IslandSort byRelease DateTitle',
        r'Sort byRelease DateTitle',
        r'votes\d+',
        r'\d+votes'
    ]
    
    for pattern in patterns_to_remove:
        cleaned = re.sub(pattern, '', cleaned)
    
    return cleaned.strip()

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
            
            # Extract the entire page content as text
            page_content = soup.get_text()
            
            # Find all movie blocks using regex patterns
            # Looking for patterns like "Movie Title" followed by "hours minutes" and "Showtime:"
            movie_pattern = re.compile(r'([A-Za-z0-9\s:&\-\']+)\s*(\d{2})\s*hours\s*(\d{2})\s*minutes\s*Showtime:\s*(.*?)(?=\d{2}\s*hours|\Z)', re.DOTALL)
            matches = movie_pattern.findall(page_content)
            
            movies = []
            for match in matches:
                raw_title = match[0].strip()
                title = clean_title(raw_title)
                
                # Skip if title is empty after cleaning
                if not title:
                    continue
                    
                duration_hours = match[1]
                duration_minutes = match[2]
                showtime_info = match[3].strip()
                
                # Extract showtime details
                fri_sun_pattern = re.compile(r'FRI-SUN:\s*(.*?)(?=MON-THUR:|$)', re.DOTALL)
                mon_thur_pattern = re.compile(r'MON-THUR:\s*(.*?)(?=Release:|$)', re.DOTALL)
                
                fri_sun_match = fri_sun_pattern.search(showtime_info)
                mon_thur_match = mon_thur_pattern.search(showtime_info)
                
                fri_sun_times = fri_sun_match.group(1).strip() if fri_sun_match else "Not available"
                mon_thur_times = mon_thur_match.group(1).strip() if mon_thur_match else "Not available"
                
                # Extract specific times using regex
                time_pattern = re.compile(r'(\d{1,2}:\d{2}(?:AM|PM))')
                fri_sun_specific_times = time_pattern.findall(fri_sun_times) if fri_sun_match else []
                mon_thur_specific_times = time_pattern.findall(mon_thur_times) if mon_thur_match else []
                
                # Create movie object
                movie = {
                    'title': title,
                    'duration': f"{duration_hours} hours {duration_minutes} minutes",
                    'showtimes': {
                        'FRI-SUN': {
                            'info': fri_sun_times,
                            'times': fri_sun_specific_times
                        },
                        'MON-THUR': {
                            'info': mon_thur_times,
                            'times': mon_thur_specific_times
                        }
                    }
                }
                
                # Extract cinema room information
                # For Silverbird Cinemas Accra, all movies are shown at Accra Mall
                movie['cinema_room'] = "Silverbird Cinemas, Accra Mall"
                
                movies.append(movie)
            
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
        result += f"Duration: {movie['duration']}\n"
        result += f"Cinema: {movie['cinema_room']}\n"
        result += "Showtimes:\n"
        
        # Friday to Sunday
        result += "  FRI-SUN:\n"
        result += f"    {movie['showtimes']['FRI-SUN']['info']}\n"
        if movie['showtimes']['FRI-SUN']['times']:
            result += f"    Specific Times: {', '.join(movie['showtimes']['FRI-SUN']['times'])}\n"
        
        # Monday to Thursday
        result += "  MON-THUR:\n"
        result += f"    {movie['showtimes']['MON-THUR']['info']}\n"
        if movie['showtimes']['MON-THUR']['times']:
            result += f"    Specific Times: {', '.join(movie['showtimes']['MON-THUR']['times'])}\n"

        result += "\n" + "-"*50 + "\n\n"
    
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
