# Flask Backend API for Iris Flower Classification
# This Flask app provides a REST API to predict iris flower classes

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for frontend access

# Load the trained model at startup
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'iris_model.pkl')
model = None

# Iris class names for human-readable output
IRIS_CLASSES = ['Setosa', 'Versicolor', 'Virginica']

def load_model():
    """Load the pre-trained iris classification model"""
    global model
    try:
        model = joblib.load(MODEL_PATH)
        print(f"Model loaded successfully from {MODEL_PATH}")
        return True
    except FileNotFoundError:
        print(f"Error: Model file not found at {MODEL_PATH}")
        print("Please run 'python model/train.py' first to train the model")
        return False
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return False

@app.route('/', methods=['GET'])
def home():
    """Home route to check if API is running"""
    return jsonify({
        'message': 'Iris Flower Classification API is running!',
        'endpoints': {
            'predict': 'POST /predict',
            'health': 'GET /health'
        }
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    model_status = 'loaded' if model is not None else 'not loaded'
    return jsonify({
        'status': 'healthy',
        'model_status': model_status
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict iris flower class based on input measurements

    Expected JSON input:
    {
        "sepal_length": float,
        "sepal_width": float,
        "petal_length": float,
        "petal_width": float
    }

    Returns:
    {
        "prediction": string,
        "confidence": float,
        "input_data": dict
    }
    """
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                'error': 'Model not loaded. Please ensure the model file exists.'
            }), 500

        # Get JSON data from request
        data = request.get_json()

        # Validate input data
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        # Extract features from request
        required_fields = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {missing_fields}',
                'required_fields': required_fields
            }), 400

        # Validate that all inputs are numbers
        try:
            features = [
                float(data['sepal_length']),
                float(data['sepal_width']),
                float(data['petal_length']),
                float(data['petal_width'])
            ]
        except (ValueError, TypeError):
            return jsonify({
                'error': 'All input values must be valid numbers'
            }), 400

        # Validate input ranges (basic sanity check)
        if any(f <= 0 for f in features):
            return jsonify({
                'error': 'All measurements must be positive numbers'
            }), 400

        # Prepare data for prediction
        input_array = np.array([features])

        # Make prediction
        prediction_idx = model.predict(input_array)[0]
        prediction_class = IRIS_CLASSES[prediction_idx]

        # Get prediction probabilities (if supported by the model)
        try:
            probabilities = model.predict_proba(input_array)[0]
            confidence = float(max(probabilities))
        except:
            # If model doesn't support predict_proba, set confidence to None
            confidence = None

        # Prepare response
        response = {
            'prediction': prediction_class,
            'prediction_index': int(prediction_idx),
            'confidence': confidence,
            'input_data': {
                'sepal_length': features[0],
                'sepal_width': features[1],
                'petal_length': features[2],
                'petal_width': features[3]
            },
            'all_classes': IRIS_CLASSES
        }

        return jsonify(response)

    except Exception as e:
        # Handle any unexpected errors
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("Starting Iris Classification API...")

    # Load the model before starting the server
    if load_model():
        print("Model loaded successfully!")
        print("API will be available at: http://localhost:5000")
        print("Prediction endpoint: http://localhost:5000/predict")

        # Start the Flask development server
        app.run(
            host='127.0.0.1',  # Only accessible from localhost
            port=5000,
            debug=True  # Enable debug mode for development
        )
    else:
        print("Failed to load model. Please train the model first.")
        print("Run: python model/train.py")