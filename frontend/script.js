// Iris Flower Classification - JavaScript Frontend Logic
// This script handles form submission, API communication, and UI updates

// Configuration
const API_BASE_URL = 'https://missproject-1.onrender.com';

// Example data for quick testing
const EXAMPLE_DATA = {
    setosa: {
        sepal_length: 5.1,
        sepal_width: 3.5,
        petal_length: 1.4,
        petal_width: 0.2
    },
    versicolor: {
        sepal_length: 6.2,
        sepal_width: 2.9,
        petal_length: 4.3,
        petal_width: 1.3
    },
    virginica: {
        sepal_length: 6.5,
        sepal_width: 3.0,
        petal_length: 5.8,
        petal_width: 2.2
    }
};

// DOM Elements
let form, loadingElement, resultCard, errorCard;

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application by setting up event listeners and DOM references
 */
function initializeApp() {
    // Get references to important DOM elements
    form = document.getElementById('predictionForm');
    loadingElement = document.getElementById('loading');
    resultCard = document.getElementById('resultCard');
    errorCard = document.getElementById('errorCard');

    // Set up event listeners
    setupEventListeners();

    console.log('Iris Classification App initialized successfully!');
}

/**
 * Set up all event listeners for the application
 */
function setupEventListeners() {
    // Form submission handler
    form.addEventListener('submit', handleFormSubmission);

    // Example button handlers
    const exampleButtons = document.querySelectorAll('.example-btn');
    exampleButtons.forEach(button => {
        button.addEventListener('click', handleExampleClick);
    });

    // Input validation handlers
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', handleInputValidation);
    });
}

/**
 * Handle form submission for flower prediction
 * @param {Event} event - Form submission event
 */
async function handleFormSubmission(event) {
    event.preventDefault();

    // Get form data
    const formData = getFormData();

    // Validate form data
    if (!validateFormData(formData)) {
        return;
    }

    try {
        // Show loading state
        showLoading();

        // Make prediction request
        const prediction = await makePredictionRequest(formData);

        // Display results
        displayPredictionResult(prediction);

    } catch (error) {
        // Handle and display errors
        handlePredictionError(error);
    } finally {
        // Hide loading state
        hideLoading();
    }
}

/**
 * Extract form data into an object
 * @returns {Object} Form data object
 */
function getFormData() {
    return {
        sepal_length: parseFloat(document.getElementById('sepal_length').value),
        sepal_width: parseFloat(document.getElementById('sepal_width').value),
        petal_length: parseFloat(document.getElementById('petal_length').value),
        petal_width: parseFloat(document.getElementById('petal_width').value)
    };
}

/**
 * Validate form data
 * @param {Object} data - Form data to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateFormData(data) {
    const errors = [];

    // Check that all fields have values
    Object.keys(data).forEach(key => {
        if (isNaN(data[key]) || data[key] <= 0) {
            errors.push(`${key.replace('_', ' ')} must be a positive number`);
        }
    });

    // Check reasonable ranges (basic sanity check)
    if (data.sepal_length > 20) errors.push('Sepal length seems too large (max ~20cm)');
    if (data.sepal_width > 10) errors.push('Sepal width seems too large (max ~10cm)');
    if (data.petal_length > 15) errors.push('Petal length seems too large (max ~15cm)');
    if (data.petal_width > 8) errors.push('Petal width seems too large (max ~8cm)');

    if (errors.length > 0) {
        displayError('Validation Error', errors.join('<br>'));
        return false;
    }

    return true;
}

/**
 * Make prediction request to the Flask API
 * @param {Object} data - Input data for prediction
 * @returns {Promise<Object>} Prediction response
 */
