from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

RAPIDAPI_KEY = 'b8ecd37a74msh421d9c8d2edfe9ap1eaf46jsna472dfe4056e'
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

    endpoints = [
        ("Most Popular Movies", "/imdb/most-popular-movies"),
        ("Upcoming Releases", "/imdb/upcoming-releases?countryCode=IN&type=MOVIE"),
        ("Most Popular TV Shows", "/imdb/most-popular-tv"),
    ]

    for title, endpoint in endpoints:
        data = fetch_rapidapi(endpoint)
        if endpoint.startswith("/imdb/upcoming-releases"):
            items = []
            if data:
                if isinstance(data, list):
                    for section in data:
                        if isinstance(section, dict) and 'titles' in section:
                            items = section['titles'][:12]
                            break
                elif isinstance(data, dict) and 'titles' in data:
                    items = data['titles'][:12]
            items = make_items(items)
        else:
            items = make_items(data[:12] if data and isinstance(data, list) else [])
        if items:
            carousels.append({"title": title, "items": items})

    return jsonify(carousels)

@app.route('/api/imdb236-endpoints')
def imdb236_endpoints():
    # This is a static list based on the RapidAPI imdb236 documentation as of now
    endpoints = [
        {"name": "Most Popular Movies", "path": "/imdb/most-popular-movies"},
        {"name": "Upcoming Releases", "path": "/imdb/upcoming-releases?countryCode=IN&type=MOVIE"},
        {"name": "Most Popular TV Shows", "path": "/imdb/most-popular-tv"},
        {"name": "Top 250 Movies", "path": "/imdb/top-250-movies"},
        {"name": "Top 250 TV Shows", "path": "/imdb/top-250-tv"},
        {"name": "Box Office", "path": "/imdb/box-office"},
        {"name": "Coming Soon", "path": "/imdb/coming-soon"},
        {"name": "In Theaters", "path": "/imdb/in-theaters"},
        {"name": "Search by Title", "path": "/imdb/search/title?query=YOUR_QUERY"},
        {"name": "Search by Name", "path": "/imdb/search/name?query=YOUR_QUERY"},
        {"name": "Search by Keyword", "path": "/imdb/search/keyword?query=YOUR_QUERY"},
    ]
    return jsonify(endpoints)

if __name__ == '__main__':
    app.run(debug=True) 