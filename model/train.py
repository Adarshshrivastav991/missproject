# Iris Flower Classification Model Training Script
# This script trains a machine learning model to classify iris flowers

import pandas as pd
import numpy as np
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report
import joblib

def train_iris_model():
    """Train an SVM classifier on the Iris dataset and save the model"""

    # Load the built-in Iris dataset
    print("Loading Iris dataset...")
    iris = datasets.load_iris()
    X = iris.data  # Features: sepal_length, sepal_width, petal_length, petal_width
    y = iris.target  # Target: flower class (0=setosa, 1=versicolor, 2=virginica)

    # Print dataset information
    print(f"Dataset shape: {X.shape}")
    print(f"Feature names: {iris.feature_names}")
    print(f"Target classes: {iris.target_names}")

    # Split the data into training and testing sets (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"Training set size: {X_train.shape[0]}")
    print(f"Testing set size: {X_test.shape[0]}")

    # Create and train the SVM classifier
    print("Training SVM classifier...")
    model = SVC(kernel='linear', random_state=42)
    model.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = model.predict(X_test)

    # Calculate and display accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model accuracy: {accuracy:.2%}")

    # Display detailed classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=iris.target_names))

    # Save the trained model
    model_filename = 'iris_model.pkl'
    joblib.dump(model, model_filename)
    print(f"Model saved as '{model_filename}'")

    # Test the saved model with a sample prediction
    print("\nTesting saved model with sample data...")
    loaded_model = joblib.load(model_filename)

    # Sample: sepal_length=5.1, sepal_width=3.5, petal_length=1.4, petal_width=0.2
    sample_data = [[5.1, 3.5, 1.4, 0.2]]
    prediction = loaded_model.predict(sample_data)
    predicted_class = iris.target_names[prediction[0]]

    print(f"Sample prediction: {predicted_class}")
    print("Model training completed successfully!")

if __name__ == "__main__":
    train_iris_model()