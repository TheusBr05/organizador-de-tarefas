import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, request # Added request
from flask_cors import CORS # Added CORS import
from flask_migrate import Migrate
from src.models import db
from src.routes.task_routes import task_bp
from dotenv import load_dotenv
from src.routes.user_routes import user_bp  # Added user routes

load_dotenv()

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
CORS(app, resources={r"/api/*": {"origins": "*"}}) # Enabled CORS for all routes
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

app.register_blueprint(task_bp, url_prefix='/api/tasks')
app.register_blueprint(user_bp, url_prefix='/api/users')  # Added user routes

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()

migrate = Migrate(app, db)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            if not request.path.startswith('/api'):
                 return "Welcome to the Task Manager API. No frontend index.html found.", 200
            pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
