from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/carousels')
def carousels():
    return jsonify([
        {
            "title": "Teen TV Shows",
            "items": [
                {"title": "Weak Hero", "image": "https://placehold.co/300x170?text=Weak+Hero", "badges": ["New Season", "Top 10"]},
                {"title": "Stranger Things", "image": "https://placehold.co/300x170?text=Stranger+Things", "badges": []},
                {"title": "Wednesday", "image": "https://placehold.co/300x170?text=Wednesday", "badges": []},
                {"title": "Locke & Key", "image": "https://placehold.co/300x170?text=Locke+%26+Key", "badges": []},
                {"title": "Mismatched", "image": "https://placehold.co/300x170?text=Mismatched", "badges": []},
                {"title": "All of Us Are Dead", "image": "https://placehold.co/300x170?text=All+of+Us+Are+Dead", "badges": []}
            ]
        },
        {
            "title": "Asian Movies & TV",
            "items": [
                {"title": "Squid Game", "image": "https://placehold.co/300x170?text=Squid+Game", "badges": ["Top 10"]},
                {"title": "When Life Gives You Tangerines", "image": "https://placehold.co/300x170?text=Tangerines", "badges": []},
                {"title": "Bullet Train Explosion", "image": "https://placehold.co/300x170?text=Bullet+Train", "badges": ["Recently added", "Top 10"]},
                {"title": "Alice in Borderland", "image": "https://placehold.co/300x170?text=Alice+in+Borderland", "badges": []},
                {"title": "King the Land", "image": "https://placehold.co/300x170?text=King+the+Land", "badges": []},
                {"title": "True Beauty", "image": "https://placehold.co/300x170?text=True+Beauty", "badges": []}
            ]
        },
        {
            "title": "Your Next Watch",
            "items": [
                {"title": "Chhalaava", "image": "https://placehold.co/300x170?text=Chhalaava", "badges": ["Recently added"]},
                {"title": "Money Heist", "image": "https://placehold.co/300x170?text=Money+Heist", "badges": ["Top 10"]},
                {"title": "Court", "image": "https://placehold.co/300x170?text=Court", "badges": ["Recently added", "Top 10"]},
                {"title": "Lucky Bashkar", "image": "https://placehold.co/300x170?text=Lucky+Bashkar", "badges": []},
                {"title": "Lucifer", "image": "https://placehold.co/300x170?text=Lucifer", "badges": []},
                {"title": "The Good Doctor", "image": "https://placehold.co/300x170?text=Good+Doctor", "badges": []}
            ]
        }
    ])

if __name__ == '__main__':
    app.run(debug=True) 