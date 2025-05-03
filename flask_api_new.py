from flask import Flask, jsonify, render_template
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

RAPIDAPI_KEY = '4e9afe57acmsha5e22d76629d6bcp1720f3jsn996f27c7fa5f'
RAPIDAPI_HOST = 'imdb236.p.rapidapi.com'
HEADERS = {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST
}

def fetch_rapidapi(endpoint):
    url = f'https://imdb236.p.rapidapi.com{endpoint}'
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching {endpoint}: {e}")
        return None

@app.route('/')
def home():
    return render_template('netflix_main.html')

@app.route('/tv-shows')
def tv_shows_page():
    return render_template('tv_shows.html')

@app.route('/movies')
def movies_page():
    return render_template('movies.html')

@app.route('/games')
def games_page():
    return render_template('games.html')

@app.route('/new-popular')
def new_popular_page():
    return render_template('new_popular.html')

@app.route('/my-list')
def my_list_page():
    return render_template('my_list.html')

@app.route('/browse-languages')
def browse_languages_page():
    return render_template('browse_languages.html')

@app.route('/api/carousels')
def carousels():
    def is_valid_image(url):
        return url and not url.startswith('https://placehold.co')

    def make_items(results):
        items = []
        for result in results:
            image_url = result.get("primaryImage") or ""
            if is_valid_image(image_url):
                items.append({
                    "title": result.get("primaryTitle") or result.get("titleText", {}).get("text", "No Title"),
                    "image": image_url,
                    "badges": []
                })
        return items

    carousels = []

    # Only use working endpoints
    endpoints = [
        ("Continue Watching", None),  # Static list
        ("Most Popular Movies", "/imdb/most-popular-movies"),
        ("Most Popular TV Shows", "/imdb/most-popular-tv"),
        ("Top Box Office", "/imdb/top-box-office"),
        ("Top 250 Movies", "/imdb/top250-movies"),
        ("Top 250 TV Shows", "/imdb/top250-tv"),
        ("Top Rated Indian Movies", "/imdb/india/top-rated-indian-movies"),
        ("Upcoming Releases (India)", "/imdb/india/upcoming"),
        ("Upcoming Releases (US)", "/imdb/upcoming-releases?countryCode=US&type=MOVIE"),
    ]

    for title, endpoint in endpoints:
        if title == "Continue Watching":
            # Static list of continue watching items
            items = [
                {
                    "title": "Stranger Things",
                    "image": "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
                    "badges": ["S3:E5", "75%"]
                },
                {
                    "title": "The Crown",
                    "image": "https://image.tmdb.org/t/p/w500/1XDDXPXGiI8id7MrUxK36ke7gkX.jpg",
                    "badges": ["S4:E3", "60%"]
                },
                {
                    "title": "Money Heist",
                    "image": "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
                    "badges": ["S2:E4", "45%"]
                },
                {
                    "title": "Breaking Bad",
                    "image": "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
                    "badges": ["S5:E8", "30%"]
                }
            ]
            carousels.append({"title": title, "items": items})
            continue

        data = fetch_rapidapi(endpoint)
        print(f"\nProcessing endpoint: {endpoint}")
        print(f"Data type: {type(data)}")
        if data:
            print(f"Data sample: {str(data)[:200]}")
        
        if endpoint == "/imdb/top250-movies" or endpoint == "/imdb/top250-tv" or endpoint == "/imdb/top-box-office":
            # Special handling for Top 250 Movies, TV Shows, and Box Office
            items = make_items(data[:12] if data and isinstance(data, list) else [])
        elif endpoint == "/imdb/india/upcoming" or endpoint == "/imdb/india/top-rated-indian-movies":
            # Simplified handling for India specific endpoints
            items = make_items(data[:12] if data and isinstance(data, list) else [])
        elif endpoint == "/imdb/upcoming-releases?countryCode=US&type=MOVIE":
            # Handling for US upcoming releases
            items = []
            if data:
                if isinstance(data, dict) and 'titles' in data:
                    items = data['titles'][:12]
                elif isinstance(data, list):
                    for section in data:
                        if isinstance(section, dict) and 'titles' in section:
                            items = section['titles'][:12]
                            break
            items = make_items(items)
        else:
            items = make_items(data[:12] if data and isinstance(data, list) else [])
        
        if items:
            carousels.append({"title": title, "items": items})
            print(f"Added {title} with {len(items)} items")
        else:
            print(f"No items found for {title}")

    return jsonify(carousels)

@app.route('/api/imdb236-endpoints')
def imdb236_endpoints():
    # This is a static list based on the RapidAPI imdb236 documentation as of now
    endpoints = [
        {"name": "Most Popular Movies", "path": "/imdb/most-popular-movies"},
        {"name": "Upcoming Releases (India)", "path": "/imdb/india/upcoming"},
        {"name": "Upcoming Releases (US)", "path": "/imdb/upcoming-releases?countryCode=US&type=MOVIE"},
        {"name": "Most Popular TV Shows", "path": "/imdb/most-popular-tv"},
        {"name": "Top 250 Movies", "path": "/imdb/top250-movies"},
        {"name": "Top 250 TV Shows", "path": "/imdb/top250-tv"},
        {"name": "Box Office", "path": "/imdb/box-office"},
        {"name": "Top Rated Indian Movies", "path": "/imdb/india/top-rated-indian-movies"},
        {"name": "Search by Title", "path": "/imdb/search/title?query=YOUR_QUERY"},
        {"name": "Search by Name", "path": "/imdb/search/name?query=YOUR_QUERY"},
        {"name": "Search by Keyword", "path": "/imdb/search/keyword?query=YOUR_QUERY"},
    ]
    return jsonify(endpoints)

@app.route('/api/tv-shows/<category>')
def tv_shows(category):
    # This is a placeholder for the actual TV shows data
    # In a real application, you would fetch this data from a database or external API
    sample_shows = [
        {
            "title": "Stranger Things",
            "image": "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
            "year": "2016",
            "rating": "TV-14",
            "isTop10": True,
            "isNew": False
        },
        {
            "title": "The Crown",
            "image": "https://image.tmdb.org/t/p/w500/1XDDXPXGiI8id7MrUxK36ke7gkX.jpg",
            "year": "2016",
            "rating": "TV-MA",
            "isTop10": True,
            "isNew": False
        },
        {
            "title": "Money Heist",
            "image": "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
            "year": "2017",
            "rating": "TV-MA",
            "isTop10": True,
            "isNew": False
        },
        {
            "title": "Breaking Bad",
            "image": "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
            "year": "2008",
            "rating": "TV-MA",
            "isTop10": True,
            "isNew": False
        }
    ]

    if category == 'featured':
        return jsonify({
            "title": "Stranger Things",
            "description": "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
            "trailerUrl": "/static/assets/videos/featured_trailer.mp4"
        })
    
    # Return different sets of shows based on category
    if category in ['popular', 'trending', 'new', 'top-rated']:
        return jsonify(sample_shows)
    
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True) 