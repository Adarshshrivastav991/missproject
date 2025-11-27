# Iris Flower Classification Project

A complete machine learning web application for classifying iris flowers using scikit-learn, Flask, and vanilla JavaScript.

## 🌸 Project Structure

```
project/
├── model/
│   ├── train.py          # ML model training script
│   └── iris_model.pkl    # Trained model (generated)
│
├── backend/
│   └── app.py            # Flask API server
│
└── frontend/
    ├── index.html        # Main webpage
    ├── style.css         # Styling
    └── script.js         # Frontend logic
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install scikit-learn flask flask-cors joblib numpy pandas
```

### 2. Train the Model

```bash
cd project
python model/train.py
```

This will:
- Load the iris dataset
- Train an SVM classifier
- Save the model as `iris_model.pkl`
- Display training results

### 3. Start the Backend API

```bash
python backend/app.py
```

The Flask API will start on `http://127.0.0.1:5000`

### 4. Open the Frontend

Open `frontend/index.html` in your web browser or serve it with a simple HTTP server:

```bash
# Option 1: Double-click index.html
# Option 2: Use Python's built-in server
cd frontend
python -m http.server 8000
# Then visit http://localhost:8000
```

## 🧪 Sample Test Data

Use these values to test the application:

### Setosa (should predict "Setosa")
- Sepal Length: 5.1
- Sepal Width: 3.5
- Petal Length: 1.4
- Petal Width: 0.2

### Versicolor (should predict "Versicolor")
- Sepal Length: 6.2
- Sepal Width: 2.9
- Petal Length: 4.3
- Petal Width: 1.3

### Virginica (should predict "Virginica")
- Sepal Length: 6.5
- Sepal Width: 3.0
- Petal Length: 5.8
- Petal Width: 2.2

## 📡 API Endpoints

### `GET /`
Returns API information and available endpoints.

### `GET /health`
Health check endpoint to verify API status.

### `POST /predict`
Predicts iris flower class based on measurements.

**Request Body:**
```json
{
    "sepal_length": 5.1,
    "sepal_width": 3.5,
    "petal_length": 1.4,
    "petal_width": 0.2
}
```

**Response:**
```json
{
    "prediction": "Setosa",
    "prediction_index": 0,
    "confidence": 0.95,
    "input_data": {
        "sepal_length": 5.1,
        "sepal_width": 3.5,
        "petal_length": 1.4,
        "petal_width": 0.2
    },
    "all_classes": ["Setosa", "Versicolor", "Virginica"]
}
```

## 🔧 Technical Details

### Machine Learning
- **Dataset**: Iris dataset (150 samples, 4 features, 3 classes)
- **Algorithm**: Support Vector Machine (SVM) with linear kernel
- **Features**: Sepal length, sepal width, petal length, petal width
- **Classes**: Setosa, Versicolor, Virginica

### Backend
- **Framework**: Flask with CORS support
- **Model Storage**: joblib for model persistence
- **Validation**: Input validation and error handling

### Frontend
- **Technologies**: HTML5, CSS3, JavaScript (ES6+)
- **Features**: Responsive design, real-time validation, example data
- **Styling**: Modern CSS with gradients and animations

## 🐛 Troubleshooting

### Model Not Found Error
If you get "Model not found" errors:
1. Make sure you've run `python model/train.py` first
2. Check that `iris_model.pkl` exists in the `model/` directory

### CORS Errors
If you get CORS errors:
1. Make sure Flask-CORS is installed: `pip install flask-cors`
2. Ensure the backend is running on `http://127.0.0.1:5000`

### Connection Errors
If the frontend can't connect to the backend:
1. Verify the Flask API is running
2. Check the API_BASE_URL in `script.js` matches your backend URL
3. Ensure no firewall is blocking port 5000

## 📚 Learning Resources

- [Iris Dataset Info](https://en.wikipedia.org/wiki/Iris_flower_data_set)
- [scikit-learn Documentation](https://scikit-learn.org/stable/)
- [Flask Documentation](https://flask.palletsprojects.com/)

## 🎯 Features

- ✅ Complete ML pipeline from training to deployment
- ✅ Modern, responsive web interface
- ✅ Real-time input validation
- ✅ Example data for quick testing
- ✅ Error handling and user feedback
- ✅ Clean, beginner-friendly code
- ✅ Comprehensive documentation

## 🚀 Next Steps

1. Add more advanced ML models (Random Forest, Neural Networks)
2. Implement data visualization with charts
3. Add model performance metrics dashboard
4. Deploy to cloud platforms (Heroku, AWS, etc.)
5. Add user authentication and data storage