async function makePredictionRequest(data) {
    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Display prediction results in the UI
 * @param {Object} prediction - Prediction response from API
 */
function displayPredictionResult(prediction) {
    hideError();

    const resultContent = document.getElementById('resultContent');

    // Create result HTML
    const confidenceText = prediction.confidence
        ? `${(prediction.confidence * 100).toFixed(1)}%`
        : 'Not available';

    const confidenceBarWidth = prediction.confidence
        ? `${prediction.confidence * 100}%`
        : '0%';

    resultContent.innerHTML = `
        <div class="prediction-class">
            🌸 ${prediction.prediction}
        </div>

        <div class="result-item">
            <h4>Prediction Details</h4>
            <p><strong>Predicted Species:</strong> ${prediction.prediction}</p>
            <p><strong>Confidence Level:</strong> ${confidenceText}</p>
            ${prediction.confidence ? `
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${confidenceBarWidth}"></div>
                </div>
            ` : ''}
        </div>

        <div class="result-item">
            <h4>Input Measurements</h4>
            <p><strong>Sepal Length:</strong> ${prediction.input_data.sepal_length} cm</p>
            <p><strong>Sepal Width:</strong> ${prediction.input_data.sepal_width} cm</p>
            <p><strong>Petal Length:</strong> ${prediction.input_data.petal_length} cm</p>
            <p><strong>Petal Width:</strong> ${prediction.input_data.petal_width} cm</p>
        </div>

        <div class="result-item">
            <h4>About This Species</h4>
            <p>${getSpeciesDescription(prediction.prediction)}</p>
        </div>
    `;

    // Show result card with animation
    resultCard.style.display = 'block';
    resultCard.classList.add('fade-in');

    // Scroll to results
    resultCard.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Get description for a species
 * @param {string} species - Species name
 * @returns {string} Species description
 */
function getSpeciesDescription(species) {
    const descriptions = {
        'Setosa': 'Iris Setosa is easily distinguishable from other iris species. It has smaller petals and is commonly found in arctic regions. The flowers are typically blue to purple in color.',
        'Versicolor': 'Iris Versicolor, also known as Blue Flag iris, has medium-sized petals. It is commonly found in wetlands and has distinctive blue to purple flowers with yellow centers.',
        'Virginica': 'Iris Virginica is the largest of the three species with long petals. It is also known as Southern Blue Flag and typically has light blue to purple flowers.'
    };

    return descriptions[species] || 'No description available for this species.';
}

/**
 * Handle prediction errors
 * @param {Error} error - Error object
 */
function handlePredictionError(error) {
    console.error('Prediction error:', error);

    let errorMessage = 'An unexpected error occurred.';

    // Handle specific error types
    if (error.message.includes('fetch')) {
        errorMessage = 'Could not connect to the prediction service. Please make sure the Flask backend is running on http://127.0.0.1:5000';
    } else if (error.message.includes('JSON')) {
        errorMessage = 'Invalid response from prediction service.';
    } else if (error.message) {
        errorMessage = error.message;
    }

    displayError('Prediction Error', errorMessage);
}

/**
 * Display error message in the UI
 * @param {string} title - Error title
 * @param {string} message - Error message
 */
function displayError(title, message) {
    hideResult();

    document.getElementById('errorMessage').innerHTML = `
        <strong>${title}:</strong><br>
        ${message}
        <br><br>
        <strong>Troubleshooting:</strong>
        <ul>
            <li>Make sure the Flask backend is running: <code>python backend/app.py</code></li>
            <li>Ensure the model is trained: <code>python model/train.py</code></li>
            <li>Check that all input values are valid numbers</li>
        </ul>
    `;

    errorCard.style.display = 'block';
    errorCard.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Handle example button clicks
 * @param {Event} event - Click event
 */
function handleExampleClick(event) {
    const exampleType = event.target.getAttribute('data-example');
    const exampleData = EXAMPLE_DATA[exampleType];

    if (exampleData) {
        // Fill form with example data
        Object.keys(exampleData).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = exampleData[key];
                input.dispatchEvent(new Event('input')); // Trigger validation
            }
        });

        // Add visual feedback
        event.target.style.background = '#00b894';
        event.target.style.color = 'white';

        setTimeout(() => {
            event.target.style.background = '';
            event.target.style.color = '';
        }, 200);
    }
}

/**
 * Handle input validation in real-time
 * @param {Event} event - Input event
 */
function handleInputValidation(event) {
    const input = event.target;
    const value = parseFloat(input.value);

    // Remove previous validation classes
    input.classList.remove('valid', 'invalid');

    // Validate input
    if (input.value === '') {
        return; // Empty is okay, will be caught during form submission
    }

    if (isNaN(value) || value <= 0) {
        input.classList.add('invalid');
        input.title = 'Please enter a positive number';
    } else {
        input.classList.add('valid');
        input.title = '';
    }
}

/**
 * Show loading state
 */
function showLoading() {
    loadingElement.style.display = 'block';
    document.getElementById('predictBtn').disabled = true;
    document.getElementById('predictBtn').textContent = 'Analyzing...';
    hideResult();
    hideError();
}

/**
 * Hide loading state
 */
function hideLoading() {
    loadingElement.style.display = 'none';
    document.getElementById('predictBtn').disabled = false;
    document.getElementById('predictBtn').textContent = '🔮 Predict Flower Species';
}

/**
 * Show result card
 */
function showResult() {
    resultCard.style.display = 'block';
}

/**
 * Hide result card
 */
function hideResult() {
    resultCard.style.display = 'none';
}

/**
 * Show error card
 */
function showError() {
    errorCard.style.display = 'block';
}

/**
 * Hide error card
 */
function hideError() {
    errorCard.style.display = 'none';
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateFormData,
        getSpeciesDescription,
        EXAMPLE_DATA
    };
}